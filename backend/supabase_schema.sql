-- Doctor Hub — Supabase schema
-- Run this in your Supabase SQL Editor

-- ─── Users ───────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'patient' CHECK (role IN ('patient', 'doctor', 'assistant', 'admin', 'superadmin')),
    image TEXT,
    phone TEXT DEFAULT '000000000',
    address JSONB DEFAULT '{"line1": "", "line2": ""}',
    gender TEXT DEFAULT 'Not Selected',
    dob TEXT DEFAULT 'Not Selected',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE users ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'patient';

-- ─── Doctor Hub: doctors table (user-linked profiles) ──────────────────────
-- Stored as doctor_profiles to avoid conflict with legacy doctors table
CREATE TABLE IF NOT EXISTS doctor_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    specialization TEXT,
    treatment_type TEXT CHECK (treatment_type IN ('allopathic', 'homeopathic', 'herbal')),
    experience INTEGER DEFAULT 0,
    fee NUMERIC(10, 2) DEFAULT 0,
    bio TEXT,
    is_verified BOOLEAN DEFAULT FALSE
);

ALTER TABLE doctor_profiles ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE;

CREATE TABLE IF NOT EXISTS patients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    age INTEGER,
    blood_group TEXT,
    medical_notes TEXT
);

CREATE TABLE IF NOT EXISTS assistants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    doctor_id UUID REFERENCES doctor_profiles(id) ON DELETE SET NULL
);

-- ─── Clinics (Doctor Hub) ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS clinics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    doctor_id UUID NOT NULL REFERENCES doctor_profiles(id) ON DELETE CASCADE,
    clinic_name TEXT,
    address TEXT,
    city TEXT,
    available_days JSONB DEFAULT '[]',
    start_time TEXT DEFAULT '09:00',
    end_time TEXT DEFAULT '17:00',
    timings TEXT
);

ALTER TABLE clinics ADD COLUMN IF NOT EXISTS clinic_name TEXT;
ALTER TABLE clinics ADD COLUMN IF NOT EXISTS available_days JSONB DEFAULT '[]';
ALTER TABLE clinics ADD COLUMN IF NOT EXISTS start_time TEXT DEFAULT '09:00';
ALTER TABLE clinics ADD COLUMN IF NOT EXISTS end_time TEXT DEFAULT '17:00';

-- ─── Doctor Schedules ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS doctor_schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    doctor_id UUID NOT NULL REFERENCES doctor_profiles(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    time_slots JSONB DEFAULT '[]',
    is_available BOOLEAN DEFAULT TRUE,
    UNIQUE(doctor_id, date)
);

ALTER TABLE doctor_profiles ADD COLUMN IF NOT EXISTS rating NUMERIC(2, 1) DEFAULT 4.5;

-- ─── Doctor Hub Appointments (prompt: appointments table) ────────────────────
CREATE TABLE IF NOT EXISTS doctor_appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    doctor_id UUID NOT NULL REFERENCES doctor_profiles(id) ON DELETE CASCADE,
    clinic_id UUID REFERENCES clinics(id) ON DELETE SET NULL,
    appointment_date DATE NOT NULL,
    appointment_time TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
    payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid')),
    amount NUMERIC(10, 2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Payments ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    appointment_id UUID NOT NULL REFERENCES doctor_appointments(id) ON DELETE CASCADE,
    patient_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    amount NUMERIC(10, 2) NOT NULL,
    screenshot_url TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'rejected')),
    verified_by UUID REFERENCES users(id) ON DELETE SET NULL,
    rejection_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE payments ADD COLUMN IF NOT EXISTS rejection_reason TEXT;

-- Medical history: patient_id nullable so records survive user deletion
CREATE TABLE IF NOT EXISTS medical_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES users(id) ON DELETE SET NULL,
    doctor_id UUID NOT NULL REFERENCES doctor_profiles(id) ON DELETE CASCADE,
    appointment_id UUID REFERENCES doctor_appointments(id) ON DELETE SET NULL,
    visit_date DATE NOT NULL,
    symptoms TEXT,
    diagnosis TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE medical_history ADD COLUMN IF NOT EXISTS appointment_id UUID REFERENCES doctor_appointments(id) ON DELETE SET NULL;

-- ─── Prescriptions (immutable after creation — no UPDATE via app) ────────────
CREATE TABLE IF NOT EXISTS prescriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    medical_history_id UUID REFERENCES medical_history(id) ON DELETE CASCADE,
    doctor_id UUID NOT NULL REFERENCES doctor_profiles(id) ON DELETE CASCADE,
    patient_id UUID REFERENCES users(id) ON DELETE SET NULL,
    appointment_id UUID REFERENCES doctor_appointments(id) ON DELETE SET NULL,
    medicines JSONB DEFAULT '[]',
    instructions TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE prescriptions ADD COLUMN IF NOT EXISTS appointment_id UUID REFERENCES doctor_appointments(id) ON DELETE SET NULL;

-- ─── Patient Reports & Messaging ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS patient_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    file_url TEXT NOT NULL,
    file_type TEXT DEFAULT 'image',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    receiver_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    appointment_id UUID REFERENCES doctor_appointments(id) ON DELETE SET NULL,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Legacy CareLink tables ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS doctors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    image TEXT NOT NULL,
    speciality TEXT NOT NULL,
    degree TEXT NOT NULL,
    experience TEXT NOT NULL,
    about TEXT NOT NULL,
    available BOOLEAN DEFAULT TRUE,
    fees NUMERIC NOT NULL,
    slots_booked JSONB DEFAULT '{}',
    address JSONB NOT NULL,
    date BIGINT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    doc_id UUID NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
    slot_date TEXT NOT NULL,
    slot_time TEXT NOT NULL,
    user_data JSONB NOT NULL,
    doc_data JSONB NOT NULL,
    amount NUMERIC NOT NULL,
    date BIGINT NOT NULL,
    cancelled BOOLEAN DEFAULT FALSE,
    payment BOOLEAN DEFAULT FALSE,
    is_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
