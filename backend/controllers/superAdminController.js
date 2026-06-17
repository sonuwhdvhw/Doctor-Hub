import supabase from '../config/supabaseClient.js'

const listAdmins = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('users')
            .select('id, name, email, created_at')
            .eq('role', 'admin')
            .order('created_at', { ascending: false })

        if (error) throw error
        res.json({ success: true, admins: data || [] })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

const promoteToAdmin = async (req, res) => {
    try {
        const { email } = req.body

        if (!email) {
            return res.status(400).json({ success: false, message: 'Email is required' })
        }

        const { data: user, error } = await supabase
            .from('users')
            .select('id, name, email, role')
            .eq('email', email)
            .maybeSingle()

        if (error) throw error
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' })
        }

        if (user.role === 'superadmin') {
            return res.status(400).json({ success: false, message: 'Cannot modify super admin role' })
        }

        if (user.role === 'admin') {
            return res.status(400).json({ success: false, message: 'User is already an admin' })
        }

        const { error: updateErr } = await supabase
            .from('users')
            .update({ role: 'admin' })
            .eq('id', user.id)

        if (updateErr) throw updateErr

        res.json({
            success: true,
            message: `${user.name} promoted to admin`,
            admin: { id: user.id, name: user.name, email: user.email },
        })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

const demoteAdmin = async (req, res) => {
    try {
        const { id } = req.params

        const { data: user, error } = await supabase
            .from('users')
            .select('id, role')
            .eq('id', id)
            .maybeSingle()

        if (error) throw error
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' })
        }

        if (user.role !== 'admin') {
            return res.status(400).json({ success: false, message: 'User is not an admin' })
        }

        const { error: updateErr } = await supabase
            .from('users')
            .update({ role: 'patient' })
            .eq('id', id)

        if (updateErr) throw updateErr

        res.json({ success: true, message: 'Admin demoted to patient' })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params

        if (id === req.user.id) {
            return res.status(400).json({ success: false, message: 'Cannot delete your own account' })
        }

        const { data: user, error } = await supabase
            .from('users')
            .select('id, role, name')
            .eq('id', id)
            .maybeSingle()

        if (error) throw error
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' })
        }

        if (user.role === 'superadmin') {
            return res.status(403).json({ success: false, message: 'Cannot delete a super admin' })
        }

        // Preserve medical history — unlink patient reference
        await supabase
            .from('medical_history')
            .update({ patient_id: null })
            .eq('patient_id', id)

        await supabase
            .from('prescriptions')
            .update({ patient_id: null })
            .eq('patient_id', id)

        const { error: deleteErr } = await supabase
            .from('users')
            .delete()
            .eq('id', id)

        if (deleteErr) throw deleteErr

        res.json({
            success: true,
            message: `User ${user.name} deleted. Medical history records preserved.`,
        })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

const listAllUsers = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('users')
            .select('id, name, email, role, created_at')
            .neq('role', 'superadmin')
            .order('created_at', { ascending: false })

        if (error) throw error
        res.json({ success: true, users: data || [] })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

export { listAdmins, promoteToAdmin, demoteAdmin, deleteUser, listAllUsers }
