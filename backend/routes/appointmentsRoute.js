import express from 'express'
import authMiddleware from '../middleware/authMiddleware.js'
import roleMiddleware from '../middleware/roleMiddleware.js'
import { validate } from '../middleware/validate.js'
import { bookAppointmentRules } from '../validators/hubValidators.js'
import { bookAppointment } from '../controllers/appointmentController.js'

const appointmentsRouter = express.Router()

appointmentsRouter.post(
    '/',
    authMiddleware,
    roleMiddleware('patient'),
    bookAppointmentRules,
    validate,
    bookAppointment
)

export default appointmentsRouter
