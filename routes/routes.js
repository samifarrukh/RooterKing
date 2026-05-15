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
        return res.render("login", {
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

router.get("/dashboard", async (req,resp)=>{
  try {
    if (!req.session.user) {
      return resp.redirect("/login");
    }
    const booking = await Booking.find().sort({createdAt : -1});
    resp.render("dashboard",{
      booking
    })
  } catch (error) {
      console.log(error);
    resp.send("Error loading dashboard");
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