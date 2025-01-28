import express from "express";
import connectDb from "./config/dbConnection.js";
import dotenv from "dotenv";
import cors from "cors";
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);




dotenv.config(); // Load environment variables
const app = express();

// Configure CORS options
const corsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};

app.use(express.json());  // For parsing application/json
app.use(express.urlencoded({ extended: true }));  // For parsing application/x-www-form-urlencoded


app.use(cors(corsOptions)); // Apply CORS options
app.use(express.json({ extended: false })); // Parse JSON requests

// Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const port = process.env.PORT || 5000; // Set the port number

// Connect to the database
connectDb();

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
  res.json({ message: "Welcome to Health Management System..." });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
