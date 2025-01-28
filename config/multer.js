import multer from 'multer';
import path from 'path';

// Define storage configuration for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Folder where files will be stored
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

// Configure multer
export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5 MB
});
