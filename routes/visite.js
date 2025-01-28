import express from "express";
import verifyToken from "../middleware/authJwt.js";
import {
  getVisits,
  addVisit,
  getVisitById,
  updateVisit,
  deleteVisit,
} from "../controllers/visit.js"; // Updated file and method names to English

const router = express.Router();

// Retrieve all visits for a specific patient
router.get("/:patientId/all", [verifyToken], getVisits);

// Add a new visit for a specific patient
router.post("/:patientId/add", [verifyToken], addVisit);

// Retrieve a specific visit for a given patient
router.get("/:patientId/:visitId", [verifyToken], getVisitById);

// Update a specific visit
router.put("/:patientId/:visitId", [verifyToken], updateVisit);

// Delete a specific visit
router.delete("/:patientId/:visitId", [verifyToken], deleteVisit);

export default router;
