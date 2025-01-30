import AWS from 'aws-sdk';
import dotenv from 'dotenv';
import multer from 'multer';
import multerS3 from 'multer-s3';
import { fileURLToPath } from 'url';
import path from 'path';

// Load environment variables from .env file
dotenv.config();

// Resolve __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure AWS S3
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION, // Ensure you provide the region parameter
});

// Define S3 Storage for Multer
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_S3_BUCKET_NAME, // Ensure you set this in your .env file
    acl: 'public-read', // Adjust permissions as needed
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      cb(null, `uploads/${Date.now()}-${file.originalname}`); // Customize the S3 file path
    },
  }),
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type, only JPEG, PNG, and JPG are allowed'), false);
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
});

export { upload };
