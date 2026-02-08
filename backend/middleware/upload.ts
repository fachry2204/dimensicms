import multer from 'multer';
import path from 'path';
import fs from 'fs';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = 'uploads/';
    
    if (file.fieldname === 'cover') {
      uploadPath += 'covers/';
    } else if (file.fieldname === 'audio_file' || file.fieldname === 'audio_clip') {
      uploadPath += 'audio/';
    } else {
      uploadPath += 'others/';
    }

    // Ensure directory exists
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.fieldname === 'cover') {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error('Only image files are allowed!'));
    }
  } else if (file.fieldname === 'audio_file' || file.fieldname === 'audio_clip') {
    if (!file.originalname.match(/\.(wav|mp3)$/)) { // Allow mp3 for clip if needed, but PRD says WAV only for main.
      return cb(new Error('Only audio files are allowed!'));
    }
  }
  cb(null, true);
};

export const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});
