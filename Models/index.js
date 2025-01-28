import mongoose from "mongoose";
mongoose.Promise = global.Promise;
import User from "./user.js";
import Patient from "./patient.js";
import { Visit, Prescription } from "./visite.js";  // Changed to English
import Appointment from "./rendezvous.js";  // Changed to English
import Notification from "./notifications.js";
import ActionHistory from "./History.js";  // Changed to English

const db = {};

db.mongoose = mongoose;

db.user = User;
db.patient = Patient;
db.visit = Visit;  // Changed to English
db.appointment = Appointment;  // Changed to English
db.prescription = Prescription;  // Changed to English
db.notification = Notification;
db.actionHistory = ActionHistory;  // Changed to English

export default db;
