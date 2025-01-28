import db from "../Models/index.js";
const Patient = db.patient;
import mongoose from 'mongoose';

export const getPatients = async (req, res) => {
  try {
    const patients = await Patient.find({ doctorId: req.userId });
    if (!patients) return res.status(404).send("No patients found");
    res.send(patients);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};



export const addPatient = async (req, res) => {
  try {
    const { firstName, lastName, birthDate, phone, gender } = req.body;

    if (!firstName || !lastName || !birthDate || !phone || !gender) {
      return res.status(400).send({
        message: "Missing required fields: firstName, lastName, birthDate, phone, or gender.",
      });
    }

    console.log("Request body:", req.body);
    console.log("Request files:", req.files);

    let photos = [];
    let reports = [];

    if (req.files) {
      if (req.files.images) photos = req.files.images;
      if (req.files.reports) reports = req.files.reports;
    }

    const patient = new Patient({
      doctorId: req.userId,
      firstName,
      lastName,
      birthDate,
      phone,
      gender,
      email: req.body.email,
      maritalStatus: req.body.maritalStatus,
      medicalHistory: req.body.medicalHistory,
      reasonForConsultation: req.body.reasonForConsultation,
      medications: req.body.medications,
      summaryReport: req.body.summaryReport,
      visitDate: req.body.visitDate,
      nextAppointmentDate: req.body.nextAppointmentDate,
      images: photos.map((photo) => photo.path),
      reports: reports.map((report) => report.path),
    });

    await patient.save();
    res.send({ message: "Patient was registered successfully!" });
  } catch (err) {
    console.error(err); // Log the error for debugging
    res.status(500).send({ message: err.message });
  }
};


export const getPatientById = async (req, res) => {
  const { id } = req.params;

  // Validate if the id is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send('Invalid patient ID');
  }

  try {
    const patient = await Patient.findById(id);
    if (!patient) {
      return res.status(404).send("Patient not found");
    }
    res.send(patient);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};


//import Patient from '../models/Patient'; // Adjust the path as necessary
// Update the path accordingly

export const updatePatient = async (req, res) => {
  const { id } = req.params;

  // Check if ID is a valid MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({ message: "Invalid patient ID" });
  }

  try {
    const patient = await Patient.findById(id);

    // Handle case where patient is not found
    if (!patient) {
      return res.status(404).send({ message: "Patient not found" });
    }

    // Update patient fields dynamically based on req.body
    Object.keys(req.body).forEach(field => {
      if (req.body[field] !== undefined && patient[field] !== undefined) {
        patient[field] = req.body[field];
      }
    });

    // Save the updated patient document
    await patient.save();

    res.status(200).send({ message: "Patient updated successfully", patient });
  } catch (error) {
    res.status(500).send({ message: "Internal server error", error: error.message });
  }
};



export const deletePatient = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) return res.status(404).send("Patient not found");

    await Patient.deleteOne({ _id: req.params.id });
    res.send({ message: "Patient was deleted successfully!" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
