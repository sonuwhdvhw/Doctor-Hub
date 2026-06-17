# Doctor Hub

> **Local setup guide:** see [LOCAL_SETUP.md](LOCAL_SETUP.md)

Healthcare consultation & patient history platform (Patient, Doctor, Assistant, Admin, Super Admin).

## Quick Start

```bash
npm run install:all
cd backend && npm run check && npm run seed
# Terminal 1: cd backend && npm start
# Terminal 2: cd frontend && npm run dev
# Or double-click start-local.bat (Windows)
```

- App: http://localhost:5173
- API: http://localhost:5000

---

# CareLink - Doctor Appointment Web App (Legacy docs below)

CareLink is a full-stack web application that simplifies booking doctor appointments. It supports three roles: **Patient**, **Doctor**, and **Admin**, with Stripe payment integration and image uploads via Cloudinary.

## Tech Stack

- **Frontend**: React.js, Tailwind CSS, Vite
- **Admin Panel**: React.js, Tailwind CSS, Vite
- **Backend**: Node.js, Express.js
- **Database**: Supabase (PostgreSQL)
- **Storage**: Cloudinary (doctor/user images)
- **Payment**: Stripe Checkout
- **Auth**: JWT (jsonwebtoken) + bcrypt

## Project Structure

```
CareLink/
├── frontend/        # Patient-facing React app
├── admin/           # Admin & Doctor React app
└── backend/         # Express.js API server
```

## Features

### Patient
- Register / Login
- Browse and filter doctors by speciality
- Book appointment slots
- Pay online via Stripe Checkout
- View and cancel appointments
- Edit profile (name, phone, address, gender, DOB, photo)

### Doctor
- Login to doctor dashboard
- View appointments, earnings, patient count
- Mark appointments complete or cancel them
- Update profile (fees, address, about, availability)

### Admin
- Login with hardcoded credentials
- Add doctors (with Cloudinary image upload)
- View all doctors, toggle availability
- View all appointments, cancel any
- Dashboard with total doctors, patients, appointments

## Environment Variables

### `backend/.env`
```
SUPABASE_URL=
SUPABASE_KEY=
CLOUDINARY_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_SECRET_KEY=
JWT_SECRET=
ADMIN_EMAIL=
ADMIN_PASSWORD=
STRIPE_SECRET_KEY=
FRONTEND_URL=
CURRENCY=USD
PORT=5000
```

### `frontend/.env`
```
VITE_BACKEND_URL=
VITE_ADMIN_URL=
VITE_STRIPE_PUBLISHABLE_KEY=
```

### `admin/.env`
```
VITE_BACKEND_URL=
VITE_FRONTEND_URL=
VITE_CURRENCY=USD
```

## Database (Supabase)

Run `backend/supabase_schema.sql` in your Supabase SQL Editor to create the required tables:

- `users` — patient accounts
- `doctors` — doctor profiles with slots
- `appointments` — booking records with JSONB user/doc snapshots

## Running Locally

```bash
# Backend
cd backend
npm install
node server.js

# Frontend
cd frontend
npm install
npm run dev

# Admin
cd admin
npm install
npm run dev
```

## Deployment

All three apps are deployed separately on Vercel. The backend requires a `vercel.json` (included) and all environment variables must be set in the Vercel dashboard — `.env` files are not used in production.

Make sure `FRONTEND_URL` in the backend matches the deployed frontend URL for Stripe redirect to work correctly.
## Credentials For Login 
ADMIN_EMAIL="sonuch2288@gmail.com"
ADMIN_PASSWORD="Saqlainch@22"
DOCTOR_EMAIL="chsaqlain22@gmail.com"
DOCTOR_PASSWORD="Sonuch@22"








