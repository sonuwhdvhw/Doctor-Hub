import { v2 as cloudinary } from 'cloudinary'

const connectCloudinary = () => {
    const { CLOUDINARY_NAME, CLOUDINARY_API_KEY, CLOUDINARY_SECRET_KEY } = process.env

    if (!CLOUDINARY_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_SECRET_KEY) {
        console.warn('Cloudinary credentials missing — payment screenshots and medical reports will not upload until .env is configured.')
        return
    }

    cloudinary.config({
        cloud_name: CLOUDINARY_NAME,
        api_key: CLOUDINARY_API_KEY,
        api_secret: CLOUDINARY_SECRET_KEY,
    })
}

export default connectCloudinary