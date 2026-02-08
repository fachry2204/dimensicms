import { Request, Response } from 'express';
import pool from '../config/db.js';
import { AuthRequest } from '../middleware/auth.js';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

// Step 1: Create Release (Draft)
export const createRelease = async (req: AuthRequest, res: Response) => {
  try {
    const { type } = req.body;
    const userId = req.user!.id;

    if (!type) {
      return res.status(400).json({ message: 'Type is required' });
    }

    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO releases (user_id, type, title, status) VALUES (?, ?, ?, ?)',
      [userId, type, 'Untitled Release', 'pending'] // Initially pending or we can add 'draft' status if needed. PRD says 'pending' after submit. Let's assume it's pending but incomplete.
    );

    res.status(201).json({
      message: 'Release created',
      id: result.insertId,
      type
    });
  } catch (error) {
    console.error('CreateRelease error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Step 2 & 4: Update Release Info (Basic Info & Specifics)
export const updateRelease = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const {
      title, label, p_line, c_line, genre, language, version,
      upc, release_date, previous_distribution, brand_new, previously_released
    } = req.body;
    
    // Check ownership
    const [releases] = await pool.query<RowDataPacket[]>('SELECT * FROM releases WHERE id = ? AND user_id = ?', [id, userId]);
    if (releases.length === 0) {
      return res.status(404).json({ message: 'Release not found or unauthorized' });
    }

    // Handle Cover Upload
    let coverPath = releases[0].cover_path;
    if (req.file) {
      coverPath = `/uploads/covers/${req.file.filename}`;
    }

    const updateFields = [];
    const updateValues = [];

    if (title) { updateFields.push('title = ?'); updateValues.push(title); }
    if (label) { updateFields.push('label = ?'); updateValues.push(label); }
    if (p_line) { updateFields.push('p_line = ?'); updateValues.push(p_line); }
    if (c_line) { updateFields.push('c_line = ?'); updateValues.push(c_line); }
    if (genre) { updateFields.push('genre = ?'); updateValues.push(genre); }
    if (language) { updateFields.push('language = ?'); updateValues.push(language); }
    if (version) { updateFields.push('version = ?'); updateValues.push(version); }
    if (upc) { updateFields.push('upc = ?'); updateValues.push(upc); }
    if (release_date) { updateFields.push('release_date = ?'); updateValues.push(release_date); }
    if (req.file) { updateFields.push('cover_path = ?'); updateValues.push(coverPath); }

    if (updateFields.length > 0) {
      updateValues.push(id);
      await pool.query(
        `UPDATE releases SET ${updateFields.join(', ')} WHERE id = ?`,
        updateValues
      );
    }

    res.json({ message: 'Release updated successfully', coverPath });
  } catch (error) {
    console.error('UpdateRelease error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Step 3: Add Track
export const addTrack = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params; // release_id
    const userId = req.user!.id;
    const {
      title, track_number, isrc, genre, explicit, composer, lyricist, lyrics
    } = req.body;

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const audioFile = files['audio_file'] ? files['audio_file'][0] : null;
    const audioClip = files['audio_clip'] ? files['audio_clip'][0] : null;

    if (!audioFile || !audioClip) {
      return res.status(400).json({ message: 'Audio file and clip are required' });
    }

    // Check ownership
    const [releases] = await pool.query<RowDataPacket[]>('SELECT * FROM releases WHERE id = ? AND user_id = ?', [id, userId]);
    if (releases.length === 0) {
      return res.status(404).json({ message: 'Release not found or unauthorized' });
    }

    const audioPath = `/uploads/audio/${audioFile.filename}`;
    const clipPath = `/uploads/audio/${audioClip.filename}`;

    await pool.query(
      `INSERT INTO tracks (release_id, track_number, title, audio_path, audio_clip_path, isrc, genre, explicit, composer, lyricist, lyrics)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, track_number, title, audioPath, clipPath, isrc, genre, explicit === 'true', composer, lyricist, lyrics]
    );

    res.status(201).json({ message: 'Track added successfully' });
  } catch (error) {
    console.error('AddTrack error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get Release Details (for Review & View)
export const getRelease = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const role = req.user!.role;

    let query = 'SELECT * FROM releases WHERE id = ?';
    const params: any[] = [id];

    if (role === 'user') {
      query += ' AND user_id = ?';
      params.push(userId);
    }

    const [releases] = await pool.query<RowDataPacket[]>(query, params);
    if (releases.length === 0) {
      return res.status(404).json({ message: 'Release not found' });
    }

    const [tracks] = await pool.query<RowDataPacket[]>('SELECT * FROM tracks WHERE release_id = ? ORDER BY track_number ASC', [id]);

    res.json({ ...releases[0], tracks });
  } catch (error) {
    console.error('GetRelease error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get All Releases
export const getReleases = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const role = req.user!.role;
    const { status } = req.query;

    let query = `
      SELECT r.*, u.name as artist_name, COUNT(t.id) as track_count 
      FROM releases r
      LEFT JOIN users u ON r.user_id = u.id
      LEFT JOIN tracks t ON r.id = t.release_id
    `;
    const params: any[] = [];
    const conditions: string[] = [];

    if (role === 'user') {
      conditions.push('r.user_id = ?');
      params.push(userId);
    }

    if (status) {
      conditions.push('r.status = ?');
      params.push(status);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' GROUP BY r.id ORDER BY r.created_at DESC';

    const [releases] = await pool.query<RowDataPacket[]>(query, params);

    res.json(releases);
  } catch (error) {
    console.error('GetReleases error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Submit / Update Status
export const updateReleaseStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status, aggregator_id } = req.body;
    const role = req.user!.role;

    // Only admin/operator can change status to review/accepted, user can only submit (which might be handled by updateRelease or separate)
    // Actually, Step 5 is Submit Release. User clicks submit -> Status Pending.
    // If user is just creating, status is already pending (from createRelease).
    // Maybe we need a 'draft' status?
    // PRD: "Status Release: Pending (setelah submit)".
    // So createRelease -> 'draft'. Submit -> 'pending'.
    
    // For now, let's allow updating status.

    if (role === 'user' && status !== 'pending') {
       return res.status(403).json({ message: 'Unauthorized status change' });
    }

    const updateFields = ['status = ?'];
    const updateValues = [status];

    if (aggregator_id) {
      updateFields.push('aggregator_id = ?');
      updateValues.push(aggregator_id);
    }

    updateValues.push(id);

    await pool.query(
      `UPDATE releases SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );

    res.json({ message: 'Status updated successfully' });
  } catch (error) {
    console.error('UpdateStatus error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
