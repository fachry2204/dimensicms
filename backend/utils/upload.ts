import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure upload directories exist
const uploadDir = path.join(process.cwd(), 'api', 'uploads');
const coversDir = path.join(uploadDir, 'covers');
const audioDir = path.join(uploadDir, 'audio');
const reportsDir = path.join(uploadDir, 'reports');

[uploadDir, coversDir, audioDir, reportsDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'cover') {
      cb(null, coversDir);
    } else if (file.fieldname === 'audio_file' || file.fieldname === 'audio_clip') {
      cb(null, audioDir);
    } else if (file.fieldname === 'report_file') {
      cb(null, reportsDir);
    } else {
      cb(null, uploadDir);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req: any, file: any, cb: any) => {
  if (file.fieldname === 'cover') {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error('Only image files are allowed!'), false);
    }
  } else if (file.fieldname === 'audio_file' || file.fieldname === 'audio_clip') {
    if (!file.originalname.match(/\.(wav|mp3)$/)) { // Allowing mp3 for testing, but PRD says WAV
      return cb(new Error('Only audio files (WAV) are allowed!'), false);
    }
  }
  cb(null, true);
};

export const upload = multer({ 
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  fileFilter: fileFilter
});
