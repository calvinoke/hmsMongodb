import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import pool from "./config/dbConnection.js"; // Import the database connection

// Get current directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();

// Configure CORS options
const corsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));

// Serve uploaded images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const port = process.env.PORT || 5000;

// Test the database connection
pool.connect()
  .then(() => console.log("PostgreSQL connected successfully."))
  .catch((err) => {
    console.error("Error connecting to PostgreSQL:", err.message);
    process.exit(1);
  });

// Import and use routers
import userRouter from "./routes/user.js";
app.use("/users", userRouter);

import patientRouter from "./routes/patient.js";
app.use("/patients", patientRouter);

import visitRouter from "./routes/visite.js";
app.use("/visits/", visitRouter);

import appointmentRouter from "./routes/appointment.js";
app.use("/appointments", appointmentRouter);

import prescriptionRouter from "./routes/prescription.js";
app.use("/prescriptions/", prescriptionRouter);

import notificationRouter from "./routes/notification.js";
app.use("/notifications/", notificationRouter);

import detectionRouter from "./routes/detection.js";
app.use("/detection/", detectionRouter);

import historyRouter from "./routes/history.js";
app.use("/history/", historyRouter);

// Define a simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Health Management System 2025..." });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
