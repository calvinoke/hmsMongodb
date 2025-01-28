import db from "../Models/index.js";

const Notification = db.notification;
const User = db.user;
const Appointment = db.appointment;

// Retrieve all notifications
export const getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find();

    if (!notifications) {
      res.status(404).send("No notifications found");
      return;
    }
    res.send(notifications);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// Retrieve a notification by its ID
export const getNotificationById = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      res.status(404).send("Notification not found");
      return;
    }
    // Mark the notification as read
    notification.viewed = true;
    res.send(notification);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// Delete a notification by its ID
export const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      res.status(404).send("Notification not found");
      return;
    }
    await Notification.deleteOne(notification);
    res.send({ message: "Notification was deleted successfully!" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// Retrieve unread notifications
export const getUnreadNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({  viewed: false });
    if (!notifications) {
      res.status(404).send("No notifications found");
      return;
    }
    res.send(notifications);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// Add notifications for a specific user
export const addNotifications = async (userId) => {
  try {
    const user = await User.findById(userId);
    const appointments = await Appointment.find({
      doctorId: userId,
      appointmentDate: { $gte: new Date().setHours(0, 0, 0, 0) },
    });
    appointments.forEach((appointment) => {
      const notification = new Notification({
        doctorId: user._id,
        appointmentId: appointment._id,
        patientFirstName: appointment.patientId.firstName,
        patientLastName: appointment.patientId.lastName,
        message: `You have an appointment with ${appointment.patientId.firstName} ${appointment.patientId.lastName} at ${appointment.appointmentTime}`,
        date: appointment.appointmentDate,
      });
      notification.save();
    });
  } catch (err) {
    console.log(err);
  }
};
