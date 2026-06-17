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

const formatDoctor = (doctor, user = null) => ({
    id: doctor.id,
    userId: doctor.user_id,
    specialization: doctor.specialization,
    treatmentType: doctor.treatment_type,
    experience: doctor.experience,
    fee: doctor.fee,
    bio: doctor.bio,
    isVerified: doctor.is_verified,
    user: user ? { id: user.id, name: user.name, email: user.email } : undefined,
})

const createProfile = async (req, res) => {
    try {
        const { specialization, treatmentType, experience, fee, bio } = req.body

        if (!specialization || !treatmentType) {
            return res.status(400).json({ success: false, message: 'Specialization and treatment type are required' })
        }

        const validTypes = ['allopathic', 'homeopathic', 'herbal']
        if (!validTypes.includes(treatmentType)) {
            return res.status(400).json({ success: false, message: 'Invalid treatment type' })
        }

        const doctor = await getDoctorByUserId(req.user.id)
        if (!doctor) {
            return res.status(404).json({ success: false, message: 'Doctor profile not found. Register as a doctor first.' })
        }

        if (doctor.specialization) {
            return res.status(400).json({ success: false, message: 'Profile already exists. Use PUT to update.' })
        }

        const { data, error } = await supabase
            .from('doctor_profiles')
            .update({
                specialization,
                treatment_type: treatmentType,
                experience: experience || 0,
                fee: fee || 0,
                bio: bio || '',
            })
            .eq('user_id', req.user.id)
            .select()
            .single()

        if (error) throw error

        res.status(201).json({ success: true, message: 'Profile created', doctor: formatDoctor(data, req.user) })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

const updateProfile = async (req, res) => {
    try {
        const { specialization, treatmentType, experience, fee, bio } = req.body
        const doctor = await getDoctorByUserId(req.user.id)

        if (!doctor) {
            return res.status(404).json({ success: false, message: 'Doctor profile not found' })
        }

        const updates = {}
        if (specialization !== undefined) updates.specialization = specialization
        if (treatmentType !== undefined) updates.treatment_type = treatmentType
        if (experience !== undefined) updates.experience = experience
        if (fee !== undefined) updates.fee = fee
        if (bio !== undefined) updates.bio = bio

        const { data, error } = await supabase
            .from('doctor_profiles')
            .update(updates)
            .eq('user_id', req.user.id)
            .select()
            .single()

        if (error) throw error

        res.json({ success: true, message: 'Profile updated', doctor: formatDoctor(data, req.user) })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

const getProfile = async (req, res) => {
    try {
        const doctor = await getDoctorByUserId(req.user.id)
        if (!doctor) {
            return res.status(404).json({ success: false, message: 'Doctor profile not found' })
        }

        res.json({ success: true, doctor: formatDoctor(doctor, req.user) })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

const addClinic = async (req, res) => {
    try {
        const { clinicName, address, city, availableDays, startTime, endTime } = req.body

        if (!clinicName || !address || !city) {
            return res.status(400).json({ success: false, message: 'Clinic name, address and city are required' })
        }

        const doctor = await getDoctorByUserId(req.user.id)
        if (!doctor) {
            return res.status(404).json({ success: false, message: 'Doctor profile not found' })
        }

        const { data, error } = await supabase
            .from('clinics')
            .insert({
                doctor_id: doctor.id,
                clinic_name: clinicName,
                address,
                city,
                available_days: availableDays || [],
                start_time: startTime || '09:00',
                end_time: endTime || '17:00',
            })
            .select()
            .single()

        if (error) throw error

        res.status(201).json({
            success: true,
            message: 'Clinic added',
            clinic: {
                id: data.id,
                doctorId: data.doctor_id,
                clinicName: data.clinic_name,
                address: data.address,
                city: data.city,
                availableDays: data.available_days,
                startTime: data.start_time,
                endTime: data.end_time,
            },
        })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

const getClinics = async (req, res) => {
    try {
        const doctor = await getDoctorByUserId(req.user.id)
        if (!doctor) {
            return res.status(404).json({ success: false, message: 'Doctor profile not found' })
        }

        const { data, error } = await supabase
            .from('clinics')
            .select('*')
            .eq('doctor_id', doctor.id)
            .order('clinic_name')

        if (error) throw error

        res.json({
            success: true,
            clinics: (data || []).map((c) => ({
                id: c.id,
                doctorId: c.doctor_id,
                clinicName: c.clinic_name,
                address: c.address,
                city: c.city,
                availableDays: c.available_days,
                startTime: c.start_time,
                endTime: c.end_time,
            })),
        })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

const setSchedule = async (req, res) => {
    try {
        const { date, timeSlots, isAvailable = true } = req.body

        if (!date || !Array.isArray(timeSlots)) {
            return res.status(400).json({ success: false, message: 'Date and timeSlots array are required' })
        }

        const doctor = await getDoctorByUserId(req.user.id)
        if (!doctor) {
            return res.status(404).json({ success: false, message: 'Doctor profile not found' })
        }

        const { data: existing } = await supabase
            .from('doctor_schedules')
            .select('id')
            .eq('doctor_id', doctor.id)
            .eq('date', date)
            .maybeSingle()

        let result
        if (existing) {
            const { data, error } = await supabase
                .from('doctor_schedules')
                .update({ time_slots: timeSlots, is_available: isAvailable })
                .eq('id', existing.id)
                .select()
                .single()
            if (error) throw error
            result = data
        } else {
            const { data, error } = await supabase
                .from('doctor_schedules')
                .insert({
                    doctor_id: doctor.id,
                    date,
                    time_slots: timeSlots,
                    is_available: isAvailable,
                })
                .select()
                .single()
            if (error) throw error
            result = data
        }

        res.json({
            success: true,
            message: 'Schedule saved',
            schedule: {
                id: result.id,
                doctorId: result.doctor_id,
                date: result.date,
                timeSlots: result.time_slots,
                isAvailable: result.is_available,
            },
        })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

const getSchedule = async (req, res) => {
    try {
        const doctor = await getDoctorByUserId(req.user.id)
        if (!doctor) {
            return res.status(404).json({ success: false, message: 'Doctor profile not found' })
        }

        let query = supabase
            .from('doctor_schedules')
            .select('*')
            .eq('doctor_id', doctor.id)
            .order('date')

        if (req.query.from) query = query.gte('date', req.query.from)
        if (req.query.to) query = query.lte('date', req.query.to)

        const { data, error } = await query
        if (error) throw error

        res.json({
            success: true,
            schedules: (data || []).map((s) => ({
                id: s.id,
                doctorId: s.doctor_id,
                date: s.date,
                timeSlots: s.time_slots,
                isAvailable: s.is_available,
            })),
        })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

const getAppointments = async (req, res) => {
    try {
        const doctor = await getDoctorByUserId(req.user.id)
        if (!doctor) {
            return res.status(404).json({ success: false, message: 'Doctor profile not found' })
        }

        const { data: appointments, error } = await supabase
            .from('doctor_appointments')
            .select('*')
            .eq('doctor_id', doctor.id)
            .order('appointment_date', { ascending: false })

        if (error) throw error

        const patientIds = [...new Set((appointments || []).map((a) => a.patient_id))]
        let patientsMap = {}

        if (patientIds.length > 0) {
            const { data: patients } = await supabase
                .from('users')
                .select('id, name, email')
                .in('id', patientIds)

            patientsMap = Object.fromEntries((patients || []).map((p) => [p.id, p]))
        }

        res.json({
            success: true,
            appointments: (appointments || []).map((a) => ({
                id: a.id,
                patientName: patientsMap[a.patient_id]?.name || 'Unknown',
                patientEmail: patientsMap[a.patient_id]?.email,
                patientId: a.patient_id,
                date: a.appointment_date,
                time: a.appointment_time,
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

const getPatients = async (req, res) => {
    try {
        const doctor = await getDoctorByUserId(req.user.id)
        if (!doctor) {
            return res.status(404).json({ success: false, message: 'Doctor profile not found' })
        }

        const { data: appointments, error } = await supabase
            .from('doctor_appointments')
            .select('patient_id, appointment_date')
            .eq('doctor_id', doctor.id)
            .order('appointment_date', { ascending: false })

        if (error) throw error

        const patientIds = [...new Set((appointments || []).map((a) => a.patient_id))]
        let patientsMap = {}

        if (patientIds.length > 0) {
            const { data: patients } = await supabase
                .from('users')
                .select('id, name, email, phone')
                .in('id', patientIds)

            patientsMap = Object.fromEntries((patients || []).map((p) => [p.id, p]))
        }

        const result = new Map()
        for (const row of appointments || []) {
            const patient = patientsMap[row.patient_id]
            if (!patient) continue

            const existing = result.get(row.patient_id)
            if (!existing) {
                result.set(row.patient_id, {
                    id: patient.id,
                    name: patient.name,
                    email: patient.email,
                    phone: patient.phone,
                    visitCount: 1,
                    lastVisit: row.appointment_date,
                })
            } else {
                existing.visitCount += 1
                if (row.appointment_date > existing.lastVisit) {
                    existing.lastVisit = row.appointment_date
                }
            }
        }

        res.json({ success: true, patients: Array.from(result.values()) })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

const getDashboardStats = async (req, res) => {
    try {
        const doctor = await getDoctorByUserId(req.user.id)
        if (!doctor) {
            return res.status(404).json({ success: false, message: 'Doctor profile not found' })
        }

        const { data: appointments, error } = await supabase
            .from('doctor_appointments')
            .select('id, appointment_date, status, payment_status, patient_id')
            .eq('doctor_id', doctor.id)

        if (error) throw error

        const today = new Date().toISOString().split('T')[0]
        const patientIds = new Set()
        let todayCount = 0
        let pendingPayments = 0

        for (const a of appointments || []) {
            patientIds.add(a.patient_id)
            if (a.appointment_date === today) todayCount++
            if (a.payment_status === 'pending' && a.status !== 'cancelled') pendingPayments++
        }

        res.json({
            success: true,
            stats: {
                totalAppointments: appointments?.length || 0,
                todayAppointments: todayCount,
                totalPatients: patientIds.size,
                pendingPayments,
            },
        })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

export {
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
}
