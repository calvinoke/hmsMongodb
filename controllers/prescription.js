import db from "../Models/index.js";

const Prescription = db.prescription;
const Visit = db.visit;

// Retrieve all prescriptions for a specific visit
export const getPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Prescription.find({
      Visit_Id: req.params.idV,
    });
    if (!prescriptions || prescriptions.length === 0) {
      res.status(404).send("No prescriptions found");
    } else {
      res.send(prescriptions);
    }
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// Add a new prescription for a specific visit
export const addPrescription = async (req, res) => {
  try {
    const visit = await Visit.findById(req.params.idV);
    if (visit) {
      const prescription = new Prescription({
        Visit_Id: visit._id,
        Medications: req.body.Medications, // Corrected the key from `Medicaments` to `Medications`
      });
      await prescription.save();
      res.send({ message: "Prescription was added successfully!" });
    } else {
      res.status(404).send("Visit not found");
    }
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// Retrieve a specific prescription by its ID
export const getPrescriptionById = async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.idP); // Changed `idO` to `idP` for clarity
    if (!prescription) {
      res.status(404).send("No prescription found");
    } else {
      res.send(prescription);
    }
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// Update a specific prescription by its ID
export const updatePrescription = async (req, res) => {
  try {
    const prescription = await Prescription.findByIdAndUpdate(
      req.params.idP, // Changed `idO` to `idP` for consistency
      req.body,
      { new: true, useFindAndModify: false } // `new: true` to return the updated document
    );
    if (!prescription) {
      res.status(404).send("No prescription found");
    } else {
      res.send({ message: "Prescription was updated successfully!" });
    }
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// Delete a specific prescription by its ID
export const deletePrescription = async (req, res) => {
  try {
    const prescription = await Prescription.findByIdAndDelete(req.params.idP); // Changed `idO` to `idP` for consistency
    if (!prescription) {
      res.status(404).send("No prescription found");
    } else {
      res.send({ message: "Prescription was deleted successfully!" });
    }
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
