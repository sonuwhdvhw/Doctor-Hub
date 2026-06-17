import express from 'express'
import authMiddleware from '../middleware/authMiddleware.js'
import roleMiddleware from '../middleware/roleMiddleware.js'
import {
    listDoctors,
    createDoctor,
    updateDoctor,
    deleteDoctor,
    verifyDoctor,
    unverifyDoctor,
    listAssistants,
    createAssistant,
    updateAssistant,
    deleteAssistant,
    listPatients,
    listAppointments,
    listPayments,
    getAnalytics,
} from '../controllers/adminHubController.js'
import {
    loginAdmin,
    addDoctor,
    allDoctors,
    appointmentsAdmin,
    appointmentCancel,
    adminDashboard,
} from '../controllers/adminController.js'
import authAdmin from '../middlewares/authAdmin.js'
import upload from '../middlewares/multer.js'
import { changeAvailability } from '../controllers/doctorController.js'
import { validate } from '../middleware/validate.js'
import { appointmentFilterRules, uuidParam, createDoctorRules, updateDoctorRules, createAssistantRules, updateAssistantRules } from '../validators/hubValidators.js'

const adminRouter = express.Router()
const adminAccess = [authMiddleware, roleMiddleware('admin', 'superadmin')]

// ─── Doctor Hub Admin routes ─────────────────────────────────────────────────
adminRouter.get('/doctors', ...adminAccess, listDoctors)
adminRouter.post('/doctors', ...adminAccess, createDoctorRules, validate, createDoctor)
adminRouter.put('/doctors/:id', ...adminAccess, uuidParam('id'), updateDoctorRules, validate, updateDoctor)
adminRouter.delete('/doctors/:id', ...adminAccess, uuidParam('id'), validate, deleteDoctor)
adminRouter.put('/doctors/:id/verify', ...adminAccess, uuidParam('id'), validate, verifyDoctor)
adminRouter.put('/doctors/:id/unverify', ...adminAccess, uuidParam('id'), validate, unverifyDoctor)
adminRouter.get('/assistants', ...adminAccess, listAssistants)
adminRouter.post('/assistants', ...adminAccess, createAssistantRules, validate, createAssistant)
adminRouter.put('/assistants/:id', ...adminAccess, uuidParam('id'), updateAssistantRules, validate, updateAssistant)
adminRouter.delete('/assistants/:id', ...adminAccess, uuidParam('id'), validate, deleteAssistant)
adminRouter.get('/patients', ...adminAccess, listPatients)
adminRouter.get('/appointments', ...adminAccess, appointmentFilterRules, validate, listAppointments)
adminRouter.get('/payments', ...adminAccess, listPayments)
adminRouter.get('/analytics', ...adminAccess, getAnalytics)

// ─── Legacy CareLink admin routes ──────────────────────────────────────────────
adminRouter.post('/login', loginAdmin)
adminRouter.post('/legacy/add-doctor', authAdmin, upload.single('image'), addDoctor)
adminRouter.get('/legacy/all-doctors', authAdmin, allDoctors)
adminRouter.get('/legacy/appointments', authAdmin, appointmentsAdmin)
adminRouter.get('/legacy/dashboard', authAdmin, adminDashboard)
adminRouter.post('/legacy/cancel-appointment', authAdmin, appointmentCancel)
adminRouter.post('/legacy/change-availability', authAdmin, changeAvailability)

export default adminRouter
