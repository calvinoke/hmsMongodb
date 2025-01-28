import express from "express";
import {
  signup,
  signin,
  getProfile,
  updateUser,
  updatePassword,
   uploadProfilePhoto 
} from "../controllers/user.js";
import {
  forgetPassword,
  resetPassword,
} from "../controllers/forgetPassword.js";
import checkDuplicateUsernameOrEmail from "../middleware/verifyDuplicate.js";
import verifyToken from "../middleware/authJwt.js";
import { upload } from "../config/multer.js"; 
// Middleware setup
const uploadMiddleware = upload.single('profilePhoto');


const router = express.Router();

router.post("/signup", [checkDuplicateUsernameOrEmail], signup);
router.post("/signin", signin);
router.get("/profile", [verifyToken], getProfile);
// Router
router.post("/uploadProfilePhoto", [verifyToken, uploadMiddleware], uploadProfilePhoto);
router.put("/profile", [verifyToken], updateUser);

router.get("/verifyToken", [verifyToken], (req, res) => {
  res.status(200).send({ message: "Token is valid" });
});
router.put("/updatePassword", [verifyToken], updatePassword);
router.post("/forgetPassword", forgetPassword);
router.post("/reset-password/:token", resetPassword);
router.post("/logout", (req, res) => {
  res.status(200).send({ accessToken: null });
});

export default router;