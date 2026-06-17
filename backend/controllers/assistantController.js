import supabase from '../config/supabaseClient.js'

const getAssistantDoctorId = async (userId) => {
    const { data, error } = await supabase
        .from('assistants')
        .select('doctor_id')
        .eq('user_id', userId)
        .maybeSingle()

    if (error) throw error
    if (!data?.doctor_id) {
        const err = new Error('Assistant is not linked to a doctor')
        err.status = 404
        throw err
    }
    return data.doctor_id
}

const getPaymentForAssistant = async (paymentId, doctorId) => {
    const { data: payment, error } = await supabase
        .from('payments')
        .select('*')
        .eq('id', paymentId)
        .maybeSingle()

    if (error) throw error
    if (!payment) return null

    const { data: appointment } = await supabase
        .from('doctor_appointments')
        .select('id, doctor_id, patient_id, appointment_date, appointment_time, status')
        .eq('id', payment.appointment_id)
        .eq('doctor_id', doctorId)
        .maybeSingle()

    if (!appointment) return null

    return { ...payment, appointment }
}

const formatAppointment = (a, patientsMap = {}, clinicsMap = {}) => ({
    id: a.id,
    patientId: a.patient_id,
    patientName: patientsMap[a.patient_id]?.name || 'Unknown',
    patientEmail: patientsMap[a.patient_id]?.email,
    clinicId: a.clinic_id,
    clinicName: clinicsMap[a.clinic_id]?.clinic_name,
    date: a.appointment_date,
    timeSlot: a.appointment_time,
    status: a.status,
    paymentStatus: a.payment_status,
    amount: a.amount,
    createdAt: a.created_at,
})

const enrichAppointments = async (appointments) => {
    const patientIds = [...new Set((appointments || []).map((a) => a.patient_id))]
    const clinicIds = [...new Set((appointments || []).map((a) => a.clinic_id).filter(Boolean))]

    let patientsMap = {}
    let clinicsMap = {}

    if (patientIds.length > 0) {
        const { data: patients } = await supabase
            .from('users')
            .select('id, name, email')
            .in('id', patientIds)
        patientsMap = Object.fromEntries((patients || []).map((p) => [p.id, p]))
    }

    if (clinicIds.length > 0) {
        const { data: clinics } = await supabase
            .from('clinics')
            .select('id, clinic_name, city')
            .in('id', clinicIds)
        clinicsMap = Object.fromEntries((clinics || []).map((c) => [c.id, c]))
    }

    return (appointments || []).map((a) => formatAppointment(a, patientsMap, clinicsMap))
}

const getPendingPayments = async (req, res) => {
    try {
        const doctorId = await getAssistantDoctorId(req.user.id)

        const { data: appointments } = await supabase
            .from('doctor_appointments')
            .select('id')
            .eq('doctor_id', doctorId)

        const appointmentIds = (appointments || []).map((a) => a.id)
        if (appointmentIds.length === 0) {
            return res.json({ success: true, payments: [] })
        }

        const { data: payments, error } = await supabase
            .from('payments')
            .select('*')
            .in('appointment_id', appointmentIds)
            .eq('status', 'pending')
            .order('created_at', { ascending: false })

        if (error) throw error

        const patientIds = [...new Set((payments || []).map((p) => p.patient_id))]
        const apptIds = [...new Set((payments || []).map((p) => p.appointment_id))]

        let patientsMap = {}
        let apptsMap = {}

        if (patientIds.length > 0) {
            const { data: patients } = await supabase
                .from('users')
                .select('id, name, email')
                .in('id', patientIds)
            patientsMap = Object.fromEntries((patients || []).map((p) => [p.id, p]))
        }

        if (apptIds.length > 0) {
            const { data: appts } = await supabase
                .from('doctor_appointments')
                .select('id, appointment_date, appointment_time')
                .in('id', apptIds)
            apptsMap = Object.fromEntries((appts || []).map((a) => [a.id, a]))
        }

        res.json({
            success: true,
            payments: (payments || []).map((p) => ({
                id: p.id,
                appointmentId: p.appointment_id,
                patientId: p.patient_id,
                patientName: patientsMap[p.patient_id]?.name,
                patientEmail: patientsMap[p.patient_id]?.email,
                appointmentDate: apptsMap[p.appointment_id]?.appointment_date,
                appointmentTime: apptsMap[p.appointment_id]?.appointment_time,
                amount: p.amount,
                screenshotUrl: p.screenshot_url,
                status: p.status,
                createdAt: p.created_at,
            })),
        })
    } catch (error) {
        const status = error.status || 500
        res.status(status).json({ success: false, message: error.message })
    }
}

