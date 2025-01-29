import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDb from './config/dbConnection.js';

// Load environment variables
dotenv.config();

const app = express();

// CORS configuration (allowing specific frontend)
const corsOptions = {
  origin: 'https://frontend-mongodb-c9w5.vercel.app', // Allow requests from your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow specific HTTP methods
  credentials: true, // If you're using cookies or authentication
};

app.use(cors(corsOptions)); // Use CORS middleware with specific options

// Middleware to parse JSON and URL encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Resolve __dirname equivalent in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve uploaded images from the "uploads" directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to the database
connectDb();

// Import and use routers
import userRouter from './routes/user.js';
import patientRouter from './routes/patient.js';
import visitRouter from './routes/visite.js';
import appointmentRouter from './routes/appointment.js';
import prescriptionRouter from './routes/prescription.js';
import notificationRouter from './routes/notification.js';
import detectionRouter from './routes/detection.js';
import historyRouter from './routes/history.js';

app.use('/users', userRouter);
app.use('/patients', patientRouter);
app.use('/visits', visitRouter);
app.use('/appointments', appointmentRouter);
app.use('/prescriptions', prescriptionRouter);
app.use('/notifications', notificationRouter);
app.use('/detection', detectionRouter);
app.use('/history', historyRouter);

// Set the port
const port = process.env.PORT || 5000;

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;
