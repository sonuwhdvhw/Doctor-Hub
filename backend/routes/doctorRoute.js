import express from 'express'
import authMiddleware from '../middleware/authMiddleware.js'
import roleMiddleware from '../middleware/roleMiddleware.js'
import {
    createProfile,
    updateProfile,
    getProfile,
    addClinic,
    getClinics,
    setSchedule,
    getSchedule,
    getAppointments,
    getPatients,
    getDashboardStats,
} from '../controllers/doctorHubController.js'
import {
    addMedicalHistory,
    getPatientMedicalHistory,
    addPrescription,
    getPatientPrescriptions,
    getPatientTimeline,
} from '../controllers/doctorMedicalController.js'
import {
    listAssistants,
    assignAssistant,
    removeAssistant,
} from '../controllers/assistantManagementController.js'
import {
    getDoctorContacts,
    getDoctorMessages,
    sendDoctorMessage,
} from '../controllers/doctorMessagesController.js'
import { generatePrescriptionPdf } from '../controllers/prescriptionPdfController.js'
import {
    loginDoctor,
    appointmentsDoctor,
    appointmentCancel,
    doctorList,
    appointmentComplete,
    doctorDashboard,
    doctorProfile,
    updateDoctorProfile,
    changeAvailability,
} from '../controllers/doctorController.js'
import authDoctor from '../middlewares/authDoctor.js'
import { validate } from '../middleware/validate.js'
import {
    doctorProfileRules,
    clinicRules,
    scheduleRules,
    medicalHistoryRules,
    prescriptionRules,
    uuidParam,
    assignAssistantRules,
    messageRules,
} from '../validators/hubValidators.js'

const doctorRouter = express.Router()

const doctorOnly = [authMiddleware, roleMiddleware('doctor')]

// ─── Doctor Hub routes (JWT + doctor role) ───────────────────────────────────
doctorRouter.get('/dashboard', ...doctorOnly, getDashboardStats)
doctorRouter.post('/profile', ...doctorOnly, doctorProfileRules, validate, createProfile)
doctorRouter.put('/profile', ...doctorOnly, doctorProfileRules, validate, updateProfile)
doctorRouter.get('/profile', ...doctorOnly, getProfile)
doctorRouter.post('/clinic', ...doctorOnly, clinicRules, validate, addClinic)
doctorRouter.get('/clinics', ...doctorOnly, getClinics)
doctorRouter.post('/schedule', ...doctorOnly, scheduleRules, validate, setSchedule)
doctorRouter.get('/schedule', ...doctorOnly, getSchedule)
doctorRouter.get('/appointments', ...doctorOnly, getAppointments)
doctorRouter.get('/patients', ...doctorOnly, getPatients)
doctorRouter.post('/medical-history', ...doctorOnly, medicalHistoryRules, validate, addMedicalHistory)
doctorRouter.get('/medical-history/:patientId', ...doctorOnly, uuidParam('patientId'), validate, getPatientMedicalHistory)
doctorRouter.post('/prescription', ...doctorOnly, prescriptionRules, validate, addPrescription)
doctorRouter.get('/prescriptions/:patientId', ...doctorOnly, uuidParam('patientId'), validate, getPatientPrescriptions)
doctorRouter.get('/patient-timeline/:patientId', ...doctorOnly, uuidParam('patientId'), validate, getPatientTimeline)
doctorRouter.get('/prescriptions/:id/pdf', ...doctorOnly, uuidParam('id'), validate, generatePrescriptionPdf)

doctorRouter.get('/assistants', ...doctorOnly, listAssistants)
doctorRouter.post('/assistants', ...doctorOnly, assignAssistantRules, validate, assignAssistant)
doctorRouter.delete('/assistants/:id', ...doctorOnly, uuidParam('id'), validate, removeAssistant)

doctorRouter.get('/contacts', ...doctorOnly, getDoctorContacts)
doctorRouter.get('/messages', ...doctorOnly, getDoctorMessages)
doctorRouter.post('/messages', ...doctorOnly, messageRules, validate, sendDoctorMessage)

// ─── Legacy CareLink routes ──────────────────────────────────────────────────
doctorRouter.post('/login', loginDoctor)
doctorRouter.get('/list', doctorList)
doctorRouter.get('/legacy/profile', authDoctor, doctorProfile)
doctorRouter.post('/legacy/update-profile', authDoctor, updateDoctorProfile)
doctorRouter.get('/legacy/appointments', authDoctor, appointmentsDoctor)
doctorRouter.get('/legacy/dashboard', authDoctor, doctorDashboard)
doctorRouter.post('/cancel-appointment', authDoctor, appointmentCancel)
doctorRouter.post('/complete-appointment', authDoctor, appointmentComplete)
doctorRouter.post('/change-availability', authDoctor, changeAvailability)

export default doctorRouter