const verifyPayment = async (req, res) => {
    try {
        const doctorId = await getAssistantDoctorId(req.user.id)
        const { id } = req.params

        const payment = await getPaymentForAssistant(id, doctorId)
        if (!payment) {
            return res.status(404).json({ success: false, message: 'Payment not found' })
        }

        if (payment.status !== 'pending') {
            return res.status(400).json({ success: false, message: 'Payment already processed' })
        }

        const appointment = payment.appointment

        const { error: payErr } = await supabase
            .from('payments')
            .update({ status: 'verified', verified_by: req.user.id, rejection_reason: null })
            .eq('id', id)

        if (payErr) throw payErr

        const { error: apptErr } = await supabase
            .from('doctor_appointments')
            .update({ status: 'confirmed', payment_status: 'paid' })
            .eq('id', appointment.id)

        if (apptErr) throw apptErr

        res.json({
            success: true,
            message: 'Payment verified. Appointment confirmed.',
        })
    } catch (error) {
        const status = error.status || 500
        res.status(status).json({ success: false, message: error.message })
    }
}

const rejectPayment = async (req, res) => {
    try {
        const doctorId = await getAssistantDoctorId(req.user.id)
        const { id } = req.params
        const { reason } = req.body

        if (!reason?.trim()) {
            return res.status(400).json({ success: false, message: 'Rejection reason is required' })
        }

        const payment = await getPaymentForAssistant(id, doctorId)
        if (!payment) {
            return res.status(404).json({ success: false, message: 'Payment not found' })
        }

        if (payment.status !== 'pending') {
            return res.status(400).json({ success: false, message: 'Payment already processed' })
        }

        const { error } = await supabase
            .from('payments')
            .update({
                status: 'rejected',
                verified_by: req.user.id,
                rejection_reason: reason.trim(),
            })
            .eq('id', id)

        if (error) throw error

        res.json({
            success: true,
            message: 'Payment rejected.',
        })
    } catch (error) {
        const status = error.status || 500
        res.status(status).json({ success: false, message: error.message })
    }
}

const getAppointments = async (req, res) => {
    try {
        const doctorId = await getAssistantDoctorId(req.user.id)

        const { data, error } = await supabase
            .from('doctor_appointments')
            .select('*')
            .eq('doctor_id', doctorId)
            .order('appointment_date', { ascending: false })

        if (error) throw error

        const appointments = await enrichAppointments(data)
        res.json({ success: true, appointments })
    } catch (error) {
        const status = error.status || 500
        res.status(status).json({ success: false, message: error.message })
    }
}

const getBookings = async (req, res) => {
    try {
        const doctorId = await getAssistantDoctorId(req.user.id)

        const { data: appointments, error } = await supabase
            .from('doctor_appointments')
            .select('*')
            .eq('doctor_id', doctorId)
            .order('created_at', { ascending: false })

        if (error) throw error

        const appointmentIds = (appointments || []).map((a) => a.id)
        let paymentsMap = {}

        if (appointmentIds.length > 0) {
            const { data: payments } = await supabase
                .from('payments')
                .select('id, appointment_id, amount, screenshot_url, status, rejection_reason, created_at')
                .in('appointment_id', appointmentIds)
                .order('created_at', { ascending: false })

            for (const p of payments || []) {
                if (!paymentsMap[p.appointment_id]) paymentsMap[p.appointment_id] = p
            }
        }

        const enriched = await enrichAppointments(appointments)

        res.json({
            success: true,
            bookings: enriched.map((a) => ({
                ...a,
                payment: paymentsMap[a.id] ? {
                    id: paymentsMap[a.id].id,
                    amount: paymentsMap[a.id].amount,
                    screenshotUrl: paymentsMap[a.id].screenshot_url,
                    status: paymentsMap[a.id].status,
                    rejectionReason: paymentsMap[a.id].rejection_reason,
                } : null,
            })),
        })
    } catch (error) {
        const status = error.status || 500
        res.status(status).json({ success: false, message: error.message })
    }
}

const getDashboardStats = async (req, res) => {
    try {
        const doctorId = await getAssistantDoctorId(req.user.id)
        const today = new Date().toISOString().split('T')[0]

        const { data: appointments } = await supabase
            .from('doctor_appointments')
            .select('id, appointment_date, status')
            .eq('doctor_id', doctorId)

        const appointmentIds = (appointments || []).map((a) => a.id)
        let pendingPayments = 0

        if (appointmentIds.length > 0) {
            const { count } = await supabase
                .from('payments')
                .select('*', { count: 'exact', head: true })
                .in('appointment_id', appointmentIds)
                .eq('status', 'pending')

            pendingPayments = count || 0
        }

        const todayAppointments = (appointments || []).filter(
            (a) => a.appointment_date === today && a.status !== 'cancelled'
        ).length

        const confirmedToday = (appointments || []).filter(
            (a) => a.appointment_date === today && a.status === 'confirmed'
        ).length

        res.json({
            success: true,
            stats: {
                pendingPayments,
                todayAppointments,
                confirmedToday,
                totalAppointments: appointments?.length || 0,
            },
        })
    } catch (error) {
        const status = error.status || 500
        res.status(status).json({ success: false, message: error.message })
    }
}

export {
    getPendingPayments,
    verifyPayment,
    rejectPayment,
    getAppointments,
    getBookings,
    getDashboardStats,
}
