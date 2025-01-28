import db from "../Models/index.js";

const Patient = db.patient;
const Appointment = db.appointment; // Updated model name from `RendezVous` to `Appointment` for clarity

// Get all appointments
export const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find();

    if (!appointments) {
      res.status(404).send("No appointments found");
      return;
    }
    res.send(appointments);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

export const addAppointment = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.patientId)) {
      return res.status(400).send({ message: 'Invalid Patient ID' });
    }
    const patient = await Patient.findById(req.params.patientId);
    if (!patient) {
      return res.status(404).send("Patient not found");
    }
    const appointment = new Appointment({
      doctorId: req.userId,
      patientId: patient._id,
      appointmentTime: req.body.appointmentTime,
      appointmentDate: req.body.appointmentDate,
    });
    await appointment.save();
    res.send({ message: "Appointment was registered successfully!" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};


// Get an appointment by its ID
export const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.appointmentId);
    if (!appointment) {
      res.status(404).send("Appointment not found");
      return;
    }
    res.send(appointment);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// Delete an appointment
export const deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.appointmentId);
    if (!appointment) {
      res.status(404).send("Appointment not found");
      return;
    }
    await Appointment.deleteOne({ _id: appointment._id });
    res.send({ message: "Appointment was deleted successfully!" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// Update an appointment
export const updateAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.appointmentId);

    if (!appointment) {
      res.status(404).send("Appointment not found");
      return;
    }

    appointment.appointmentTime = req.body.appointmentTime;
    appointment.appointmentDate = req.body.appointmentDate;

    await appointment.save();
    res.send({ message: "Appointment was updated successfully!" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
