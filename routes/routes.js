import mongoose from "mongoose";
import e from "express";
const router = e.Router();
import Booking from "../models/plumber.js";
import session from "express-session";
// login page
router.get("/login", (req,resp)=>{
  resp.render("login",{error :null});
})
router.post("/login",(req,resp)=>{
    try {
      const {username,password} = req.body;
       if (username === process.env.LOGIN_USERNAME && password === process.env.LOGIN_PASSWORD) {
        req.session.user = username;
        return resp.redirect("/dashboard")
       }
        return resp.render("login", {
        error: "❌ Invalid username or password"
    });
    } catch (error) {
      console.log(error)
    }
  })
// logout page 
router.get("/logout",(req,resp)=>{
  req.session.destroy(()=>{
 resp.redirect("/login");
  });
 
})
// home page 
// Routes
router.get('/', (req, res) => {
  res.render('homepage', { title: 'Fast & Reliable Plumbing Services' });
});
// about page
router.get('/about', (req, res) => {
  res.render('about', { title: 'About Us - Reliable Plumbing Pros' });
});

// contact page
router.get('/contact', (req, res) => {
  const success = req.query.success;
  res.render('contact',
     { title: 'Book Your Service - Contact Us',
      success ,
      message : 'we received your request! thanks'
      });
});

router.get('/services', (req, res) => {
  const services = [
    {
      title: 'Emergency Plumbing',
      description: '24/7 rapid response for burst pipes, flooding, or severe leaks. We arrive within 60 minutes.',
      image: '/images/Gemini_Generated_Image_x7my22x7my22x7my.png',
      features: ['24/7 Response', 'Priority Dispatch', 'Damage Control']
    },
    {
      title: 'Drain Cleaning',
      description: 'High-pressure water jetting and fiber-optic camera inspections to clear even the toughest clogs.',
      image: '/images/Gemini_Generated_Image_lwo6jnlwo6jnlwo6.png',
      features: ['CCTV Inspections', 'Root Removal', 'Hydro-Jetting']
    },
    {
      title: 'Water Heaters',
      description: 'Full installation and repair services for electric, gas, and tankless water heating systems.',
      image: '/images/Gemini_Generated_Image_5wr3615wr3615wr3.png',
      features: ['Tankless Systems', 'Gas & Electric', 'Efficiency Upgrades']
    }
  ];
  res.render('service', { title: 'Our Professional Plumbing Services', services });
});

// gettting value form booking ?? ?

router.post("/booking", async (req,resp)=>{
  try {
     const { name, email, phone, service, message } = req.body;

    const newBooking = new Booking({
        name,
        email,
        phone,
        service,
        message,
        status: "Pending" // ✅ DEFAULT FIX
    });

    await newBooking.save();
    resp.redirect('/contact?success=true')
  
  } catch (error) {
      console.log(error);
    resp.send("Error saving booking");
  }
})

router.get("/dashboard", async (req, resp) => {
  try {
    // 1. SESSION CHECK: Ensure only you (the owner) can see this
    if (!req.session.user) {
      console.log("Access Denied: No User Session");
      return resp.redirect("/login");
    }

    // 2. DATABASE HANDSHAKE: This prevents the 'Status 2' crash
    // If we aren't connected (Status 1), we wait for the connection to finish
    if (mongoose.connection.readyState !== 1) {
      console.log("DB Status is " + mongoose.connection.readyState + ". Waiting for connection...");
      await mongoose.connect(process.env.DB_URL, { 
        dbName: "plumberSite" 
      });
      console.log("Successfully connected to MongoDB for dashboard query.");
    }

    // 3. FETCH DATA: Get all plumbing requests from MongoDB
    // We use allBookings as a variable name to avoid confusion with the model
    const allBookings = await Booking.find().sort({ createdAt: -1 });
    console.log(`Successfully fetched ${allBookings.length} bookings.`);

    // 4. RENDER: Send the data to your dashboard.ejs file
    resp.render("dashboard", {
      booking: allBookings
    });

  } catch (error) {
    // This will show exactly what went wrong in your Vercel logs
    console.error("CRITICAL DASHBOARD ERROR:", {
      message: error.message,
      stack: error.stack
    });

    // We send a 500 status so you know the server had an issue
    resp.status(500).send("System Error: " + error.message);
  }
});

router.post("/delete/:id", async (req,resp)=>{
  await Booking.findByIdAndDelete(req.params.id);
  resp.redirect('/dashboard');
});

router.post('/status/:id', async (req,resp)=>{
  const {status} = req.body;
  await Booking.findByIdAndUpdate(req.params.id, {status});
  resp.redirect("/dashboard");
})

export default router;
