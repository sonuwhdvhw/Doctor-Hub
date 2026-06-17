import jwt from 'jsonwebtoken'

const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization
        const token = authHeader?.startsWith('Bearer ')
            ? authHeader.split(' ')[1]
            : req.headers.token

        if (!token) {
            return res.status(401).json({ success: false, message: 'Not authorized. Please login again.' })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = {
            id: decoded.id,
            role: decoded.role,
            name: decoded.name,
            email: decoded.email,
        }
        next()
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Invalid or expired token' })
    }
}

export default authMiddleware
