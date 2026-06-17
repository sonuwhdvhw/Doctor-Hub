import fs from 'fs'
import path from 'path'
import { v2 as cloudinary } from 'cloudinary'

const isCloudinaryConfigured = () =>
    Boolean(process.env.CLOUDINARY_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_SECRET_KEY)

const removeLocalFile = (filePath) => {
    if (!filePath) return
    try {
        fs.unlinkSync(filePath)
    } catch {
        // ignore cleanup errors
    }
}

const getUploadOptions = (file) => {
    const ext = path.extname(file.originalname || file.path || '').toLowerCase()
    const isPdf = file.mimetype === 'application/pdf' || ext === '.pdf'

    return {
        resource_type: isPdf ? 'raw' : 'image',
        folder: file.cloudinaryFolder,
    }
}

export const uploadFileToCloudinary = async (file, folder) => {
    if (!file?.path) {
        throw new Error('Upload file is missing')
    }

    if (!isCloudinaryConfigured()) {
        removeLocalFile(file.path)
        throw new Error('Cloudinary is not configured. Add CLOUDINARY_NAME, CLOUDINARY_API_KEY and CLOUDINARY_SECRET_KEY to backend/.env')
    }

    const fileWithFolder = { ...file, cloudinaryFolder: folder }

    try {
        const result = await cloudinary.uploader.upload(file.path, getUploadOptions(fileWithFolder))
        return result.secure_url
    } finally {
        removeLocalFile(file.path)
    }
}

export default uploadFileToCloudinary
