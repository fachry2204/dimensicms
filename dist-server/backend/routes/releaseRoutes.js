import express from 'express';
import { createRelease, updateRelease, addTrack, getRelease, getReleases, updateReleaseStatus } from '../controllers/releaseController.js';
import { authenticateToken } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
const router = express.Router();
router.post('/', authenticateToken, createRelease);
router.get('/', authenticateToken, getReleases);
router.get('/:id', authenticateToken, getRelease);
router.patch('/:id', authenticateToken, upload.single('cover'), updateRelease);
router.post('/:id/tracks', authenticateToken, upload.fields([{ name: 'audio_file', maxCount: 1 }, { name: 'audio_clip', maxCount: 1 }]), addTrack);
router.patch('/:id/status', authenticateToken, updateReleaseStatus); // For submitting or reviewing
export default router;
