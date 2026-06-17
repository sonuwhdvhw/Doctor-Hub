import supabase from '../config/supabaseClient.js'

const getDoctorByUserId = async (userId) => {
    const { data, error } = await supabase
        .from('doctor_profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle()

    if (error) throw error
    return data
}

const getDoctorAppointment = async (doctorId, appointmentId, patientId) => {
    const { data, error } = await supabase
        .from('doctor_appointments')
        .select('*')
        .eq('id', appointmentId)
        .eq('doctor_id', doctorId)
        .eq('patient_id', patientId)
        .maybeSingle()

    if (error) throw error
    return data
}

const addMedicalHistory = async (req, res) => {
    try {
        const { patientId, appointmentId, symptoms, diagnosis, notes } = req.body

        if (!patientId || !appointmentId) {
            return res.status(400).json({ success: false, message: 'patientId and appointmentId are required' })
        }

        if (!symptoms || !diagnosis) {
            return res.status(400).json({ success: false, message: 'symptoms and diagnosis are required' })
        }

        const doctor = await getDoctorByUserId(req.user.id)
        if (!doctor) {
            return res.status(404).json({ success: false, message: 'Doctor profile not found' })
        }

        const appointment = await getDoctorAppointment(doctor.id, appointmentId, patientId)
        if (!appointment) {
            return res.status(403).json({ success: false, message: 'Appointment not found or does not belong to you' })
        }

        if (!['confirmed', 'completed'].includes(appointment.status)) {
            return res.status(400).json({
                success: false,
                message: 'Medical history can only be added for confirmed or completed appointments',
            })
        }

        const { data: existing } = await supabase
            .from('medical_history')
            .select('id')
            .eq('appointment_id', appointmentId)
            .maybeSingle()

        if (existing) {
            return res.status(409).json({ success: false, message: 'Medical record already exists for this appointment' })
        }

        const { data: record, error } = await supabase
            .from('medical_history')
            .insert({
                patient_id: patientId,
                doctor_id: doctor.id,
                appointment_id: appointmentId,
                visit_date: appointment.appointment_date,
                symptoms,
                diagnosis,
                notes: notes || '',
            })
            .select()
            .single()

        if (error) throw error

        if (appointment.status === 'confirmed') {
            await supabase
                .from('doctor_appointments')
                .update({ status: 'completed' })
                .eq('id', appointmentId)
        }

        res.status(201).json({
            success: true,
            message: 'Medical history record created',
            record: {
                id: record.id,
                patientId: record.patient_id,
                appointmentId: record.appointment_id,
                visitDate: record.visit_date,
                symptoms: record.symptoms,
                diagnosis: record.diagnosis,
                notes: record.notes,
                createdAt: record.created_at,
            },
        })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

const getPatientMedicalHistory = async (req, res) => {
    try {
        const { patientId } = req.params

        const doctor = await getDoctorByUserId(req.user.id)
        if (!doctor) {
            return res.status(404).json({ success: false, message: 'Doctor profile not found' })
        }

        const { data: hasAppt } = await supabase
            .from('doctor_appointments')
            .select('id')
            .eq('doctor_id', doctor.id)
            .eq('patient_id', patientId)
            .limit(1)

        if (!hasAppt?.length) {
            return res.status(403).json({ success: false, message: 'No appointments with this patient' })
        }

        const { data: records, error } = await supabase
            .from('medical_history')
            .select('*')
            .eq('patient_id', patientId)
            .eq('doctor_id', doctor.id)
            .order('visit_date', { ascending: false })

        if (error) throw error

        res.json({
            success: true,
            history: (records || []).map((r) => ({
                id: r.id,
                patientId: r.patient_id,
                appointmentId: r.appointment_id,
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

const addPrescription = async (req, res) => {
    try {
        const { patientId, appointmentId, medicalHistoryId, medicines, instructions } = req.body

        if (!patientId || !appointmentId || !medicalHistoryId) {
            return res.status(400).json({ success: false, message: 'patientId, appointmentId and medicalHistoryId are required' })
        }

        if (!Array.isArray(medicines) || medicines.length === 0) {
            return res.status(400).json({ success: false, message: 'At least one medicine is required' })
        }

        for (const med of medicines) {
            if (!med.name || !med.dosage || !med.frequency || !med.duration) {
                return res.status(400).json({ success: false, message: 'Each medicine needs name, dosage, frequency and duration' })
            }
        }

        const doctor = await getDoctorByUserId(req.user.id)
        if (!doctor) {
            return res.status(404).json({ success: false, message: 'Doctor profile not found' })
        }

        const appointment = await getDoctorAppointment(doctor.id, appointmentId, patientId)
        if (!appointment) {
            return res.status(403).json({ success: false, message: 'Appointment not found or does not belong to you' })
        }

        if (!['confirmed', 'completed'].includes(appointment.status)) {
            return res.status(400).json({
                success: false,
                message: 'Prescription can only be added for confirmed or completed appointments',
            })
        }

        const { data: history, error: histErr } = await supabase
            .from('medical_history')
            .select('id')
            .eq('id', medicalHistoryId)
            .eq('patient_id', patientId)
            .eq('doctor_id', doctor.id)
            .eq('appointment_id', appointmentId)
            .maybeSingle()

        if (histErr || !history) {
            return res.status(400).json({ success: false, message: 'Invalid medical history record' })
        }

        const { data: existingRx } = await supabase
            .from('prescriptions')
            .select('id')
            .eq('medical_history_id', medicalHistoryId)
            .maybeSingle()

        if (existingRx) {
            return res.status(409).json({ success: false, message: 'Prescription already exists for this visit. Prescriptions cannot be edited.' })
        }

        const { data: prescription, error } = await supabase
            .from('prescriptions')
            .insert({
                medical_history_id: medicalHistoryId,
                doctor_id: doctor.id,
                patient_id: patientId,
                appointment_id: appointmentId,
                medicines,
                instructions: instructions || '',
            })
            .select()
            .single()

        if (error) throw error

        res.status(201).json({
            success: true,
            message: 'Prescription created. It cannot be edited after submission.',
            prescription: {
                id: prescription.id,
                medicalHistoryId: prescription.medical_history_id,
                patientId: prescription.patient_id,
                appointmentId: prescription.appointment_id,
                medicines: prescription.medicines,
                instructions: prescription.instructions,
                createdAt: prescription.created_at,
            },
        })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

const getPatientPrescriptions = async (req, res) => {
    try {
        const { patientId } = req.params

        const doctor = await getDoctorByUserId(req.user.id)
        if (!doctor) {
            return res.status(404).json({ success: false, message: 'Doctor profile not found' })
        }

        const { data: hasAppt } = await supabase
            .from('doctor_appointments')
            .select('id')
            .eq('doctor_id', doctor.id)
            .eq('patient_id', patientId)
            .limit(1)

        if (!hasAppt?.length) {
            return res.status(403).json({ success: false, message: 'No appointments with this patient' })
        }

        const { data: records, error } = await supabase
            .from('prescriptions')
            .select('*')
            .eq('patient_id', patientId)
            .eq('doctor_id', doctor.id)
            .order('created_at', { ascending: false })

        if (error) throw error

        res.json({
            success: true,
            prescriptions: (records || []).map((r) => ({
                id: r.id,
                medicalHistoryId: r.medical_history_id,
                appointmentId: r.appointment_id,
                medicines: r.medicines,
                instructions: r.instructions,
                createdAt: r.created_at,
            })),
        })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

const getPatientTimeline = async (req, res) => {
    try {
        const { patientId } = req.params

        const doctor = await getDoctorByUserId(req.user.id)
        if (!doctor) {
            return res.status(404).json({ success: false, message: 'Doctor profile not found' })
        }

        const { data: patient } = await supabase
            .from('users')
            .select('id, name, email')
            .eq('id', patientId)
            .maybeSingle()

        const { data: history } = await supabase
            .from('medical_history')
            .select('*')
            .eq('patient_id', patientId)
            .eq('doctor_id', doctor.id)
            .order('visit_date', { ascending: false })

        const historyIds = (history || []).map((h) => h.id)

        let prescriptionsMap = {}
        if (historyIds.length > 0) {
            const { data: prescriptions } = await supabase
                .from('prescriptions')
                .select('*')
                .in('medical_history_id', historyIds)

            prescriptionsMap = Object.fromEntries(
                (prescriptions || []).map((p) => [p.medical_history_id, p])
            )
        }

        res.json({
            success: true,
            patient,
            timeline: (history || []).map((h) => ({
                id: h.id,
                visitDate: h.visit_date,
                symptoms: h.symptoms,
                diagnosis: h.diagnosis,
                notes: h.notes,
                appointmentId: h.appointment_id,
                createdAt: h.created_at,
                prescription: prescriptionsMap[h.id] ? {
                    id: prescriptionsMap[h.id].id,
                    medicines: prescriptionsMap[h.id].medicines,
                    instructions: prescriptionsMap[h.id].instructions,
                    createdAt: prescriptionsMap[h.id].created_at,
                } : null,
            })),
        })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

export {
    addMedicalHistory,
    getPatientMedicalHistory,
    addPrescription,
    getPatientPrescriptions,
    getPatientTimeline,
}
