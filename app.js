const express = require("express");
const connectDb = require("./config/dbConnection");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

dotenv.config(); // Load environment variables
const app = express();

// Configure CORS options
const corsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};

app.use(express.json()); // For parsing application/json
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded
app.use(cors(corsOptions)); // Apply CORS options

// Serve uploaded images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Connect to the database
connectDb();

// Import and use routers
const userRouter = require("./routes/user");
app.use("/users", userRouter);

const patientRouter = require("./routes/patient");
app.use("/patients", patientRouter);

const visitRouter = require("./routes/visite");
app.use("/visits", visitRouter);

const appointmentRouter = require("./routes/appointment");
app.use("/appointments", appointmentRouter);

const prescriptionRouter = require("./routes/prescription");
app.use("/prescriptions", prescriptionRouter);

const notificationRouter = require("./routes/notification");
app.use("/notifications", notificationRouter);

const detectionRouter = require("./routes/detection");
app.use("/detection", detectionRouter);

const historyRouter = require("./routes/history");
app.use("/history", historyRouter);

// Export for Vercel serverless functions
module.exports = app;
