import supabase from '../config/supabaseClient.js'

const getMyAppointments = async (req, res) => {
    try {
        const patientId = req.user.id

        const { data: appointments, error } = await supabase
            .from('doctor_appointments')
            .select('*')
            .eq('patient_id', patientId)
            .order('appointment_date', { ascending: false })

        if (error) throw error

        const doctorIds = [...new Set((appointments || []).map((a) => a.doctor_id))]
        const clinicIds = [...new Set((appointments || []).map((a) => a.clinic_id).filter(Boolean))]

        let doctorsMap = {}
        let clinicsMap = {}
        let usersMap = {}

        if (doctorIds.length > 0) {
            const { data: doctors } = await supabase
                .from('doctor_profiles')
                .select('id, specialization, user_id')
                .in('id', doctorIds)

            const userIds = (doctors || []).map((d) => d.user_id)
            if (userIds.length > 0) {
                const { data: users } = await supabase
                    .from('users')
                    .select('id, name')
                    .in('id', userIds)
                usersMap = Object.fromEntries((users || []).map((u) => [u.id, u]))
            }

            doctorsMap = Object.fromEntries((doctors || []).map((d) => [
                d.id,
                { specialization: d.specialization, name: usersMap[d.user_id]?.name },
            ]))
        }

        if (clinicIds.length > 0) {
            const { data: clinics } = await supabase
                .from('clinics')
                .select('id, clinic_name, address, city')
                .in('id', clinicIds)

            clinicsMap = Object.fromEntries((clinics || []).map((c) => [c.id, c]))
        }

        res.json({
            success: true,
            appointments: (appointments || []).map((a) => ({
                id: a.id,
                doctorId: a.doctor_id,
                doctorName: doctorsMap[a.doctor_id]?.name,
                specialization: doctorsMap[a.doctor_id]?.specialization,
                clinicId: a.clinic_id,
                clinicName: clinicsMap[a.clinic_id]?.clinic_name,
                clinicAddress: clinicsMap[a.clinic_id]
                    ? `${clinicsMap[a.clinic_id].address}, ${clinicsMap[a.clinic_id].city}`
                    : null,
                date: a.appointment_date,
                timeSlot: a.appointment_time,
                status: a.status,
                paymentStatus: a.payment_status,
                amount: a.amount,
                createdAt: a.created_at,
            })),
        })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

const getMedicalHistory = async (req, res) => {
    try {
        const patientId = req.user.id

        const { data: records, error } = await supabase
            .from('medical_history')
            .select('*')
            .eq('patient_id', patientId)
            .order('visit_date', { ascending: false })

        if (error) throw error

        const doctorIds = [...new Set((records || []).map((r) => r.doctor_id))]
        let doctorsMap = {}
        let usersMap = {}

        if (doctorIds.length > 0) {
            const { data: doctors } = await supabase
                .from('doctor_profiles')
                .select('id, specialization, user_id')
                .in('id', doctorIds)

            const userIds = (doctors || []).map((d) => d.user_id)
            if (userIds.length > 0) {
                const { data: users } = await supabase
                    .from('users')
                    .select('id, name')
                    .in('id', userIds)
                usersMap = Object.fromEntries((users || []).map((u) => [u.id, u]))
            }

            doctorsMap = Object.fromEntries((doctors || []).map((d) => [
                d.id,
                { name: usersMap[d.user_id]?.name, specialization: d.specialization },
            ]))
        }

        res.json({
            success: true,
            history: (records || []).map((r) => ({
                id: r.id,
                doctorId: r.doctor_id,
                doctorName: doctorsMap[r.doctor_id]?.name,
                specialization: doctorsMap[r.doctor_id]?.specialization,
                visitDate: r.visit_date,
                symptoms: r.symptoms,
                diagnosis: r.diagnosis,
                notes: r.notes,
                createdAt: r.created_at,
            })),
        })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

const getPrescriptions = async (req, res) => {
    try {
        const patientId = req.user.id

        const { data: records, error } = await supabase
            .from('prescriptions')
            .select('*')
            .eq('patient_id', patientId)
            .order('created_at', { ascending: false })

        if (error) throw error

        const doctorIds = [...new Set((records || []).map((r) => r.doctor_id))]
        let doctorsMap = {}
        let usersMap = {}

        if (doctorIds.length > 0) {
            const { data: doctors } = await supabase
                .from('doctor_profiles')
                .select('id, user_id')
                .in('id', doctorIds)

            const userIds = (doctors || []).map((d) => d.user_id)
            if (userIds.length > 0) {
                const { data: users } = await supabase
                    .from('users')
                    .select('id, name')
                    .in('id', userIds)
                usersMap = Object.fromEntries((users || []).map((u) => [u.id, u]))
            }

            doctorsMap = Object.fromEntries((doctors || []).map((d) => [
                d.id,
                usersMap[d.user_id]?.name,
            ]))
        }

        res.json({
            success: true,
            prescriptions: (records || []).map((r) => ({
                id: r.id,
                medicalHistoryId: r.medical_history_id,
                doctorId: r.doctor_id,
                doctorName: doctorsMap[r.doctor_id],
                medicines: r.medicines,
                instructions: r.instructions,
                createdAt: r.created_at,
            })),
        })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

const getDashboardStats = async (req, res) => {
    try {
        const patientId = req.user.id

        const { data: appointments } = await supabase
            .from('doctor_appointments')
            .select('status, appointment_date')
            .eq('patient_id', patientId)

        const { count: historyCount } = await supabase
            .from('medical_history')
            .select('*', { count: 'exact', head: true })
            .eq('patient_id', patientId)

        const { count: rxCount } = await supabase
            .from('prescriptions')
            .select('*', { count: 'exact', head: true })
            .eq('patient_id', patientId)

        const today = new Date().toISOString().split('T')[0]
        const upcoming = (appointments || []).filter(
            (a) => a.appointment_date >= today && a.status !== 'cancelled' && a.status !== 'completed'
        ).length

        res.json({
            success: true,
            stats: {
                totalAppointments: appointments?.length || 0,
                upcomingAppointments: upcoming,
                historyRecords: historyCount || 0,
                prescriptions: rxCount || 0,
            },
        })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

export { getMyAppointments, getMedicalHistory, getPrescriptions, getDashboardStats }
