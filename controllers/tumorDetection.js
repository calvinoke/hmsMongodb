import * as tf from "@tensorflow/tfjs";

import fs from "fs";

// Load the TensorFlow.js model (Uncomment and provide the model path)
// Example: const TumorModel = await tf.loadLayersModel("file://path/to/your/model");

// Define labels for tumor types
const classLabels = {
  0: "Adenocarcinoma",
  1: "Large Cell Carcinoma",
  2: "Normal",
  3: "Squamous Cell Carcinoma",
};

// Define treatment recommendations for each tumor type
const treatments = {
  0: "Adenocarcinoma is typically treated with surgery, chemotherapy, and targeted therapy.",
  1: "Large Cell Carcinoma may require surgery, chemotherapy, and radiation therapy.",
  3: "Squamous Cell Carcinoma treatment often includes surgery, radiation therapy, and immunotherapy.",
};

// Preprocess the input image
const preprocessImage = (imagePath) => {
  // Load and decode the image
  const image = tf.node.decodeImage(fs.readFileSync(imagePath));

  // Resize the image to 224x224 pixels, the input size expected by the model
  const resizedImage = image.resizeBilinear([224, 224]).toFloat();

  // Add a batch dimension (1) to match the model's expected input shape
  const expandedImage = resizedImage.expandDims(0);

  // Normalize the pixel values to the range [-1, 1]
  return expandedImage.div(127.5).sub(1.0);
};

// Predict the tumor class from the image
const predictTumorClass = (imagePath, model) => {
  // Preprocess the image
  const processedImage = preprocessImage(imagePath);

  // Use the model to predict tumor type
  const predictions = model.predict(processedImage);

  // Identify the class with the highest probability
  const predictedClassIndex = predictions.argMax(1).dataSync()[0];

  return predictedClassIndex;
};

// Endpoint to detect tumor and recommend treatments
export const detectTumor = async (req, res) => {
  try {
    // Extract and decode the base64 image from the request body
    const base64Image = req.body.image;
    const imageBuffer = Buffer.from(base64Image, "base64");

    // Save the decoded image temporarily on the server
    const tempImagePath = "/tmp/image.png";
    fs.writeFileSync(tempImagePath, imageBuffer);

    // Predict the tumor type using the preloaded model
    const predictedClass = predictTumorClass(tempImagePath, TumorModel);

    // Get the label and treatment corresponding to the predicted tumor type
    const predictedClassLabel = classLabels[predictedClass];
    const treatment = treatments[predictedClass];

    // Remove the temporary image file after prediction
    fs.unlinkSync(tempImagePath);

    // Return the prediction and treatment as the response
    res.send({ predictedClassLabel, treatment });
  } catch (error) {
    console.error("Error during tumor detection:", error);
    res.status(500).send({ error: "An error occurred while detecting the tumor." });
  }
};
