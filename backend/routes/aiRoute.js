import express from 'express'
import { checkSymptoms } from '../controllers/aiController.js'
import { validate } from '../middleware/validate.js'
import { symptomRules } from '../validators/hubValidators.js'

const aiRouter = express.Router()

aiRouter.post('/symptoms', symptomRules, validate, checkSymptoms)

export default aiRouter
