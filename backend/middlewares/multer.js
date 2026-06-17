import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const uploadDir = path.join(__dirname, '..', 'uploads')

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true })
}

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadDir),
    filename: (_req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase()
        const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}${ext}`
        cb(null, safeName)
    },
})

const imageFilter = (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/jpg', 'image/png']
    const ext = path.extname(file.originalname).toLowerCase()
    const allowedExt = ['.jpg', '.jpeg', '.png']

    if (allowed.includes(file.mimetype) && allowedExt.includes(ext)) {
        cb(null, true)
    } else {
        cb(new Error('Only JPG and PNG files are allowed'), false)
    }
}

const upload = multer({
    storage,
    fileFilter: imageFilter,
    limits: { fileSize: 5 * 1024 * 1024 },
})

const reportFilter = (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf']
    const ext = path.extname(file.originalname).toLowerCase()
    const allowedExt = ['.jpg', '.jpeg', '.png', '.pdf']

    if (allowed.includes(file.mimetype) && allowedExt.includes(ext)) {
        cb(null, true)
    } else {
        cb(new Error('Only JPG, PNG and PDF files are allowed'), false)
    }
}

const reportUpload = multer({
    storage,
    fileFilter: reportFilter,
    limits: { fileSize: 5 * 1024 * 1024 },
})

export { uploadDir, reportUpload }
export default upload
