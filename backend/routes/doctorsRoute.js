import express from 'express'
import authMiddleware from '../middleware/authMiddleware.js'
import roleMiddleware from '../middleware/roleMiddleware.js'
import { validate } from '../middleware/validate.js'
import { doctorSearchRules, uuidParam } from '../validators/hubValidators.js'
import { listDoctors, getDoctorById } from '../controllers/doctorsController.js'

const doctorsRouter = express.Router()
const patientOnly = [authMiddleware, roleMiddleware('patient')]

doctorsRouter.get('/', ...patientOnly, doctorSearchRules, validate, listDoctors)
doctorsRouter.get('/:id', ...patientOnly, uuidParam('id'), validate, getDoctorById)

export default doctorsRouter
