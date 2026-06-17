import supabase from '../config/supabaseClient.js'
import { uploadFileToCloudinary } from '../utils/cloudinaryUpload.js'

const uploadPayment = async (req, res) => {
    try {
        const { appointmentId, amount } = req.body
        const patientId = req.user.id
        const file = req.file

        if (!file) {
            return res.status(400).json({ success: false, message: 'Payment screenshot is required' })
        }

        const { data: appointment, error: apptErr } = await supabase
            .from('doctor_appointments')
            .select('*')
            .eq('id', appointmentId)
            .eq('patient_id', patientId)
            .maybeSingle()

        if (apptErr || !appointment) {
            return res.status(404).json({ success: false, message: 'Appointment not found' })
        }

        if (appointment.status === 'cancelled') {
            return res.status(400).json({ success: false, message: 'Cannot pay for a cancelled appointment' })
        }

        const screenshotUrl = await uploadFileToCloudinary(file, 'carelink/payments')

        const { data: payment, error } = await supabase
            .from('payments')
            .insert({
                appointment_id: appointmentId,
                patient_id: patientId,
                amount: Number(amount),
                screenshot_url: screenshotUrl,
                status: 'pending',
            })
            .select()
            .single()

        if (error) throw error

        res.status(201).json({
            success: true,
            message: 'Payment screenshot uploaded. Awaiting verification.',
            payment: {
                id: payment.id,
                appointmentId: payment.appointment_id,
                patientId: payment.patient_id,
                amount: payment.amount,
                screenshotUrl: payment.screenshot_url,
                status: payment.status,
            },
        })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

export { uploadPayment }
