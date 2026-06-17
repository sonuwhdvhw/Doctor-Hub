# Doctor Hub — Local Setup

Healthcare platform with Patient, Doctor, Assistant, Admin, and Super Admin portals.

## Prerequisites

- Node.js 18+
- Supabase project (URL + service role key in `backend/.env`)

## 1. Database Setup (one time)

In [Supabase SQL Editor](https://supabase.com/dashboard), run this **one file** (includes all tables, indexes, and features):

**`backend/doctor_hub_complete.sql`**

> Legacy: you can still use `supabase_schema.sql` + `migrations/002_reports_messages.sql` separately if needed.

## 2. Environment Variables

### `backend/.env` (required)

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-jwt
JWT_SECRET=your-secret
PORT=5000
BACKEND_URL=http://localhost:5000
FRONTEND_URL=http://localhost:5173
CLOUDINARY_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_SECRET_KEY=your-api-secret
```

Cloudinary stores **payment screenshots** (`carelink/payments`) and **medical reports** (`carelink/reports`).

### `frontend/.env` (required)

```
VITE_BACKEND_URL=http://localhost:5000
```

## 3. Install & Verify

```bash
# From project root
npm run install:all
cd backend && npm run check
```

If check passes, seed test accounts:

```bash
npm run seed
```

## 4. Run Locally

**Option A — double-click:** `start-local.bat` (Windows)

**Option B — two terminals:**

```bash
# Terminal 1 — API
cd backend
npm start

# Terminal 2 — Frontend
cd frontend
npm run dev
```

- API: http://localhost:5000
- App: http://localhost:5173
- Health: http://localhost:5000/health
- DB check: http://localhost:5000/health/db

## 5. Test Login Accounts

After `npm run seed`:

| Role | Email | Password |
|------|-------|----------|
| Patient | patient@test.com | password123 |
| Doctor | doctor@test.com | password123 |
| Assistant | assistant@test.com | password123 |
| Admin | `ADMIN_EMAIL` in `backend/.env` | `ADMIN_PASSWORD` in `backend/.env` |
| Super Admin | `SUPER_ADMIN_EMAIL` in `backend/.env` | `SUPER_ADMIN_PASSWORD` in `backend/.env` |

Assistant is pre-linked to the test doctor.

## 6. Quick Test Flow

1. Login as **patient@test.com** → AI Symptom Checker → Find Doctor → Book appointment
2. Upload payment screenshot on booking step 4
3. Login as **assistant@test.com** → Pending Payments → Verify
4. Login as **doctor@test.com** → Appointments → Add medical record + prescription
5. Back as patient → Download prescription PDF

## Project Structure

```
CareLink/
├── backend/     # Express API (port 5000)
├── frontend/    # React app — all roles (port 5173)
└── admin/       # Legacy app (not needed for Doctor Hub)
```

Use **frontend only** — all admin/doctor/patient/assistant portals are inside `frontend/`.

## Troubleshooting

| Problem | Fix |
|---------|-----|
| CORS error | Set `FRONTEND_URL=http://localhost:5173` in backend `.env` |
| API not reachable | Set `VITE_BACKEND_URL=http://localhost:5000` in frontend `.env`, restart Vite |
| Assistant has no data | Doctor must assign assistant at `/doctor/assistants`, or run `npm run seed` |
| Table does not exist | Run SQL files in Supabase (step 1) |
| Rate limit on login | Wait 15 min or restart backend (10 attempts / 15 min) |
