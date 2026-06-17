import bcrypt from 'bcrypt'
import supabase from '../config/supabaseClient.js'

const DEFAULT_IMAGE = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPAAAADwCAYAAAA+VemSAAAACXBIWXMAABCcAAAQnAEmzTo0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAADASURBVHgB7cExAQAAAMKg9U9tCy+gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAeAMBuAABHgAAAABJRU5ErkJggg=='

const listDoctors = async (req, res) => {
    try {
        const { data: doctors, error } = await supabase
            .from('doctor_profiles')
            .select('*')

        if (error) throw error

        const userIds = (doctors || []).map((d) => d.user_id)
        let usersMap = {}

        if (userIds.length > 0) {
            const { data: users } = await supabase
                .from('users')
                .select('id, name, email, phone, created_at')
                .in('id', userIds)
            usersMap = Object.fromEntries((users || []).map((u) => [u.id, u]))
        }

        res.json({
            success: true,
            doctors: (doctors || []).map((d) => ({
                id: d.id,
                userId: d.user_id,
                name: usersMap[d.user_id]?.name,
                email: usersMap[d.user_id]?.email,
                specialization: d.specialization,
                treatmentType: d.treatment_type,
                experience: d.experience,
                fee: d.fee,
                isVerified: d.is_verified,
                rating: d.rating,
                createdAt: usersMap[d.user_id]?.created_at,
            })),
        })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

const verifyDoctor = async (req, res) => {
    try {
        const { id } = req.params
        const { error } = await supabase
            .from('doctor_profiles')
            .update({ is_verified: true })
            .eq('id', id)

        if (error) throw error
        res.json({ success: true, message: 'Doctor verified' })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

const unverifyDoctor = async (req, res) => {
    try {
        const { id } = req.params
        const { error } = await supabase
            .from('doctor_profiles')
            .update({ is_verified: false })
            .eq('id', id)

        if (error) throw error
        res.json({ success: true, message: 'Doctor unverified' })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

const listPatients = async (req, res) => {
    try {
        const { data: patients, error } = await supabase
            .from('patients')
            .select('*')

        if (error) throw error

        const userIds = (patients || []).map((p) => p.user_id)
        let usersMap = {}

        if (userIds.length > 0) {
            const { data: users } = await supabase
                .from('users')
                .select('id, name, email, phone, gender, created_at')
                .in('id', userIds)
            usersMap = Object.fromEntries((users || []).map((u) => [u.id, u]))
        }

        res.json({
            success: true,
            patients: (patients || []).map((p) => ({
                id: p.id,
                userId: p.user_id,
                name: usersMap[p.user_id]?.name,
                email: usersMap[p.user_id]?.email,
                phone: usersMap[p.user_id]?.phone,
                gender: usersMap[p.user_id]?.gender,
                age: p.age,
                bloodGroup: p.blood_group,
                createdAt: usersMap[p.user_id]?.created_at,
            })),
        })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

const listAppointments = async (req, res) => {
    try {
        const { date, status } = req.query

        let query = supabase
            .from('doctor_appointments')
            .select('*')
            .order('appointment_date', { ascending: false })

        if (date) query = query.eq('appointment_date', date)
        if (status) query = query.eq('status', status)

        const { data, error } = await query
        if (error) throw error

        const patientIds = [...new Set((data || []).map((a) => a.patient_id))]
        const doctorIds = [...new Set((data || []).map((a) => a.doctor_id))]

        let patientsMap = {}
        let doctorsMap = {}
        let doctorUsersMap = {}

        if (patientIds.length > 0) {
            const { data: patients } = await supabase
                .from('users')
                .select('id, name, email')
                .in('id', patientIds)
            patientsMap = Object.fromEntries((patients || []).map((p) => [p.id, p]))
        }

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
                doctorUsersMap = Object.fromEntries((users || []).map((u) => [u.id, u]))
            }

            doctorsMap = Object.fromEntries((doctors || []).map((d) => [
                d.id,
                { name: doctorUsersMap[d.user_id]?.name, specialization: d.specialization },
            ]))
        }

        res.json({
            success: true,
            appointments: (data || []).map((a) => ({
                id: a.id,
                patientName: patientsMap[a.patient_id]?.name,
                patientEmail: patientsMap[a.patient_id]?.email,
                doctorName: doctorsMap[a.doctor_id]?.name,
                specialization: doctorsMap[a.doctor_id]?.specialization,
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

const listPayments = async (req, res) => {
    try {
        const { data: payments, error } = await supabase
            .from('payments')
            .select('*')
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
                patientName: patientsMap[p.patient_id]?.name,
                patientEmail: patientsMap[p.patient_id]?.email,
                appointmentDate: apptsMap[p.appointment_id]?.appointment_date,
                appointmentTime: apptsMap[p.appointment_id]?.appointment_time,
                amount: p.amount,
                screenshotUrl: p.screenshot_url,
                status: p.status,
                rejectionReason: p.rejection_reason,
                createdAt: p.created_at,
            })),
        })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

const getAnalytics = async (req, res) => {
    try {
        const { count: doctorCount } = await supabase
            .from('doctor_profiles')
            .select('*', { count: 'exact', head: true })

        const { count: patientCount } = await supabase
            .from('users')
            .select('*', { count: 'exact', head: true })
            .eq('role', 'patient')

        const { count: appointmentCount } = await supabase
            .from('doctor_appointments')
            .select('*', { count: 'exact', head: true })

        const { data: verifiedPayments } = await supabase
            .from('payments')
            .select('amount')
            .eq('status', 'verified')

        const totalRevenue = (verifiedPayments || []).reduce(
            (sum, p) => sum + Number(p.amount || 0), 0
        )

        const days = []
        for (let i = 6; i >= 0; i--) {
            const d = new Date()
            d.setDate(d.getDate() - i)
            days.push(d.toISOString().split('T')[0])
        }

        const { data: recentAppts } = await supabase
            .from('doctor_appointments')
            .select('appointment_date')
            .gte('appointment_date', days[0])
            .lte('appointment_date', days[6])

        const apptsPerDay = days.map((date) => ({
            date,
            count: (recentAppts || []).filter((a) => a.appointment_date === date).length,
        }))

        const { data: doctors } = await supabase
            .from('doctor_profiles')
            .select('treatment_type')

        const treatmentCounts = { allopathic: 0, homeopathic: 0, herbal: 0, unset: 0 }
        for (const d of doctors || []) {
            if (d.treatment_type && treatmentCounts[d.treatment_type] !== undefined) {
                treatmentCounts[d.treatment_type]++
            } else {
                treatmentCounts.unset++
            }
        }

        const treatmentTypes = Object.entries(treatmentCounts)
            .filter(([, count]) => count > 0)
            .map(([type, count]) => ({ type, count }))

        const today = new Date().toISOString().split('T')[0]

        const { count: todayAppointments } = await supabase
            .from('doctor_appointments')
            .select('*', { count: 'exact', head: true })
            .eq('appointment_date', today)
            .neq('status', 'cancelled')

        res.json({
            success: true,
            analytics: {
                totalDoctors: doctorCount || 0,
                totalPatients: patientCount || 0,
                totalAppointments: appointmentCount || 0,
                todayAppointments: todayAppointments || 0,
                totalRevenue,
                appointmentsPerDay: apptsPerDay,
                treatmentTypes,
            },
        })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

const createDoctor = async (req, res) => {
    try {
        const {
            name, email, password,
            specialization, treatmentType, experience, fee, bio,
            isVerified = true,
        } = req.body

        const { data: existing } = await supabase
            .from('users')
            .select('id')
            .eq('email', email)
            .maybeSingle()

        if (existing) {
            return res.status(409).json({ success: false, message: 'Email already registered' })
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const { data: user, error: userErr } = await supabase
            .from('users')
            .insert({
                name,
                email,
                password: hashedPassword,
                role: 'doctor',
                image: DEFAULT_IMAGE,
                phone: '000000000',
                address: { line1: '', line2: '' },
                gender: 'Not Selected',
                dob: 'Not Selected',
            })
            .select('id, name, email')
            .single()

        if (userErr) throw userErr

        const { data: profile, error: profileErr } = await supabase
            .from('doctor_profiles')
            .insert({
                user_id: user.id,
                specialization: specialization || null,
                treatment_type: treatmentType || null,
                experience: experience ?? 0,
                fee: fee ?? 0,
                bio: bio || null,
                is_verified: Boolean(isVerified),
            })
            .select('id, specialization, treatment_type, experience, fee, is_verified')
            .single()

        if (profileErr) throw profileErr

        res.status(201).json({
            success: true,
            message: 'Doctor account created',
            doctor: {
                id: profile.id,
                userId: user.id,
                name: user.name,
                email: user.email,
                specialization: profile.specialization,
                treatmentType: profile.treatment_type,
                experience: profile.experience,
                fee: profile.fee,
                isVerified: profile.is_verified,
            },
        })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

const updateDoctor = async (req, res) => {
    try {
        const { id } = req.params
        const {
            name, email, password,
            specialization, treatmentType, experience, fee, bio, isVerified,
        } = req.body

        const { data: profile, error: profileErr } = await supabase
            .from('doctor_profiles')
            .select('id, user_id')
            .eq('id', id)
            .maybeSingle()

        if (profileErr) throw profileErr
        if (!profile) {
            return res.status(404).json({ success: false, message: 'Doctor not found' })
        }

        if (email) {
            const { data: emailTaken } = await supabase
                .from('users')
                .select('id')
                .eq('email', email)
                .neq('id', profile.user_id)
                .maybeSingle()

            if (emailTaken) {
                return res.status(409).json({ success: false, message: 'Email already in use' })
            }
        }

        const userUpdates = {}
        if (name) userUpdates.name = name
        if (email) userUpdates.email = email
        if (password) userUpdates.password = await bcrypt.hash(password, 10)

        if (Object.keys(userUpdates).length > 0) {
            const { error: userErr } = await supabase
                .from('users')
                .update(userUpdates)
                .eq('id', profile.user_id)
            if (userErr) throw userErr
        }

        const profileUpdates = {}
        if (specialization !== undefined) profileUpdates.specialization = specialization || null
        if (treatmentType !== undefined) profileUpdates.treatment_type = treatmentType || null
        if (experience !== undefined) profileUpdates.experience = experience
        if (fee !== undefined) profileUpdates.fee = fee
        if (bio !== undefined) profileUpdates.bio = bio || null
        if (isVerified !== undefined) profileUpdates.is_verified = isVerified

        if (Object.keys(profileUpdates).length > 0) {
            const { error: updateErr } = await supabase
                .from('doctor_profiles')
                .update(profileUpdates)
                .eq('id', id)
            if (updateErr) throw updateErr
        }

        res.json({ success: true, message: 'Doctor updated' })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

const deleteDoctor = async (req, res) => {
    try {
        const { id } = req.params

        const { data: profile, error: profileErr } = await supabase
            .from('doctor_profiles')
            .select('id, user_id')
            .eq('id', id)
            .maybeSingle()

        if (profileErr) throw profileErr
        if (!profile) {
            return res.status(404).json({ success: false, message: 'Doctor not found' })
        }

        if (profile.user_id === req.user.id) {
            return res.status(400).json({ success: false, message: 'Cannot delete your own account' })
        }

        const { error: deleteErr } = await supabase
            .from('users')
            .delete()
            .eq('id', profile.user_id)

        if (deleteErr) throw deleteErr

        res.json({ success: true, message: 'Doctor deleted' })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

const listAssistants = async (req, res) => {
    try {
        const { data: assistants, error } = await supabase
            .from('assistants')
            .select('*')
            .order('id', { ascending: false })

        if (error) throw error

        const userIds = (assistants || []).map((a) => a.user_id)
        const doctorIds = [...new Set((assistants || []).map((a) => a.doctor_id).filter(Boolean))]

        let usersMap = {}
        let doctorsMap = {}

        if (userIds.length > 0) {
            const { data: users } = await supabase
                .from('users')
                .select('id, name, email, phone, created_at')
                .in('id', userIds)
            usersMap = Object.fromEntries((users || []).map((u) => [u.id, u]))
        }

        if (doctorIds.length > 0) {
            const { data: doctors } = await supabase
                .from('doctor_profiles')
                .select('id, user_id, specialization')
                .in('id', doctorIds)

            const docUserIds = (doctors || []).map((d) => d.user_id)
            let docUsersMap = {}
            if (docUserIds.length > 0) {
                const { data: docUsers } = await supabase
                    .from('users')
                    .select('id, name')
                    .in('id', docUserIds)
                docUsersMap = Object.fromEntries((docUsers || []).map((u) => [u.id, u]))
            }

            doctorsMap = Object.fromEntries((doctors || []).map((d) => [
                d.id,
                { name: docUsersMap[d.user_id]?.name, specialization: d.specialization },
            ]))
        }

        res.json({
            success: true,
            assistants: (assistants || []).map((a) => ({
                id: a.id,
                userId: a.user_id,
                name: usersMap[a.user_id]?.name,
                email: usersMap[a.user_id]?.email,
                phone: usersMap[a.user_id]?.phone,
                doctorId: a.doctor_id,
                doctorName: a.doctor_id ? doctorsMap[a.doctor_id]?.name : null,
                doctorSpecialization: a.doctor_id ? doctorsMap[a.doctor_id]?.specialization : null,
                createdAt: usersMap[a.user_id]?.created_at,
            })),
        })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

const createAssistant = async (req, res) => {
    try {
        const { name, email, password, doctorId } = req.body

        const { data: existing } = await supabase
            .from('users')
            .select('id')
            .eq('email', email)
            .maybeSingle()

        if (existing) {
            return res.status(409).json({ success: false, message: 'Email already registered' })
        }

        if (doctorId) {
            const { data: doctor } = await supabase
                .from('doctor_profiles')
                .select('id')
                .eq('id', doctorId)
                .maybeSingle()
            if (!doctor) {
                return res.status(404).json({ success: false, message: 'Assigned doctor not found' })
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const { data: user, error: userErr } = await supabase
            .from('users')
            .insert({
                name,
                email,
                password: hashedPassword,
                role: 'assistant',
                image: DEFAULT_IMAGE,
                phone: '000000000',
                address: { line1: '', line2: '' },
                gender: 'Not Selected',
                dob: 'Not Selected',
            })
            .select('id, name, email')
            .single()

        if (userErr) throw userErr

        const { data: assistant, error: assistantErr } = await supabase
            .from('assistants')
            .insert({
                user_id: user.id,
                doctor_id: doctorId || null,
            })
            .select('id, doctor_id')
            .single()

        if (assistantErr) throw assistantErr

        res.status(201).json({
            success: true,
            message: 'Assistant account created',
            assistant: {
                id: assistant.id,
                userId: user.id,
                name: user.name,
                email: user.email,
                doctorId: assistant.doctor_id,
            },
        })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

const updateAssistant = async (req, res) => {
    try {
        const { id } = req.params
        const { name, email, password, doctorId } = req.body

        const { data: assistant, error: assistantErr } = await supabase
            .from('assistants')
            .select('id, user_id, doctor_id')
            .eq('id', id)
            .maybeSingle()

        if (assistantErr) throw assistantErr
        if (!assistant) {
            return res.status(404).json({ success: false, message: 'Assistant not found' })
        }

        if (email) {
            const { data: emailTaken } = await supabase
                .from('users')
                .select('id')
                .eq('email', email)
                .neq('id', assistant.user_id)
                .maybeSingle()

            if (emailTaken) {
                return res.status(409).json({ success: false, message: 'Email already in use' })
            }
        }

        if (doctorId) {
            const { data: doctor } = await supabase
                .from('doctor_profiles')
                .select('id')
                .eq('id', doctorId)
                .maybeSingle()
            if (!doctor) {
                return res.status(404).json({ success: false, message: 'Assigned doctor not found' })
            }
        }

        const userUpdates = {}
        if (name) userUpdates.name = name
        if (email) userUpdates.email = email
        if (password) userUpdates.password = await bcrypt.hash(password, 10)

        if (Object.keys(userUpdates).length > 0) {
            const { error: userErr } = await supabase
                .from('users')
                .update(userUpdates)
                .eq('id', assistant.user_id)
            if (userErr) throw userErr
        }

        if (doctorId !== undefined) {
            const { error: assignErr } = await supabase
                .from('assistants')
                .update({ doctor_id: doctorId || null })
                .eq('id', id)
            if (assignErr) throw assignErr
        }

        res.json({ success: true, message: 'Assistant updated' })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

const deleteAssistant = async (req, res) => {
    try {
        const { id } = req.params

        const { data: assistant, error: assistantErr } = await supabase
            .from('assistants')
            .select('id, user_id')
            .eq('id', id)
            .maybeSingle()

        if (assistantErr) throw assistantErr
        if (!assistant) {
            return res.status(404).json({ success: false, message: 'Assistant not found' })
        }

        if (assistant.user_id === req.user.id) {
            return res.status(400).json({ success: false, message: 'Cannot delete your own account' })
        }

        const { error: deleteErr } = await supabase
            .from('users')
            .delete()
            .eq('id', assistant.user_id)

        if (deleteErr) throw deleteErr

        res.json({ success: true, message: 'Assistant deleted' })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

export {
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
}
