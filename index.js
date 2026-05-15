import { configDotenv } from 'dotenv';
configDotenv();
import Booking from "./models/plumber.js";
import mongoose from "mongoose";
import e from 'express';
import router from './routes/routes.js';
import session from "express-session";
import path from 'path';
import { fileURLToPath } from 'url';

// These two lines are crucial for Vercel to find your folders
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = e();

// Use path.join so Vercel knows exactly where your files are
app.use(e.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(session({
  secret: process.env.SESSION_SECRET || 'fallbacksecret',
  resave: false,
  saveUninitialized: false
}));

app.use(e.urlencoded({ extended: true }));
app.use(e.json());

// Connecting to DB using .then() to prevent the server from hanging
mongoose.connect(process.env.DB_URL, {
    dbName: "plumberSite"
}).then(() => {
    console.log("____connected to mongo________");
}).catch(err => {
    console.log("DB Connection Error:", err);
});

// This covers all the routes you defined in your router file
app.use("/", router);

// EXTREMELY IMPORTANT: Vercel needs this export to work
export default app;
