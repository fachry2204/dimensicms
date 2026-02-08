import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
dotenv.config();
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
};
const dbName = process.env.DB_NAME || 'music_aggregator_cms';
const setupDatabase = async () => {
    let connection;
    try {
        // Connect to MySQL server without selecting database
        connection = await mysql.createConnection(dbConfig);
        console.log('Connected to MySQL server');
        // Create database if not exists
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
        console.log(`Database '${dbName}' created or already exists`);
        // Switch to the database
        await connection.changeUser({ database: dbName });
        // Create Tables
        // Users Table
        await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role ENUM('admin', 'operator', 'user') DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_users_email (email),
        INDEX idx_users_role (role)
      )
    `);
        console.log('Users table created');
        // Aggregators Table
        await connection.query(`
      CREATE TABLE IF NOT EXISTS aggregators (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        status ENUM('active', 'inactive') DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
        console.log('Aggregators table created');
        // Releases Table
        await connection.query(`
      CREATE TABLE IF NOT EXISTS releases (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        aggregator_id INT,
        type ENUM('single', 'album') NOT NULL,
        title VARCHAR(255) NOT NULL,
        cover_path VARCHAR(500),
        upc VARCHAR(20),
        label VARCHAR(255),
        p_line VARCHAR(255),
        c_line VARCHAR(255),
        genre VARCHAR(100),
        language VARCHAR(50),
        version VARCHAR(100),
        release_date DATE,
        status ENUM('pending', 'review', 'accepted') DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (aggregator_id) REFERENCES aggregators(id) ON DELETE SET NULL,
        INDEX idx_releases_user_id (user_id),
        INDEX idx_releases_status (status),
        INDEX idx_releases_created_at (created_at DESC)
      )
    `);
        console.log('Releases table created');
        // Tracks Table
        await connection.query(`
      CREATE TABLE IF NOT EXISTS tracks (
        id INT PRIMARY KEY AUTO_INCREMENT,
        release_id INT NOT NULL,
        track_number INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        audio_path VARCHAR(500) NOT NULL,
        audio_clip_path VARCHAR(500) NOT NULL,
        isrc VARCHAR(20),
        genre VARCHAR(100),
        explicit BOOLEAN DEFAULT FALSE,
        composer VARCHAR(255),
        lyricist VARCHAR(255),
        lyrics TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (release_id) REFERENCES releases(id) ON DELETE CASCADE,
        INDEX idx_tracks_release_id (release_id)
      )
    `);
        console.log('Tracks table created');
        // Revenues Table
        await connection.query(`
      CREATE TABLE IF NOT EXISTS revenues (
        id INT PRIMARY KEY AUTO_INCREMENT,
        release_id INT NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        period VARCHAR(20) NOT NULL,
        report_file_path VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (release_id) REFERENCES releases(id) ON DELETE CASCADE,
        INDEX idx_revenues_release_id (release_id),
        INDEX idx_revenues_period (period)
      )
    `);
        console.log('Revenues table created');
        // Payments Table
        await connection.query(`
      CREATE TABLE IF NOT EXISTS payments (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        status ENUM('paid', 'unpaid') DEFAULT 'unpaid',
        paid_date DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_payments_user_id (user_id),
        INDEX idx_payments_status (status)
      )
    `);
        console.log('Payments table created');
        // Seed Data
        // Check if admin exists
        const [users] = await connection.query('SELECT * FROM users WHERE email = ?', ['admin@musicaggregator.com']);
        if (users.length === 0) {
            const hashedPassword = await bcrypt.hash('password123', 10);
            await connection.query(`
        INSERT INTO users (name, email, password_hash, role) VALUES 
        (?, ?, ?, ?),
        (?, ?, ?, ?)
      `, [
                'Admin', 'admin@musicaggregator.com', hashedPassword, 'admin',
                'Operator', 'operator@musicaggregator.com', hashedPassword, 'operator'
            ]);
            console.log('Default admin and operator users created');
        }
        // Check if aggregators exist
        const [aggregators] = await connection.query('SELECT * FROM aggregators');
        if (aggregators.length === 0) {
            await connection.query(`
        INSERT INTO aggregators (name, status) VALUES 
        ('DistroKid', 'active'),
        ('TuneCore', 'active'),
        ('CD Baby', 'active'),
        ('LANDR', 'active')
      `);
            console.log('Sample aggregators created');
        }
        console.log('Database setup completed successfully');
    }
    catch (error) {
        console.error('Error setting up database:', error);
    }
    finally {
        if (connection)
            await connection.end();
    }
};
setupDatabase();
