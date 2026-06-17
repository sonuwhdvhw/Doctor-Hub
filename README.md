# Doctor Hub 🏥

A world-class healthcare platform connecting patients with verified doctors. Built with React, Node.js, Supabase, and deployed on Vercel.

## 🌐 Live URL

**https://doctor-hub-dusky.vercel.app/**

## 🔐 Credentials For Login

| Role | Email | Password |
|------|-------|----------|
| **Admin** | sonuch2288@gmail.com | Saqlainch@22 |
| **Doctor** | chsaqlain22@gmail.com | Sonuch@22 |

## 🛠️ Tech Stack

- **Frontend**: React.js, Tailwind CSS, Vite
- **Backend**: Node.js, Express.js
- **Database**: Supabase (PostgreSQL)
- **Storage**: Cloudinary
- **Payment**: Stripe
- **Auth**: JWT + bcrypt
- **Deploy**: Vercel

## 📁 Project Structure

```
CareLink/
├── frontend/     # Patient-facing React app (port 5173)
├── admin/        # Admin & Doctor panel (port 5174)
└── backend/      # Express.js API (port 5000)
```

## ✨ Features

### Patient Portal
- Register / Login
- Find & filter doctors by speciality
- Book appointment slots
- Pay online via Stripe
- View appointments & cancel
- AI Symptom Checker
- Medical history & prescriptions
- Secure messaging

### Doctor Portal
- Manage clinic & schedule
- View appointments & patients
- Write digital prescriptions
- Add medical records
- Manage assistants

### Admin Portal
- Analytics dashboard
- Manage doctors, patients, assistants
- View all appointments & payments
- Full platform oversight

## 🚀 Running Locally

```bash
# Backend
cd backend
npm install
npm run dev        # http://localhost:5000

# Frontend
cd frontend
npm install
npm run dev        # http://localhost:5173

# Admin
cd admin
npm install
npm run dev        # http://localhost:5174
```

## ⚙️ Environment Variables

### backend/.env
```
SUPABASE_URL=
SUPABASE_KEY=
SUPABASE_SERVICE_KEY=
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

### frontend/.env
```
VITE_BACKEND_URL=
VITE_STRIPE_PUBLISHABLE_KEY=
```

### admin/.env
```
VITE_BACKEND_URL=
VITE_CURRENCY=USD
```

## 🗄️ Database

Run `backend/supabase_schema.sql` in Supabase SQL Editor to create all required tables.

## 📸 Screenshots

### 🏠 Landing Page
![Landing Page](https://github.com/sonuwhdvhw/Doctor-Hub/assets/landing-page.png)

### 🔑 Login Portal
![Login Portal](https://github.com/sonuwhdvhw/Doctor-Hub/assets/login-portal.png)

### 📊 Admin Dashboard
![Admin Dashboard](https://github.com/sonuwhdvhw/Doctor-Hub/assets/admin-dashboard.png)

### 👤 Patient Dashboard
![Patient Dashboard](https://github.com/sonuwhdvhw/Doctor-Hub/assets/patient-dashboard.png)

### 🤖 AI Symptom Checker
![AI Symptom Checker](https://github.com/sonuwhdvhw/Doctor-Hub/assets/symptom-checker.png)
