const express = require("express");
const connectDb = require("./config/dbConnection");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

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
app.use("/visits/", visitRouter);

const appointmentRouter = require("./routes/appointment");
app.use("/appointments", appointmentRouter);

const prescriptionRouter = require("./routes/prescription");
app.use("/prescriptions/", prescriptionRouter);

const notificationRouter = require("./routes/notification");
app.use("/notifications/", notificationRouter);

const detectionRouter = require("./routes/detection");
app.use("/detection/", detectionRouter);

const historyRouter = require("./routes/history");
app.use("/history/", historyRouter);

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

module.exports = app;
