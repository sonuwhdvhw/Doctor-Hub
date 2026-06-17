import supabase from '../config/supabaseClient.js'

const bookAppointment = async (req, res) => {
    try {
        const { doctorId, clinicId, date, timeSlot } = req.body
        const patientId = req.user.id

        if (!doctorId || !clinicId || !date || !timeSlot) {
            return res.status(400).json({
                success: false,
                message: 'doctorId, clinicId, date and timeSlot are required',
            })
        }

        const { data: doctor, error: docErr } = await supabase
            .from('doctor_profiles')
            .select('id, fee, is_verified')
            .eq('id', doctorId)
            .eq('is_verified', true)
            .maybeSingle()

        if (docErr || !doctor) {
            return res.status(404).json({ success: false, message: 'Doctor not found or not verified' })
        }

        const { data: clinic, error: clinicErr } = await supabase
            .from('clinics')
            .select('id')
            .eq('id', clinicId)
            .eq('doctor_id', doctorId)
            .maybeSingle()

        if (clinicErr || !clinic) {
            return res.status(400).json({ success: false, message: 'Invalid clinic for this doctor' })
        }

        const { data: schedule } = await supabase
            .from('doctor_schedules')
            .select('time_slots, is_available')
            .eq('doctor_id', doctorId)
            .eq('date', date)
            .maybeSingle()

        if (!schedule?.is_available || !(schedule.time_slots || []).includes(timeSlot)) {
            return res.status(400).json({ success: false, message: 'Time slot not available' })
        }

        const { data: existing } = await supabase
            .from('doctor_appointments')
            .select('id')
            .eq('doctor_id', doctorId)
            .eq('appointment_date', date)
            .eq('appointment_time', timeSlot)
            .neq('status', 'cancelled')
            .maybeSingle()

        if (existing) {
            return res.status(409).json({ success: false, message: 'Slot already booked' })
        }

        const { data: appointment, error } = await supabase
            .from('doctor_appointments')
            .insert({
                patient_id: patientId,
                doctor_id: doctorId,
                clinic_id: clinicId,
                appointment_date: date,
                appointment_time: timeSlot,
                status: 'pending',
                payment_status: 'pending',
                amount: doctor.fee || 0,
            })
            .select()
            .single()

        if (error) throw error

        res.status(201).json({
            success: true,
            message: 'Appointment booked successfully',
            appointment: {
                id: appointment.id,
                patientId: appointment.patient_id,
                doctorId: appointment.doctor_id,
                clinicId: appointment.clinic_id,
                date: appointment.appointment_date,
                timeSlot: appointment.appointment_time,
                status: appointment.status,
                amount: appointment.amount,
                createdAt: appointment.created_at,
            },
        })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

export { bookAppointment }
