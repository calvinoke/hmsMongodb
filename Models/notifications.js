import mongoose from "mongoose";

const Notification = mongoose.model(
  "Notification",
  new mongoose.Schema({
    doctorId: { // Changed from "medecinId"
      type: mongoose.Types.ObjectId,
      ref: "User", // Assumes "User" refers to the doctor
    },
    appointmentId: { // Changed from "rendezVousId"
      type: mongoose.Types.ObjectId,
      ref: "Appointment", // Assumes "RendezVous" is now "Appointment"
    },
    patientLastName: { // Changed from "NomPatient"
      type: String,
      required: true,
    },
    patientFirstName: { // Changed from "prenomPatient"
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    viewed: { // Changed from "vu"
      type: Boolean,
      default: false,
    },
  })
);

export default Notification;
