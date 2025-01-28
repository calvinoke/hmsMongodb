import mongoose from "mongoose";

const Prescription = mongoose.model(
  "Prescription",
  new mongoose.Schema({
    Visit_Id: {
      type: mongoose.Types.ObjectId,
      ref: "Visit",
      required: true,
    },
    Prescription_Date: {
      type: Date,
      default: Date.now,
    },

    Medications: [
      {
        name: {
          type: String,
        },
        dosage: {
          type: String,
        },
        duration: {
          type: String,
        },
      },
    ],
  })
);

const Visit = mongoose.model(
  "Visits",
  new mongoose.Schema({
    patientId: {
      type: mongoose.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    Visit_Number: {
      type: Number,
    },
    Visit_Date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    Consultation_Reason: {
      type: String,
    },
    report: {
      type: String,
    },
    Image_List: [
      {
        type: String,
      },
    ],
    generated_report: {
      type: String,
    },
  })
);

export { Visit, Prescription };
