import { body, param, query } from 'express-validator'

const roles = ['patient', 'doctor', 'assistant', 'admin', 'superadmin']
const treatmentTypes = ['allopathic', 'homeopathic', 'herbal']

export const registerRules = [
    body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 100 }),
    body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    body('role').optional().isIn(['patient', 'doctor']).withMessage('Only patient or doctor registration is allowed'),
]

export const loginRules = [
    body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required'),
]

export const forgotPasswordRules = [
    body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
]

export const uuidParam = (name) => [
    param(name).isUUID().withMessage(`Invalid ${name}`),
]

export const doctorProfileRules = [
    body('specialization').optional().trim().isLength({ max: 200 }),
    body('treatmentType').optional().isIn(treatmentTypes),
    body('experience').optional().isInt({ min: 0, max: 60 }),
    body('fee').optional().isFloat({ min: 0 }),
    body('bio').optional().trim().isLength({ max: 2000 }),
]

export const clinicRules = [
    body('clinicName').trim().notEmpty().withMessage('Clinic name is required'),
    body('address').trim().notEmpty().withMessage('Address is required'),
    body('city').trim().notEmpty().withMessage('City is required'),
    body('availableDays').optional().isArray(),
    body('startTime').optional().matches(/^\d{2}:\d{2}$/),
    body('endTime').optional().matches(/^\d{2}:\d{2}$/),
]

export const scheduleRules = [
    body('date').isISO8601().withMessage('Valid date is required'),
    body('timeSlots').isArray({ min: 0 }).withMessage('timeSlots must be an array'),
    body('isAvailable').optional().isBoolean(),
]

export const bookAppointmentRules = [
    body('doctorId').isUUID().withMessage('Invalid doctorId'),
    body('clinicId').isUUID().withMessage('Invalid clinicId'),
    body('date').isISO8601().withMessage('Valid date is required'),
    body('timeSlot').trim().notEmpty().withMessage('timeSlot is required'),
]

export const paymentRules = [
    body('appointmentId').isUUID().withMessage('Invalid appointmentId'),
    body('amount').isFloat({ min: 0 }).withMessage('Valid amount is required'),
]

export const rejectPaymentRules = [
    body('reason').trim().notEmpty().withMessage('Rejection reason is required').isLength({ max: 500 }),
]

export const medicalHistoryRules = [
    body('patientId').isUUID().withMessage('Invalid patientId'),
    body('appointmentId').isUUID().withMessage('Invalid appointmentId'),
    body('symptoms').trim().notEmpty().withMessage('Symptoms are required').isLength({ max: 1000 }),
    body('diagnosis').trim().notEmpty().withMessage('Diagnosis is required').isLength({ max: 1000 }),
    body('notes').optional().trim().isLength({ max: 2000 }),
]

export const prescriptionRules = [
    body('patientId').isUUID().withMessage('Invalid patientId'),
    body('appointmentId').isUUID().withMessage('Invalid appointmentId'),
    body('medicalHistoryId').isUUID().withMessage('Invalid medicalHistoryId'),
    body('medicines').isArray({ min: 1 }).withMessage('At least one medicine is required'),
    body('medicines.*.name').trim().notEmpty(),
    body('medicines.*.dosage').trim().notEmpty(),
    body('medicines.*.frequency').trim().notEmpty(),
    body('medicines.*.duration').trim().notEmpty(),
    body('instructions').optional().trim().isLength({ max: 2000 }),
]

export const promoteAdminRules = [
    body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
]

export const appointmentFilterRules = [
    query('date').optional().isISO8601(),
    query('status').optional().isIn(['pending', 'confirmed', 'completed', 'cancelled']),
]

export const doctorSearchRules = [
    query('disease').optional().trim().isLength({ max: 100 }),
    query('search').optional().trim().isLength({ max: 100 }),
    query('type').optional().isIn(treatmentTypes),
]

export const resetPasswordRules = [
    body('token').notEmpty().withMessage('Reset token is required'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
]

export const symptomRules = [
    body('symptoms').trim().notEmpty().isLength({ min: 3, max: 2000 }).withMessage('Describe your symptoms'),
]

export const assignAssistantRules = [
    body('email').trim().isEmail().withMessage('Valid assistant email is required').normalizeEmail(),
]

export const createDoctorRules = [
    body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 100 }),
    body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    body('specialization').optional().trim().isLength({ max: 200 }),
    body('treatmentType').optional().isIn(treatmentTypes),
    body('experience').optional().isInt({ min: 0, max: 60 }),
    body('fee').optional().isFloat({ min: 0 }),
    body('bio').optional().trim().isLength({ max: 2000 }),
    body('isVerified').optional().isBoolean(),
]

export const updateDoctorRules = [
    body('name').optional().trim().notEmpty().isLength({ max: 100 }),
    body('email').optional().trim().isEmail().normalizeEmail(),
    body('password').optional().isLength({ min: 8 }),
    body('specialization').optional().trim().isLength({ max: 200 }),
    body('treatmentType').optional().isIn(treatmentTypes),
    body('experience').optional().isInt({ min: 0, max: 60 }),
    body('fee').optional().isFloat({ min: 0 }),
    body('bio').optional().trim().isLength({ max: 2000 }),
    body('isVerified').optional().isBoolean(),
]

export const createAssistantRules = [
    body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 100 }),
    body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    body('doctorId').optional().isUUID().withMessage('Invalid doctorId'),
]

export const updateAssistantRules = [
    body('name').optional().trim().notEmpty().isLength({ max: 100 }),
    body('email').optional().trim().isEmail().normalizeEmail(),
    body('password').optional().isLength({ min: 8 }),
    body('doctorId').optional({ nullable: true }).custom((value) => value === null || value === '' || /^[0-9a-f-]{36}$/i.test(value)),
]

export const messageRules = [
    body('receiverId').isUUID().withMessage('Invalid receiverId'),
    body('content').trim().notEmpty().isLength({ max: 2000 }).withMessage('Message content is required'),
]

export const reportRules = [
    body('title').trim().notEmpty().isLength({ max: 200 }).withMessage('Report title is required'),
    body('notes').optional().trim().isLength({ max: 1000 }),
]
