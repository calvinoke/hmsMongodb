import express from "express";
import verifyToken from "../middleware/authJwt.js";
import {
  addPatient,
  getPatients,
  getPatientById,
  updatePatient,
  deletePatient,
} from "../controllers/patient.js";

import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import path from "path";

const router = express.Router();

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "storage/"); // Specify the storage folder
  },
  filename: (req, file, cb) => {
    cb(null, `${uuidv4()}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

// File filter to allow only specific file types
const fileFilter = (req, file, cb) => {
  const allowedFileTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/msword",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "text/plain",
  ];

  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true); // Accept the file
  } else {
    cb(new Error("Invalid file type"), false); // Reject the file
  }
};

// Initialize multer with storage and file filter
const upload = multer({ storage, fileFilter });

// Routes
router.post(
  "/add",
  verifyToken,
  upload.fields([
    { name: "images", maxCount: 5 }, // Field name 'images'
    { name: "reports", maxCount: 5 }, // Field name 'reports' (English equivalent of 'bilans')
  ]),
  (req, res, next) => {
    try {
      // Log files and body for debugging
      console.log(req.files);
      console.log(req.body);

      // Proceed to the controller
      addPatient(req, res);
    } catch (error) {
      next(error); // Pass errors to the error handler
    }
  }
);

// Other routes
router.get("/all", verifyToken, getPatients);
router.get("/:id", verifyToken, getPatientById);
router.put("/:id", verifyToken, updatePatient);
router.delete("/:id", verifyToken, deletePatient);

export default router;
