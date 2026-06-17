import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import validator from 'validator'
import supabase from '../config/supabaseClient.js'

const VALID_ROLES = ['patient', 'doctor', 'assistant', 'admin', 'superadmin']
const PUBLIC_REGISTER_ROLES = ['patient', 'doctor']

const DEFAULT_IMAGE = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPAAAADwCAYAAAA+VemSAAAACXBIWXMAABCcAAAQnAEmzTo0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAADASURBVHgB7cExAQAAAMKg9U9tCy+gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAeAMBuAABHgAAAABJRU5ErkJggg=='

const createToken = (user) => {
    return jwt.sign(
        { id: user.id, role: user.role, name: user.name, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    )
}

const createRoleProfile = async (userId, role) => {
    if (role === 'doctor') {
        const { error } = await supabase.from('doctor_profiles').insert({ user_id: userId })
        if (error) throw error
    } else if (role === 'patient') {
        const { error } = await supabase.from('patients').insert({ user_id: userId })
        if (error) throw error
    } else if (role === 'assistant') {
        const { error } = await supabase.from('assistants').insert({ user_id: userId })
        if (error) throw error
    }
}

const getEnvAdminAccounts = () => [
    {
        email: process.env.ADMIN_EMAIL?.trim(),
        password: process.env.ADMIN_PASSWORD,
        role: 'admin',
        name: 'Admin',
    },
    {
        email: process.env.SUPER_ADMIN_EMAIL?.trim(),
        password: process.env.SUPER_ADMIN_PASSWORD,
        role: 'superadmin',
        name: 'Super Admin',
    },
].filter((account) => account.email && account.password)

const normalizeEmail = (value) => value?.trim().toLowerCase()

const resolveEnvAdminUser = async (email, password) => {
    const normalizedEmail = normalizeEmail(email)
    const account = getEnvAdminAccounts().find(
        (entry) => normalizeEmail(entry.email) === normalizedEmail && entry.password === password
    )
    if (!account) return null

    const { data: existing } = await supabase
        .from('users')
        .select('id, name, email, role')
        .eq('email', account.email)
        .maybeSingle()

    if (existing) {
        if (existing.role !== account.role) {
            const { data: updated, error } = await supabase
                .from('users')
                .update({ role: account.role })
                .eq('id', existing.id)
                .select('id, name, email, role')
                .single()
            if (error) throw error
            return updated
        }
        return existing
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const { data: user, error } = await supabase
        .from('users')
        .insert({
            name: account.name,
            email: account.email,
            password: hashedPassword,
            role: account.role,
            image: DEFAULT_IMAGE,
            phone: '000000000',
            address: { line1: '', line2: '' },
            gender: 'Not Selected',
            dob: 'Not Selected',
        })
        .select('id, name, email, role')
        .single()

    if (error) throw error
    return user
}

const register = async (req, res) => {
    try {
        const { name, email, password, role = 'patient' } = req.body

        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: 'Name, email and password are required' })
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: 'Please enter a valid email' })
        }

        if (password.length < 8) {
            return res.status(400).json({ success: false, message: 'Password must be at least 8 characters' })
        }

        if (!VALID_ROLES.includes(role)) {
            return res.status(400).json({ success: false, message: 'Invalid role selected' })
        }

        if (!PUBLIC_REGISTER_ROLES.includes(role)) {
            return res.status(403).json({
                success: false,
                message: 'Assistant, Admin and Super Admin accounts must be created by system administrators',
            })
        }

        const { data: existingUser } = await supabase
            .from('users')
            .select('id')
            .eq('email', email)
            .maybeSingle()

        if (existingUser) {
            return res.status(409).json({ success: false, message: 'Email already registered' })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const { data: user, error } = await supabase
            .from('users')
            .insert({
                name,
                email,
                password: hashedPassword,
                role,
                image: DEFAULT_IMAGE,
                phone: '000000000',
                address: { line1: '', line2: '' },
                gender: 'Not Selected',
                dob: 'Not Selected',
            })
            .select('id, name, email, role')
            .single()

        if (error) throw error

        await createRoleProfile(user.id, role)

        const token = createToken(user)

        res.status(201).json({
            success: true,
            message: 'Registration successful',
            token,
            user: { id: user.id, name: user.name, email: user.email, role: user.role },
        })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email and password are required' })
        }

        const envAdminUser = await resolveEnvAdminUser(email, password)
        if (envAdminUser) {
            const token = createToken(envAdminUser)
            return res.json({
                success: true,
                message: 'Login successful',
                token,
                user: {
                    id: envAdminUser.id,
                    name: envAdminUser.name,
                    email: envAdminUser.email,
                    role: envAdminUser.role,
                },
            })
        }

        const { data: user, error } = await supabase
            .from('users')
            .select('id, name, email, password, role')
            .eq('email', email)
            .maybeSingle()

        if (error || !user) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' })
        }

        const token = createToken(user)

        res.json({
            success: true,
            message: 'Login successful',
            token,
            user: { id: user.id, name: user.name, email: user.email, role: user.role },
        })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body

        if (!email) {
            return res.status(400).json({ success: false, message: 'Email is required' })
        }

        const { data: user } = await supabase
            .from('users')
            .select('id')
            .eq('email', email)
            .maybeSingle()

        const resetToken = jwt.sign(
            { id: user.id, purpose: 'password_reset' },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        )

        const resetLink = user
            ? `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`
            : null

        if (user) {
            console.log(`[Mock] Password reset link for ${email}: ${resetLink}`)
        }

        res.json({
            success: true,
            message: 'If an account exists with this email, a password reset link has been sent.',
            resetLink,
        })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

const resetPassword = async (req, res) => {
    try {
        const { token, password } = req.body

        if (!token || !password) {
            return res.status(400).json({ success: false, message: 'Token and new password are required' })
        }

        if (password.length < 8) {
            return res.status(400).json({ success: false, message: 'Password must be at least 8 characters' })
        }

        let decoded
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET)
        } catch {
            return res.status(400).json({ success: false, message: 'Invalid or expired reset link' })
        }

        if (decoded.purpose !== 'password_reset') {
            return res.status(400).json({ success: false, message: 'Invalid reset token' })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const { error } = await supabase
            .from('users')
            .update({ password: hashedPassword })
            .eq('id', decoded.id)

        if (error) throw error

        res.json({ success: true, message: 'Password reset successful. You can now sign in.' })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

export { register, login, forgotPassword, resetPassword }
