import express from 'express';
import { getDashboardStats } from '../controllers/reportController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/statistics', authenticateToken, getDashboardStats);

export default router;
