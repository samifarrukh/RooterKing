import { configDotenv } from 'dotenv';
configDotenv();
import Booking from "./models/plumber.js";
import mongoose from "mongoose";
import e from 'express';
import router from './routes/routes.js';
import session from "express-session";
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = e();

// 1. PATH FIX: This ensures Vercel sees the views and public folders
const viewsPath = path.join(__dirname, 'views');
app.set('views', viewsPath);
app.set('view engine', 'ejs');
app.use(e.static(path.join(__dirname, 'public')));

app.use(session({
  secret: process.env.SESSION_SECRET || 'supersecretkey',
  resave: false,
  saveUninitialized: false
}));

app.use(e.urlencoded({ extended: true }));
app.use(e.json());

// 2. DB CONNECTION: plumberSite is the correct DB name
mongoose.connect(process.env.DB_URL, {
    dbName: "plumberSite",
}).then(() => {
    console.log("Connected to MongoDB");
}).catch(err => {
    console.log("MongoDB Error:", err);
});

// 3. ROUTER: Ensure this comes AFTER all app.set/app.use
app.use("/", router);

export default app;
