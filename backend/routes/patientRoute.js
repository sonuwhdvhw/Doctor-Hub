import express from 'express'

import authMiddleware from '../middleware/authMiddleware.js'

import roleMiddleware from '../middleware/roleMiddleware.js'

import { reportUpload } from '../middlewares/multer.js'

import { validate } from '../middleware/validate.js'

import { reportRules, messageRules, uuidParam } from '../validators/hubValidators.js'

import {

    getMyAppointments,

    getMedicalHistory,

    getPrescriptions,

    getDashboardStats,

} from '../controllers/patientController.js'

import {

    uploadReport,

    listReports,

    getContacts,

    getMessages,

    sendMessage,

} from '../controllers/patientExtrasController.js'

import { generatePrescriptionPdf } from '../controllers/prescriptionPdfController.js'



const patientRouter = express.Router()

const patientOnly = [authMiddleware, roleMiddleware('patient')]



patientRouter.get('/dashboard', ...patientOnly, getDashboardStats)

patientRouter.get('/appointments', ...patientOnly, getMyAppointments)

patientRouter.get('/history', ...patientOnly, getMedicalHistory)

patientRouter.get('/prescriptions', ...patientOnly, getPrescriptions)

patientRouter.get('/prescriptions/:id/pdf', ...patientOnly, uuidParam('id'), validate, generatePrescriptionPdf)



patientRouter.get('/reports', ...patientOnly, listReports)

patientRouter.post('/reports', ...patientOnly, reportUpload.single('file'), reportRules, validate, uploadReport)



patientRouter.get('/contacts', ...patientOnly, getContacts)

patientRouter.get('/messages', ...patientOnly, getMessages)

patientRouter.post('/messages', ...patientOnly, messageRules, validate, sendMessage)



export default patientRouter

