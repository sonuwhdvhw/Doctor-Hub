import bcrypt from 'bcrypt'
import 'dotenv/config'
import supabase from '../config/supabaseClient.js'

const TEST_USERS = [
    { name: 'Test Patient', email: 'patient@test.com', password: 'password123', role: 'patient' },
    { name: 'Test Doctor', email: 'doctor@test.com', password: 'password123', role: 'doctor' },
    { name: 'Test Assistant', email: 'assistant@test.com', password: 'password123', role: 'assistant' },
]

const getEnvAdminUsers = () => {
    const accounts = [
        {
            name: 'Admin',
            email: process.env.ADMIN_EMAIL,
            password: process.env.ADMIN_PASSWORD,
            role: 'admin',
        },
        {
            name: 'Super Admin',
            email: process.env.SUPER_ADMIN_EMAIL,
            password: process.env.SUPER_ADMIN_PASSWORD,
            role: 'superadmin',
        },
    ].filter((account) => account.email && account.password)

    return accounts
}

const createRoleProfile = async (userId, role) => {
    if (role === 'doctor') {
        const { data: existing } = await supabase.from('doctor_profiles').select('id').eq('user_id', userId).maybeSingle()
        if (!existing) {
            await supabase.from('doctor_profiles').insert({
                user_id: userId,
                specialization: 'General Physician',
                treatment_type: 'allopathic',
                experience: 5,
                fee: 50,
                bio: 'Test doctor profile for local development',
                is_verified: true,
            })
        }
    } else if (role === 'patient') {
        const { data: existing } = await supabase.from('patients').select('id').eq('user_id', userId).maybeSingle()
        if (!existing) await supabase.from('patients').insert({ user_id: userId })
    } else if (role === 'assistant') {
        const { data: existing } = await supabase.from('assistants').select('id').eq('user_id', userId).maybeSingle()
        if (!existing) await supabase.from('assistants').insert({ user_id: userId })
    }
}

const linkAssistantToDoctor = async () => {
    const { data: doctorUser } = await supabase.from('users').select('id').eq('email', 'doctor@test.com').maybeSingle()
    const { data: assistantUser } = await supabase.from('users').select('id').eq('email', 'assistant@test.com').maybeSingle()
    if (!doctorUser || !assistantUser) return

    const { data: doctorProfile } = await supabase.from('doctor_profiles').select('id').eq('user_id', doctorUser.id).maybeSingle()
    if (!doctorProfile) return

    await supabase.from('assistants').update({ doctor_id: doctorProfile.id }).eq('user_id', assistantUser.id)
    console.log('  Linked assistant@test.com → doctor@test.com')
}

const seed = async () => {
    console.log('Seeding local test accounts...\n')
    let failCount = 0
    const usersToSeed = [...TEST_USERS, ...getEnvAdminUsers()]

    for (const u of usersToSeed) {
        const { data: existing } = await supabase.from('users').select('id').eq('email', u.email).maybeSingle()

        if (existing) {
            console.log(`  skip  ${u.email} (already exists)`)
            await createRoleProfile(existing.id, u.role)
            continue
        }

        const hashed = await bcrypt.hash(u.password, 10)
        const { data: user, error } = await supabase
            .from('users')
            .insert({ name: u.name, email: u.email, password: hashed, role: u.role })
            .select('id')
            .single()

        if (error) {
            console.error(`  FAIL  ${u.email}: ${error.message}`)
            failCount++
            continue
        }

        await createRoleProfile(user.id, u.role)
        console.log(`  created ${u.email} (${u.role})`)
    }

    await linkAssistantToDoctor()

    console.log('\nSeeded accounts:')
    usersToSeed.forEach((u) => console.log(`  ${u.role.padEnd(12)} ${u.email}`))
    console.log('\nAdmin/Super Admin use passwords from backend/.env')

    if (failCount > 0) {
        console.error(`\n${failCount} account(s) failed. Run supabase_schema.sql first, or register via http://localhost:5173/register`)
        process.exit(1)
    }
    console.log('\nDone.')
}

seed().catch((err) => {
    console.error('Seed failed:', err.message)
    console.error('Tip: Run backend/supabase_schema.sql in Supabase SQL Editor first.')
    process.exit(1)
})
