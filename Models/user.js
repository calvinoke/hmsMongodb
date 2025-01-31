import mongoose from "mongoose";

const allowedSpecialties = [
  "generalPractitioner",
  "surgeon",
  "gynecologist",
  "cardiologist",
  "dermatologist",
  "pediatrician",
  "neurologist",
  "radiologist",
  "other",
];

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    lastName: { type: String, required: true },
    firstName: { 
      type: String, 
      required: true,
    },
    username: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    specialty: {
      type: String,
      enum: allowedSpecialties,
    },
    phoneNumber: {
      type: Number,
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpires: {
      type: Date,
    },
  })
);

export default User;