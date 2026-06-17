import path from 'path'
import supabase from '../config/supabaseClient.js'
import { uploadFileToCloudinary } from '../utils/cloudinaryUpload.js'

const uploadReport = async (req, res) => {
    try {
        const { title, notes } = req.body
        const patientId = req.user.id
        const file = req.file

        if (!file) return res.status(400).json({ success: false, message: 'Report file is required' })
        if (!title) return res.status(400).json({ success: false, message: 'Report title is required' })

        const ext = path.extname(file.originalname).toLowerCase()
        const fileType = ext === '.pdf' ? 'pdf' : 'image'
        const fileUrl = await uploadFileToCloudinary(file, 'carelink/reports')

        const { data: report, error } = await supabase
            .from('patient_reports')
            .insert({
                patient_id: patientId,
                title,
                file_url: fileUrl,
                file_type: fileType,
                notes: notes || '',
            })
            .select()
            .single()

        if (error) throw error

        res.status(201).json({
            success: true,
            message: 'Report uploaded successfully',
            report: {
                id: report.id,
                title: report.title,
                fileUrl: report.file_url,
                fileType: report.file_type,
                notes: report.notes,
                createdAt: report.created_at,
            },
        })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

const listReports = async (req, res) => {
    try {
        const { data: reports, error } = await supabase
            .from('patient_reports')
            .select('*')
            .eq('patient_id', req.user.id)
            .order('created_at', { ascending: false })

        if (error) throw error

        res.json({
            success: true,
            reports: (reports || []).map((r) => ({
                id: r.id,
                title: r.title,
                fileUrl: r.file_url,
                fileType: r.file_type,
                notes: r.notes,
                createdAt: r.created_at,
            })),
        })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

const getContacts = async (req, res) => {
    try {
        const patientId = req.user.id

        const { data: appointments } = await supabase
            .from('doctor_appointments')
            .select('doctor_id')
            .eq('patient_id', patientId)
            .in('status', ['confirmed', 'completed'])

        const doctorIds = [...new Set((appointments || []).map((a) => a.doctor_id))]
        if (doctorIds.length === 0) {
            return res.json({ success: true, contacts: [] })
        }

        const { data: doctors } = await supabase
            .from('doctor_profiles')
            .select('id, specialization, user_id')
            .in('id', doctorIds)

        const userIds = (doctors || []).map((d) => d.user_id)
        const { data: users } = await supabase
            .from('users')
            .select('id, name, email')
            .in('id', userIds)

        const usersMap = Object.fromEntries((users || []).map((u) => [u.id, u]))

        res.json({
            success: true,
            contacts: (doctors || []).map((d) => ({
                doctorProfileId: d.id,
                userId: d.user_id,
                name: usersMap[d.user_id]?.name,
                specialization: d.specialization,
            })),
        })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

const getMessages = async (req, res) => {
    try {
        const { withUserId } = req.query
        const userId = req.user.id

        if (!withUserId) {
            return res.status(400).json({ success: false, message: 'withUserId is required' })
        }

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

const sendMessage = async (req, res) => {
    try {
        const { receiverId, content } = req.body
        const senderId = req.user.id

        if (!receiverId || !content?.trim()) {
            return res.status(400).json({ success: false, message: 'receiverId and content are required' })
        }

        const { data: message, error } = await supabase
            .from('messages')
            .insert({
                sender_id: senderId,
                receiver_id: receiverId,
                content: content.trim(),
            })
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

export { uploadReport, listReports, getContacts, getMessages, sendMessage }
