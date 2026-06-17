import 'dotenv/config'
import supabase from '../config/supabaseClient.js'

const checks = []

let failedCount = 0

const ok = (msg) => { checks.push({ ok: true, msg }); console.log(`  OK   ${msg}`) }
const fail = (msg) => { checks.push({ ok: false, msg }); failedCount++; console.log(`  FAIL ${msg}`) }

console.log('Doctor Hub — Local readiness check\n')

if (process.env.SUPABASE_URL) ok('SUPABASE_URL set')
else fail('SUPABASE_URL missing in backend/.env')

if (process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_KEY) ok('Supabase key set')
else fail('SUPABASE_KEY or SUPABASE_SERVICE_KEY missing')

if (process.env.JWT_SECRET) ok('JWT_SECRET set')
else fail('JWT_SECRET missing')

if (process.env.FRONTEND_URL) ok(`FRONTEND_URL = ${process.env.FRONTEND_URL}`)
else fail('FRONTEND_URL missing (set to http://localhost:5173)')

try {
    const { error } = await supabase.from('users').select('id').limit(1)
    if (error) fail(`Database: ${error.message}`)
    else ok('Database connection')
} catch (e) {
    fail(`Database: ${e.message}`)
}

const tables = ['users', 'doctor_profiles', 'patients', 'doctor_appointments', 'payments', 'medical_history', 'prescriptions', 'assistants', 'clinics', 'patient_reports', 'messages']
for (const table of tables) {
    const { error } = await supabase.from(table).select('id').limit(1)
    if (error?.message?.includes('does not exist') || error?.code === '42P01') {
        fail(`Table missing: ${table}`)
    }
}

const failed = checks.filter((c) => !c.ok)
if (failed.length) {
    console.log(`\n${failed.length} issue(s) found.`)
    if (failed.some((f) => f.msg.includes('Table missing') || f.msg.includes('fetch failed'))) {
        console.log('\nFix: Open Supabase SQL Editor and run:')
        console.log('  1. backend/supabase_schema.sql')
        console.log('  2. backend/migrations/002_reports_messages.sql')
    }
}
else console.log('\nAll checks passed. Ready for local testing.')
process.exit(failed.length ? 1 : 0)
