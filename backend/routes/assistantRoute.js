import express from 'express'
import authMiddleware from '../middleware/authMiddleware.js'
import roleMiddleware from '../middleware/roleMiddleware.js'
import {
    getPendingPayments,
    verifyPayment,
    rejectPayment,
    getAppointments,
    getBookings,
    getDashboardStats,
} from '../controllers/assistantController.js'
import { validate } from '../middleware/validate.js'
import { uuidParam, rejectPaymentRules } from '../validators/hubValidators.js'

const assistantRouter = express.Router()
const assistantOnly = [authMiddleware, roleMiddleware('assistant')]

assistantRouter.get('/dashboard', ...assistantOnly, getDashboardStats)
assistantRouter.get('/pending-payments', ...assistantOnly, getPendingPayments)
assistantRouter.put('/payments/:id/verify', ...assistantOnly, uuidParam('id'), validate, verifyPayment)
assistantRouter.put('/payments/:id/reject', ...assistantOnly, uuidParam('id'), rejectPaymentRules, validate, rejectPayment)
assistantRouter.get('/appointments', ...assistantOnly, getAppointments)
assistantRouter.get('/bookings', ...assistantOnly, getBookings)

export default assistantRouter
