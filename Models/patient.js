import mongoose from "mongoose";

const Patient = mongoose.model(
  "patient",
  new mongoose.Schema({
    doctorId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    firstName: { 
      type: String, 
      required: true 
    },
    lastName: {
      type: String,
      required: true,
    },
    birthDate: {
      type: Date,
      required: true,
    },
    phone: {
      type: Number,
      required: true,
    },
    email: {
      type: String,
    },
    gender: {
      type: String,
      enum: ["Female", "Male"],
      required: true,
    },
    visitList: [
      { type: mongoose.Types.ObjectId, ref: "Visit", default: [] },
    ],
    maritalStatus: {
      type: String,
      enum: ["Single", "Married", "Divorced", "Widowed"],
    },
    medicalHistory: {
      type: String,
    },
    reasonForConsultation: {
      type: String,
    },
    medications: {
      type: String,
    },
    summaryReport: {
      type: String,
    },
    visitDate: {
      type: Date,
    },
    nextAppointmentDate: {
      type: Date,
    },
    // List of images
    images: [
      {
        type: String,
      },
    ],
    // List of medical reports
    reports: [
      {
        type: String,
      },
    ],
  })
);

export default Patient;
