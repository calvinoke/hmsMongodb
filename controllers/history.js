import db from "../Models/index.js";

const History = db.history;

// Function to retrieve all history records
export const getAllHistory = async (req, res) => {
  try {
    // Fetch all history records from the database
    const history = await History.find();

    if (!history) {
      res.status(404).send("No history records found");
      return;
    }
    // Send the retrieved history records
    res.send(history);
  } catch (err) {
    // Handle any server errors
    res.status(500).send({ message: err.message });
  }
};
