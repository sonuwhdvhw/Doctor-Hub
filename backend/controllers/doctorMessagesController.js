import supabase from '../config/supabaseClient.js'

const getDoctorByUserId = async (userId) => {
    const { data } = await supabase
        .from('doctor_profiles')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle()
    return data
}

const getDoctorContacts = async (req, res) => {
    try {
        const doctor = await getDoctorByUserId(req.user.id)
        if (!doctor) return res.status(404).json({ success: false, message: 'Doctor profile not found' })

        const { data: appointments } = await supabase
            .from('doctor_appointments')
            .select('patient_id')
            .eq('doctor_id', doctor.id)
            .in('status', ['confirmed', 'completed'])

        const patientIds = [...new Set((appointments || []).map((a) => a.patient_id))]
        if (patientIds.length === 0) return res.json({ success: true, contacts: [] })

        const { data: users } = await supabase
            .from('users')
            .select('id, name, email')
            .in('id', patientIds)

        res.json({
            success: true,
            contacts: (users || []).map((u) => ({
                userId: u.id,
                name: u.name,
                email: u.email,
            })),
        })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

const getDoctorMessages = async (req, res) => {
    try {
        const { withUserId } = req.query
        const userId = req.user.id

        if (!withUserId) return res.status(400).json({ success: false, message: 'withUserId is required' })

        const { data: messages, error } = await supabase
            .from('messages')
            .select('*')
            .or(`and(sender_id.eq.${userId},receiver_id.eq.${withUserId}),and(sender_id.eq.${withUserId},receiver_id.eq.${userId})`)
            .order('created_at', { ascending: true })

        if (error) throw error

        await supabase
            .from('messages')
            .update({ is_read: true })
            .eq('sender_id', withUserId)
            .eq('receiver_id', userId)
            .eq('is_read', false)

        res.json({
            success: true,
            messages: (messages || []).map((m) => ({
                id: m.id,
                senderId: m.sender_id,
                receiverId: m.receiver_id,
                content: m.content,
                isRead: m.is_read,
                createdAt: m.created_at,
                isMine: m.sender_id === userId,
            })),
        })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

const sendDoctorMessage = async (req, res) => {
    try {
        const { receiverId, content } = req.body
        const senderId = req.user.id

        if (!receiverId || !content?.trim()) {
            return res.status(400).json({ success: false, message: 'receiverId and content are required' })
        }

        const { data: message, error } = await supabase
            .from('messages')
            .insert({ sender_id: senderId, receiver_id: receiverId, content: content.trim() })
            .select()
            .single()

        if (error) throw error

        res.status(201).json({
            success: true,
            message: {
                id: message.id,
                senderId: message.sender_id,
                receiverId: message.receiver_id,
                content: message.content,
                createdAt: message.created_at,
                isMine: true,
            },
        })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

export { getDoctorContacts, getDoctorMessages, sendDoctorMessage }
