import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import connectDb from "./config/dbConnection.js";

// Load environment variables
dotenv.config();

const app = express();

// ✅ Enable CORS properly (before defining any routes)
const corsOptions = {
  origin: "https://hms-mongodb-i4y6.vercel.app",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization", "x-access-token"],
  credentials: true,
};

app.use(cors(corsOptions));

// ✅ Additional CORS Headers for Debugging
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://frontend-mongodb-qjah.vercel.app");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, x-access-token");
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  next();
});

// ✅ Middleware (JSON Parsing & Static Files)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Resolve __dirname equivalent in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Connect to Database
connectDb();

// ✅ Import and use routers
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

// ✅ Start Server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error", error: err.message });
});

export default app;
