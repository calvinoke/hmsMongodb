import express from "express";
import verifyToken from "../middleware/authJwt.js";
import { detectTumor } from "../controllers/tumorDetection.js";  // Changed to English
const router = express.Router();

router.post("/upload", [verifyToken], detectTumor); // Add a tumor detection for a given patient

export default router;
