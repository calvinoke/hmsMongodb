import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import db from "../Models/index.js";
import { addNotifications } from "./notification.js";
import { upload } from "../config/multer.js";  // Assuming multer config is in the config folder
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Use these lines to get the equivalent of __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const User = db.user;

export const signup = (req, res) => {
  upload.single('profilePhoto')(req, res, (err) => {
    if (err) {
      return res.status(400).send({ message: err.message });
    }

    let profilePhoto = { base64: null, mimeType: null };

    if (req.file) {
      const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
      if (!validImageTypes.includes(req.file.mimetype)) {
        return res.status(400).send({ message: 'Unsupported image format' });
      }

      const imagePath = path.join(__dirname, '../uploads', req.file.filename);
      fs.readFile(imagePath, (err, data) => {
        if (err) {
          return res.status(500).send({ message: "Error reading image file" });
        }
        profilePhoto = {
          base64: `data:${req.file.mimetype};base64,${data.toString('base64')}`,
          mimeType: req.file.mimetype
        };
        saveUserData(profilePhoto);
      });
    } else {
      profilePhoto = { base64: "/default-profile.png", mimeType: "image/png" };
      saveUserData(profilePhoto);
    }

    function saveUserData(profilePhoto) {
      const password = req.body.password;
      if (!password || typeof password !== 'string') {
        return res.status(400).send({ message: 'Password is required and must be a string' });
      }

      const hashedPassword = bcrypt.hashSync(password, 8);

      const user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
        specialty: req.body.specialty,
        phoneNumber: req.body.phoneNumber,
        profilePhoto
      });

      user
        .save()
        .then(() => {
          jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET_KEY,
            { expiresIn: 86400 },
            (err, token) => {
              if (err) {
                return res.status(500).send({ message: err.message });
              }
              res.status(200).send({
                firstName: user.firstName,
                lastName: user.lastName,
                username: user.username,
                email: user.email,
                phoneNumber: user.phoneNumber,
                specialty: user.specialty,
                profilePhoto: user.profilePhoto,
                accessToken: token
              });
            }
          );
        })
        .catch((err) => {
          res.status(500).send({ message: err.message });
        });
    }
  });
};

// User Login
export const signin = async (req, res) => {
  try {
    const user = await User.findOne({
      $or: [{ username: req.body.username }, { email: req.body.username }],
    });

    if (!user) {
      res.status(404).send({ message: "User not found." });
      return;
    }

    const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
    if (!passwordIsValid) {
      res.status(401).send({
        accessToken: null,
        message: "Invalid password!",
      });
      return;
    }

    jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: 86400 }, // 24 hours
      (err, token) => {
        if (err) {
          res.status(500).send({ message: err.message });
          return;
        }
        res.status(200).send({
          firstName: user.firstName,
          lastName: user.lastName,
          username: user.username,
          email: user.email,
          phoneNumber: user.phoneNumber,
          specialty: user.specialty,
          profilePhoto: user.profilePhoto, // Added profilePhoto to the response
          accessToken: token,
        });

        // Add notifications for all appointments the user has today
        addNotifications(user._id);
      }
    );
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// Get User Profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).send({ message: "User not found." });
    }
    res.status(200).send({
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      email: user.email,
      specialty: user.specialty,
      phoneNumber: user.phoneNumber,
      profilePhoto: user.profilePhoto, // Added profilePhoto to the response
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// Update User Details
export const updateUser = async (req, res) => {
  try {
    // Use multer to handle the file upload
    upload.single('profilePhoto')(req, res, async (err) => {
      if (err) {
        return res.status(400).send({ message: err.message });
      }

      const user = await User.findById(req.userId);
      if (!user) {
        return res.status(404).send({ message: "User not found." });
      }

      // Update user details
      user.firstName = req.body.firstName;
      user.lastName = req.body.lastName;
      user.username = req.body.username;
      user.email = req.body.email;
      user.specialty = req.body.specialty;
      user.phoneNumber = req.body.phoneNumber;

      // Only update profile photo if a new one is provided
      if (req.file) {
        user.profilePhoto = `/uploads/${req.file.filename}`;
      }

      await user.save();
      res.status(200).send({
        id: user._id,
        username: user.username,
        email: user.email,
        specialty: user.specialty,
        phoneNumber: user.phoneNumber,
        profilePhoto: user.profilePhoto,
      });
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};


// Update User Password
export const updatePassword = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).send({ message: "User not found." });
    }

    const passwordIsValid = bcrypt.compareSync(req.body.oldPassword, user.password);
    if (!passwordIsValid) {
      res.status(406).send({
        message: "Invalid password!",
      });
      return;
    }

    user.password = bcrypt.hashSync(req.body.newPassword, 8);
    await user.save();
    res.status(200).send({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// controllers/userController.js

// Handler
export const uploadProfilePhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send({ message: "No file uploaded." });
    }

    const userId = req.body.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({ message: "User not found." });
    }

    user.profilePhoto = `/uploads/${req.file.filename}`;
    await user.save();

    res.status(200).send({
      message: "Profile photo updated successfully",
      profilePhotoUrl: user.profilePhoto,
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

