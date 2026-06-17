import supabase from '../config/supabaseClient.js'

const formatDoctorCard = (doctor, user) => ({
    id: doctor.id,
    name: user?.name,
    specialization: doctor.specialization,
    treatmentType: doctor.treatment_type,
    experience: doctor.experience,
    fee: doctor.fee,
    bio: doctor.bio,
    rating: doctor.rating || 4.5,
    isVerified: doctor.is_verified,
})

const listDoctors = async (req, res) => {
    try {
        const { disease, type, search } = req.query

        let query = supabase
            .from('doctor_profiles')
            .select('*')
            .eq('is_verified', true)
            .not('specialization', 'is', null)

        if (type) query = query.eq('treatment_type', type)

        const { data: doctors, error } = await query
        if (error) throw error

        const userIds = (doctors || []).map((d) => d.user_id)
        let usersMap = {}

        if (userIds.length > 0) {
            const { data: users } = await supabase
                .from('users')
                .select('id, name, email, image')
                .in('id', userIds)

            usersMap = Object.fromEntries((users || []).map((u) => [u.id, u]))
        }

        let results = (doctors || []).map((d) => formatDoctorCard(d, usersMap[d.user_id]))

        const searchTerm = (disease || search || '').toLowerCase().trim()
        if (searchTerm) {
            results = results.filter((d) =>
                d.name?.toLowerCase().includes(searchTerm) ||
                d.specialization?.toLowerCase().includes(searchTerm) ||
                d.bio?.toLowerCase().includes(searchTerm)
            )
        }

        res.json({ success: true, doctors: results })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

const getDoctorById = async (req, res) => {
    try {
        const { id } = req.params

        const { data: doctor, error } = await supabase
            .from('doctor_profiles')
            .select('*')
            .eq('id', id)
            .eq('is_verified', true)
            .maybeSingle()

        if (error) throw error
        if (!doctor) {
            return res.status(404).json({ success: false, message: 'Doctor not found' })
        }

        const { data: user } = await supabase
            .from('users')
            .select('id, name, email, image, phone')
            .eq('id', doctor.user_id)
            .single()

        const { data: clinics } = await supabase
            .from('clinics')
            .select('*')
            .eq('doctor_id', doctor.id)

        const today = new Date().toISOString().split('T')[0]
        const future = new Date()
        future.setDate(future.getDate() + 30)
        const endDate = future.toISOString().split('T')[0]

        const { data: schedules } = await supabase
            .from('doctor_schedules')
            .select('*')
            .eq('doctor_id', doctor.id)
            .eq('is_available', true)
            .gte('date', today)
            .lte('date', endDate)
            .order('date')

        const { data: booked } = await supabase
            .from('doctor_appointments')
            .select('appointment_date, appointment_time')
            .eq('doctor_id', doctor.id)
            .neq('status', 'cancelled')

        const bookedSet = new Set(
            (booked || []).map((b) => `${b.appointment_date}_${b.appointment_time}`)
        )

        const availableSchedules = (schedules || []).map((s) => ({
            date: s.date,
            timeSlots: (s.time_slots || []).filter(
                (slot) => !bookedSet.has(`${s.date}_${slot}`)
            ),
        })).filter((s) => s.timeSlots.length > 0)

        res.json({
            success: true,
            doctor: {
                ...formatDoctorCard(doctor, user),
                phone: user?.phone,
                email: user?.email,
                image: user?.image,
                clinics: (clinics || []).map((c) => ({
                    id: c.id,
                    clinicName: c.clinic_name,
                    address: c.address,
                    city: c.city,
                    availableDays: c.available_days,
                    startTime: c.start_time,
                    endTime: c.end_time,
                })),
                schedules: availableSchedules,
            },
        })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

export { listDoctors, getDoctorById }
