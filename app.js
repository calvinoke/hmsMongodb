import express from 'express';
//import mongoose from 'mongoose';
import connectDb from './config/dbConnection.js';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

const app = express();

const corsOptions = {
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));

// Resolve __dirname equivalent in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve uploaded images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Connect to the database
connectDb();

// Import and use routers
import userRouter from "./routes/user.js";
import patientRouter from "./routes/patient.js";
import visitRouter from "./routes/visite.js";
import appointmentRouter from "./routes/appointment.js";
import prescriptionRouter from "./routes/prescription.js";
import notificationRouter from "./routes/notification.js";
import detectionRouter from "./routes/detection.js";
import historyRouter from "./routes/history.js";

app.use("/users", userRouter);
app.use("/patients", patientRouter);
app.use("/visits", visitRouter);
app.use("/appointments", appointmentRouter);
app.use("/prescriptions", prescriptionRouter);
app.use("/notifications", notificationRouter);
app.use("/detection", detectionRouter);
app.use("/history", historyRouter);

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

export default app;
