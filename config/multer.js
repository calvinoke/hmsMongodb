import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure the 'uploads' directory exists and is writable
const uploadsDir = path.join(__dirname, '../uploads');

fs.access(uploadsDir, fs.constants.W_OK, (err) => {
  if (err) {
    // If the folder is not writable, try creating it with appropriate permissions
    fs.mkdir(uploadsDir, { recursive: true }, (err) => {
      if (err) {
        console.error('Error creating uploads directory:', err);
      } else {
        console.log('Uploads directory is created and is writable');
      }
    });
  } else {
    console.log('Uploads directory is already writable');
  }
});

// Define storage configuration for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir); // Use the ensured 'uploads' directory
  },
  filename: (req, file, cb) => {
    // Use the original name and add a timestamp to prevent file name collisions
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// File filter to accept only image files
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type, only JPEG, PNG, and JPG are allowed'), false);
  }
};

// Configure multer with the storage, fileFilter, and limits
export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5 MB
});
