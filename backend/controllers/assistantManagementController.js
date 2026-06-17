import path from 'path'
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

const listAssistants = async (req, res) => {
    try {
        const doctor = await getDoctorByUserId(req.user.id)
        if (!doctor) return res.status(404).json({ success: false, message: 'Doctor profile not found' })

        const { data: assistants, error } = await supabase
            .from('assistants')
            .select('*')
            .eq('doctor_id', doctor.id)

        if (error) throw error

        const userIds = (assistants || []).map((a) => a.user_id)
        let usersMap = {}
        if (userIds.length > 0) {
            const { data: users } = await supabase
                .from('users')
                .select('id, name, email')
                .in('id', userIds)
            usersMap = Object.fromEntries((users || []).map((u) => [u.id, u]))
        }

        res.json({
            success: true,
            assistants: (assistants || []).map((a) => ({
                id: a.id,
                userId: a.user_id,
                name: usersMap[a.user_id]?.name,
                email: usersMap[a.user_id]?.email,
            })),
        })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

const assignAssistant = async (req, res) => {
    try {
        const { email } = req.body
        if (!email) return res.status(400).json({ success: false, message: 'Assistant email is required' })

        const doctor = await getDoctorByUserId(req.user.id)
        if (!doctor) return res.status(404).json({ success: false, message: 'Doctor profile not found' })

        const { data: assistantUser } = await supabase
            .from('users')
            .select('id, name, email, role')
            .eq('email', email)
            .maybeSingle()

        if (!assistantUser) {
            return res.status(404).json({ success: false, message: 'No user found with this email' })
        }
        if (assistantUser.role !== 'assistant') {
            return res.status(400).json({ success: false, message: 'User is not registered as an assistant' })
        }

        const { data: assistantRow } = await supabase
            .from('assistants')
            .select('*')
            .eq('user_id', assistantUser.id)
            .maybeSingle()

        if (!assistantRow) {
            return res.status(404).json({ success: false, message: 'Assistant profile not found' })
        }

        if (assistantRow.doctor_id && assistantRow.doctor_id !== doctor.id) {
            return res.status(409).json({ success: false, message: 'Assistant is already assigned to another doctor' })
        }

        const { error } = await supabase
            .from('assistants')
            .update({ doctor_id: doctor.id })
            .eq('user_id', assistantUser.id)

        if (error) throw error

        res.json({
            success: true,
            message: `${assistantUser.name} assigned as your assistant`,
            assistant: { id: assistantRow.id, userId: assistantUser.id, name: assistantUser.name, email: assistantUser.email },
        })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

const removeAssistant = async (req, res) => {
    try {
        const { id } = req.params
        const doctor = await getDoctorByUserId(req.user.id)
        if (!doctor) return res.status(404).json({ success: false, message: 'Doctor profile not found' })

        const { data: assistant } = await supabase
            .from('assistants')
            .select('*')
            .eq('id', id)
            .eq('doctor_id', doctor.id)
            .maybeSingle()

        if (!assistant) return res.status(404).json({ success: false, message: 'Assistant not found' })

        const { error } = await supabase
            .from('assistants')
            .update({ doctor_id: null })
            .eq('id', id)

        if (error) throw error

        res.json({ success: true, message: 'Assistant removed' })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

export { listAssistants, assignAssistant, removeAssistant }
