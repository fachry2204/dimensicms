import { Response } from 'express';
import pool from '../config/db.js';
import { AuthRequest } from '../middleware/auth.js';
import { RowDataPacket } from 'mysql2';

export const getDashboardStats = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const role = req.user!.role;

    let releaseQuery = 'SELECT COUNT(*) as total FROM releases';
    let userQuery = 'SELECT COUNT(*) as total FROM users WHERE role = "user"';
    let revenueQuery = 'SELECT SUM(amount) as total FROM revenues';
    let statusQuery = 'SELECT status, COUNT(*) as count FROM releases GROUP BY status';

    const params: any[] = [];

    // If user is not admin/operator, filter by user_id
    if (role === 'user') {
      releaseQuery += ' WHERE user_id = ?';
      revenueQuery += ' JOIN releases ON revenues.release_id = releases.id WHERE releases.user_id = ?';
      statusQuery = 'SELECT status, COUNT(*) as count FROM releases WHERE user_id = ? GROUP BY status';
      params.push(userId);
    }

    const [releaseResult] = await pool.query<RowDataPacket[]>(releaseQuery, role === 'user' ? [userId] : []);
    const [revenueResult] = await pool.query<RowDataPacket[]>(revenueQuery, role === 'user' ? [userId] : []);
    const [statusResult] = await pool.query<RowDataPacket[]>(statusQuery, role === 'user' ? [userId] : []);
    
    // Only admin/operator can see total users
    let userCount = 0;
    if (role !== 'user') {
      const [userResult] = await pool.query<RowDataPacket[]>(userQuery);
      userCount = userResult[0].total;
    }

    res.json({
      totalReleases: releaseResult[0].total,
      totalRevenue: revenueResult[0].total || 0,
      totalUsers: userCount,
      releaseByStatus: statusResult,
    });
  } catch (error) {
    console.error('GetDashboardStats error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
