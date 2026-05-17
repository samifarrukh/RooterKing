import { configDotenv } from "dotenv";
configDotenv();

import express from "express";
import mongoose from "mongoose";
import session from "express-session";
import path from "path";
import { fileURLToPath } from "url";

import router from "./routes/routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

/* ---------------- VIEW ENGINE ---------------- */
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

/* ---------------- STATIC FILES ---------------- */
app.use(express.static(path.join(__dirname, "public")));

/* ---------------- BODY PARSER ---------------- */
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

/* ---------------- SESSION ---------------- */
app.use(
  session({
    secret: process.env.SESSION_SECRET || "supersecretkey",
    resave: false,
    saveUninitialized: false,
  })
);

/* ---------------- SAFE MONGODB CONNECT (IMPORTANT FIX) ---------------- */
let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;

  try {
    await mongoose.connect(process.env.DB_URL, {
      dbName: "plumberSite",
      serverSelectionTimeoutMS: 5000,
    });

    isConnected = true;
    console.log("Connected to MongoDB");
  } catch (err) {
    console.log("MongoDB Error:", err.message);
  }
};

connectDB();

/* ---------------- ROUTES ---------------- */
app.use("/", router);

/* ---------------- EXPORT ---------------- */
export default app;
