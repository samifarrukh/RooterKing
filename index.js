import { configDotenv } from 'dotenv';
configDotenv();
import { MongoClient } from "mongodb";
import  Booking  from "./models/plumber.js";
import mongoose from "mongoose";
import e from 'express';
import router from './routes/routes.js';
import session from "express-session";
 const app = e();
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));


app.use(e.static('public'));
 app.set('view engine','ejs')
app.use(e.urlencoded({ extended: true }));
app.use(e.json());

await mongoose.connect(process.env.DB_URL, {
    dbName: "plumberSite"
});
    console.log("____connect________")

async function  dbConnection(){
    
    const res = await Booking.find();
    console.log(res);
}

console.log("DB NAME:", mongoose.connection.name);
dbConnection();
app.get("/",router);
app.get("/about",router);
app.get("/contact",router);
app.get("/services",router);
app.get("/dashboard",router);
app.get("/login",router);
app.post("/login",router);
app.get("/logout",router);
app.post("/booking",router);
app.post("/delete/:id",router);
app.post("/status/:id",router);
app.listen(4000)
