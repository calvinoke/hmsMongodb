import express from "express";
import verifyToken from "../middleware/authJwt.js";
import {
  addAppointment,
  deleteAppointment,
  updateAppointment,
  getAllAppointments,
  getAppointmentById,
} from "../controllers/appointment.js"; // Updated file and method names to English

const router = express.Router();

// Retrieve all appointments
router.get("/all", [verifyToken], getAllAppointments);

// Add an appointment for a specific patient
router.post("/:patientId/add", [verifyToken], addAppointment);

// Retrieve a specific appointment for a given patient
router.get("/:patientId/:appointmentId", [verifyToken], getAppointmentById);

// Update a specific appointment
router.put("/:patientId/:appointmentId", [verifyToken], updateAppointment);

// Delete a specific appointment
router.delete("/:patientId/:appointmentId", [verifyToken], deleteAppointment);

export default router;
