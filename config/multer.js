import multer from 'multer';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

// Resolve __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadsDir = '/tmp/uploads';

fs.mkdir(uploadsDir, { recursive: true }, (err) => {
  if (err) {
    console.error('Error creating uploads directory:', err);
  } else {
    console.log('Uploads directory is created and writable');
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
