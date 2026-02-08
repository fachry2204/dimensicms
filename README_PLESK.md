# Deployment Guide for Plesk (Node.js)

This project is configured for deployment on Plesk with the Node.js extension.

## Prerequisites
- Plesk Obsidian (or newer)
- Node.js Extension installed
- MySQL Database

## Deployment Steps

1. **Upload Files**
   - Upload all files to your `httpdocs` directory (or subdomain folder).
   - EXCLUDE `node_modules` (install them on the server).
   - Ensure `dist` and `dist-server` folders are generated locally (via `npm run build`) and uploaded, OR run build on the server.
   - Recommended: Upload `package.json`, `package-lock.json`, `tsconfig.json`, `tsconfig.server.json`, `vite.config.ts`, `src`, `backend`, `public`.

2. **Database Setup**
   - Create a MySQL database in Plesk.
   - Import the schema if needed (though the app uses migrations/SQL queries directly, you might need to run the initial SQL script provided in docs).
   - Update `.env` file with database credentials.

3. **Node.js Configuration (Plesk)**
   - Go to **Node.js** settings in Plesk.
   - **Node.js Version**: Select 18.x or 20.x.
   - **Document Root**: Your application root (e.g., `/httpdocs`).
   - **Application Mode**: `Production`.
   - **Application Startup File**: `dist-server/backend/server.js`.
   - **Run NPM Install**: Click "NPM Install" to install dependencies.
   - **Run Script**: If you uploaded source code, run `build` script. If you uploaded pre-built `dist` and `dist-server`, you can skip this.

4. **Environment Variables**
   - Create a `.env` file in the application root.
   - Add the following variables:
     ```
     PORT=3000
     DB_HOST=localhost
     DB_USER=your_db_user
     DB_PASSWORD=your_db_password
     DB_NAME=your_db_name
     JWT_SECRET=your_jwt_secret_key
     ```

5. **Restart App**
   - Click "Restart Application".

## Troubleshooting
- **404 Errors**: Ensure `Application Startup File` is correctly set to `dist-server/backend/server.js`.
- **Static Files**: The app serves frontend files from `dist/` automatically. Ensure the `dist` folder exists and contains `index.html`.
- **Uploads**: Images are stored in `uploads/` in the root. Ensure this folder has write permissions.

## Directory Structure on Server
```
/httpdocs
  /backend (source)
  /dist (frontend build)
  /dist-server (backend build)
  /node_modules
  /uploads
  .env
  package.json
  ...
```
