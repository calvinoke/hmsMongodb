import db from "../Models/index.js";
const Visit = db.visit;
const Patient = db.patient;

// Retrieve all visits...
export const getVisits = async (req, res) => {
  try {
    const visits = await Visit.find();
    if (!visits) res.status(404).send("No visits found");
    res.send(visits);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// Add a new visit for a specific patient
export const addVisit = async (req, res) => {
  const patient = await Patient.findById(req.params.patientId);
  if (patient) {
    const visitCount = await getVisitCount(patient._id);

    const visit = new Visit({
      patientId: patient._id,
      visitNumber: visitCount + 1,
      visitDate: req.body.visitDate,
      consultationReason: req.body.consultationReason,
      // Uncomment below lines if additional fields are needed
      // examination: req.body.examination,
      // diagnosis: req.body.diagnosis,
      // treatment: req.body.treatment,
      // price: req.body.price,
    });
    visit
      .save(visit)
      .then(() => {
        res.send({ message: "Visit added successfully!" });
      })
      .catch((err) => {
        res.status(500).send({ message: err.message });
      });
  } else {
    res.status(404).send("Patient not found");
  }
};

// Helper function to get the number of visits for a patient
const getVisitCount = async (patientId) => {
  try {
    const visitCount = await Visit.find({
      patientId: patientId,
    }).countDocuments();

    return visitCount;
  } catch (err) {
    return 0;
  }
};

// Retrieve a specific visit by its ID
export const getVisitById = async (req, res) => {
  try {
    const visit = await Visit.findById(req.params.visitId);
    if (!visit) res.status(404).send("Visit not found");
    res.send(visit);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// Delete a visit by its ID
export const deleteVisit = async (req, res) => {
  try {
    const visit = await Visit.findById(req.params.visitId);
    if (!visit) res.status(404).send("Visit not found");
    await Visit.deleteOne(visit);
    res.send({ message: "Visit deleted successfully!" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// Update an existing visit by its ID
export const updateVisit = async (req, res) => {
  try {
    const visit = await Visit.findById(req.params.visitId);
    if (!visit) res.status(404).send("Visit not found");
    visit.Visit_Number = req.body.Visit_Number;
    visit.Visit_Date = req.body.Visit_Date;
    visit.Consultation_Reason = req.body.Consultation_Reason;

    // Uncomment below lines if additional fields are updated
    // visit.examination = req.body.examination;
    // visit.diagnosis = req.body.diagnosis;
    // visit.treatment = req.body.treatment;
    // visit.price = req.body.price;

    await visit.save();
    res.send({ message: "Visit updated successfully!" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
