import mongoose from "mongoose";

let isConnected = false;

const connectDb = async () => {
  if (isConnected) {
    console.log("Using existing database connection");
    return;
  }
  
  try {
    const db = await mongoose.connect(process.env.CONNECTION_STRING, { 
      useNewUrlParser: true, 
      useUnifiedTopology: true 
    });
    isConnected = db.connections[0].readyState;
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
};

export default connectDb;
