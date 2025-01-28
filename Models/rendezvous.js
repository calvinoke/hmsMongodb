import mongoose from "mongoose";

// Schema for available appointment slots
const Appointment = mongoose.model(
  "AppointmentList",
  new mongoose.Schema({
    doctorId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    patientId: {
      type: mongoose.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    appointmentTime: {
      type: String,
      required: true,
    },
    appointmentDate: {
      type: String,
      required: true,
    },
  })
);

export default Appointment;
