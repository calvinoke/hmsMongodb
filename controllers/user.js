import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import db from "../Models/index.js";
import { addNotifications } from "./notification.js";

const User = db.user;



export const signup = async (req, res) => {
  try {
    const { firstName, lastName, username, email, password, specialty, phoneNumber } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !username || !email || !password) {
      return res.status(400).json({ message: "All required fields must be provided." });
    }

    if (typeof password !== "string") {
      return res.status(400).json({ message: "Password must be a string." });
    }

    // Check if username or email already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: "Email or username already in use." });
    }

    // Hash password
    const hashedPassword = bcrypt.hashSync(password, 8);

    // Create new user
    const user = new User({
      firstName,
      lastName,
      username,
      email,
      password: hashedPassword,
      specialty,
      phoneNumber,
    });

    // Save user to database
    await user.save();

    // Generate JWT token
    if (!process.env.JWT_SECRET_KEY) {
      console.error("JWT_SECRET_KEY is missing!");
      return res.status(500).json({ message: "Internal server error" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: "24h" });

    // Respond with user details and token
    res.status(201).json({
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      email: user.email,
      phoneNumber: user.phoneNumber,
      specialty: user.specialty,
      accessToken: token,
    });
  } catch (error) {
    console.error("Error in signup:", error);
    res.status(500).json({ message: "Something went wrong. Please try again." });
  }
};


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
      { expiresIn: 86400 },
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
          accessToken: token,
        });

        addNotifications(user._id);
      }
    );
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

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
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).send({ message: "User not found." });
    }

    user.firstName = req.body.firstName;
    user.lastName = req.body.lastName;
    user.username = req.body.username;
    user.email = req.body.email;
    user.specialty = req.body.specialty;
    user.phoneNumber = req.body.phoneNumber;

    await user.save();
    res.status(200).send({
      id: user._id,
      username: user.username,
      email: user.email,
      specialty: user.specialty,
      phoneNumber: user.phoneNumber,
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

export const updatePassword = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).send({ message: "User not found." });
    }

    const passwordIsValid = bcrypt.compareSync(req.body.oldPassword, user.password);
    if (!passwordIsValid) {
      res.status(406).send({ message: "Invalid password!" });
      return;
    }

    user.password = bcrypt.hashSync(req.body.newPassword, 8);
    await user.save();
    res.status(200).send({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};


// Handler
export const uploadProfilePhoto = async (req, res) => {
  try {
    if (!req.body.profilePhotoUrl) {
      return res.status(400).send({ message: "Profile photo URL is required." });
    }

    const userId = req.body.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({ message: "User not found." });
    }

    // Assuming profilePhotoUrl is provided in the request body (e.g., URL or file path)
    user.profilePhoto = req.body.profilePhotoUrl;
    await user.save();

    res.status(200).send({
      message: "Profile photo updated successfully",
      profilePhotoUrl: user.profilePhoto,
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
