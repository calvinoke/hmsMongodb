import mongoose from "mongoose";

// Define the enum for resource types
const ActionTypes = {
  CREATE: "Create",  // Changed to uppercase for consistency
  UPDATE: "Update",
  DELETE: "Delete",
  READ: "Read",
};

const ActionHistory = mongoose.model(  // Changed to English
  "actionHistories",  // Changed to plural and English
  new mongoose.Schema({
    ResourceId: {  // Changed to English
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    ResourceName: {  // Changed to English
      type: String,
      required: true,
    },

    actionType: {
      type: String,
      enum: Object.values(ActionTypes),
      required: true,
    },
    timestamp: { type: Date, default: Date.now },
  })
);

export default ActionHistory;
