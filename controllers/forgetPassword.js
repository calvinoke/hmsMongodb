import db from "../Models/index.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";

const User = db.user;

// Function to handle forgotten password requests
export const forgetPassword = async (req, res) => {
  try {
    // Find the user by their email address
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    // Generate a unique JWT token containing the user's ID
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "10m",
    });

    // Set up the email transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Define the email content object...
    const mailOptions = {
      from: process.env.EMAIL,
      to: req.body.email,
      subject: "Reset Password",
      html: `
        <h1>Reset Your Password</h1>
        <p>Click the link below to reset your password:</p>
        <a href="http://localhost:3000/reset-password/${token}">Reset Password</a>
        <p>This link will expire in 10 minutes.</p>
        <p>If you did not request a password reset, please ignore this email.</p>
      `,
    };

    // Send the email
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        return res.status(500).send({ message: err.message });
      }
      res.status(200).send({ message: "Email sent successfully" });
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// Function to handle password reset
export const resetPassword = async (req, res) => {
  try {
    // Verify the JWT token from the request
    const decodedToken = jwt.verify(
      req.params.token,
      process.env.JWT_SECRET_KEY
    );

    // If the token is invalid, return an error
    if (!decodedToken) {
      return res.status(401).send({ message: "Invalid token" });
    }

    // Find the user by the ID in the decoded token
    const user = await User.findOne({ _id: decodedToken.userId });
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.newPassword, salt);

    // Update the user's password by replacing with the hashed password...
    user.password = hashedPassword;
    await user.save();

    res.status(200).send({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
