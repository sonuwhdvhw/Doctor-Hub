import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import path from 'path'
import { fileURLToPath } from 'url'
import 'dotenv/config'
import connectCloudinary from './config/cloudinary.js'
import { uploadDir } from './middlewares/multer.js'
import adminRouter from './routes/adminRoute.js'
import doctorRouter from './routes/doctorRoute.js'
import userRouter from './routes/userRoute.js'
import healthRouter from './routes/healthRoute.js'
import authRouter from './routes/authRoute.js'
import doctorsRouter from './routes/doctorsRoute.js'
import appointmentsRouter from './routes/appointmentsRoute.js'
import paymentsRouter from './routes/paymentsRoute.js'
import patientRouter from './routes/patientRoute.js'
import assistantRouter from './routes/assistantRoute.js'
import superAdminRouter from './routes/superAdminRoute.js'
import aiRouter from './routes/aiRoute.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
const port = process.env.PORT || 4000

const allowedOrigins = [
    process.env.FRONTEND_URL,
    'http://localhost:5173',
    'http://127.0.0.1:5173',
].filter(Boolean)

try {
    connectCloudinary()
} catch (err) {
    console.error('Cloudinary init failed:', err.message)
}

app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
}))

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    credentials: true,
}))

app.use(express.json({ limit: '1mb' }))
app.use('/uploads', express.static(uploadDir))

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: process.env.NODE_ENV === 'production' ? 10 : 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Too many attempts. Please try again in 15 minutes.' },
})

app.use('/health', healthRouter)
app.use('/api/auth', authLimiter, authRouter)
app.use('/api/ai', aiRouter)
app.use('/api/doctors', doctorsRouter)
app.use('/api/appointments', appointmentsRouter)
app.use('/api/payments', paymentsRouter)
app.use('/api/patient', patientRouter)
app.use('/api/assistant', assistantRouter)
app.use('/api/admin', adminRouter)
app.use('/api/superadmin', superAdminRouter)
app.use('/api/doctor', doctorRouter)
app.use('/api/user', userRouter)

app.get('/', (_req, res) => res.json({ status: 'ok', message: 'Doctor Hub API' }))

app.use((err, req, res, _next) => {
    if (err.message?.includes('CORS')) {
        return res.status(403).json({ success: false, message: 'CORS policy violation' })
    }
    if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ success: false, message: 'File too large. Max 5MB allowed.' })
    }
    if (err.message?.includes('JPG and PNG') || err.message?.includes('JPG, PNG and PDF')) {
        return res.status(400).json({ success: false, message: err.message })
    }
    console.error('Unhandled error:', err.message)
    res.status(500).json({ success: false, message: 'Internal server error' })
})

if (process.env.VERCEL !== '1') {
    app.listen(port, () => console.log(`Server started on PORT:${port}`))
}

export default app
