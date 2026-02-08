/**
 * This is a API server
 */

import express, {
  type Request,
  type Response,
  type NextFunction,
} from 'express'
import cors from 'cors'
import path from 'path'
import dotenv from 'dotenv'
import helmet from 'helmet'
import morgan from 'morgan'
import { fileURLToPath } from 'url'
import authRoutes from './routes/authRoutes.js'
import reportRoutes from './routes/reportRoutes.js'
import releaseRoutes from './routes/releaseRoutes.js'

// for esm mode
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// load env
dotenv.config()

const app: express.Application = express()

// Middleware
app.use(helmet())
app.use(morgan('dev'))
app.use(cors())
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true, limit: '50mb' }))

// Static files (Uploads)
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')))

/**
 * API Routes
 */
app.use('/api/auth', authRoutes)
app.use('/api/reports', reportRoutes)
app.use('/api/releases', releaseRoutes)

/**
 * health
 */
app.use(
  '/api/health',
  (req: Request, res: Response, next: NextFunction): void => {
    res.status(200).json({
      success: true,
      message: 'ok',
    })
  },
)

// Serve Frontend Static Files (Production)
// Adjust path based on where the build output is relative to this file
// If running from dist-server/app.js, frontend dist might be ../dist
// If running from backend/app.ts (dev), frontend dist might be ../dist
const frontendDist = path.join(__dirname, '../dist')
app.use(express.static(frontendDist))

// Handle SPA routing - return index.html for all non-API routes
app.get('*', (req: Request, res: Response) => {
  if (req.path.startsWith('/api')) {
    // If it's an API call that wasn't caught above, return 404 JSON
    return res.status(404).json({
      success: false,
      error: 'API not found',
    })
  }
  res.sendFile(path.join(frontendDist, 'index.html'))
})

/**
 * error handler middleware
 */
app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(error)
  res.status(500).json({
    success: false,
    error: 'Server internal error',
    message: error.message
  })
})

/**
 * 404 handler
 */
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'API not found',
  })
})

export default app
