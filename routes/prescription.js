import express from "express";
import verifyToken from "../middleware/authJwt.js";
import {
  getPrescriptions,
  addPrescription,
  getPrescriptionById,
  updatePrescription,
  deletePrescription,
} from "../controllers/prescription.js"; // Updated file and method names to English

const router = express.Router();

// Get all prescriptions for a specific patient and visit
router.get("/:patientId/:visitId/all", [verifyToken], getPrescriptions);

// Add a new prescription for a specific patient and visit
router.post("/:patientId/:visitId/add", [verifyToken], addPrescription);

// Get a specific prescription by its ID
router.get("/:patientId/:visitId/:prescriptionId", [verifyToken], getPrescriptionById);

// Update a specific prescription by its ID
router.put("/:patientId/:visitId/:prescriptionId", [verifyToken], updatePrescription);

// Delete a specific prescription by its ID
router.delete("/:patientId/:visitId/:prescriptionId", [verifyToken], deletePrescription);

export default router;
