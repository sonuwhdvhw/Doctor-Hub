import express from 'express'
import authMiddleware from '../middleware/authMiddleware.js'
import roleMiddleware from '../middleware/roleMiddleware.js'
import upload from '../middlewares/multer.js'
import { validate } from '../middleware/validate.js'
import { paymentRules } from '../validators/hubValidators.js'
import { uploadPayment } from '../controllers/paymentController.js'

const paymentsRouter = express.Router()

paymentsRouter.post(
    '/',
    authMiddleware,
    roleMiddleware('patient'),
    upload.single('screenshot'),
    paymentRules,
    validate,
    uploadPayment
)

export default paymentsRouter
