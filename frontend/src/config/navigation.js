import {
  LayoutDashboard, User, Building2, Calendar, CalendarClock, Users,
  Pill, CreditCard, ClipboardList, BookOpen, Shield, Trash2,
  Stethoscope, Search, History, FileText, Brain, MessageCircle, UserPlus,
} from 'lucide-react'

export const portalConfig = {
  patient: {
    name: 'Patient Portal',
    subtitle: 'Your health journey',
    links: [
      { to: '/patient/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { to: '/patient/symptom-checker', label: 'AI Symptom Checker', icon: Brain },
      { to: '/patient/find-doctor', label: 'Find Doctor', icon: Search },
      { to: '/patient/appointments', label: 'Appointments', icon: Calendar },
      { to: '/patient/history', label: 'Medical History', icon: History },
      { to: '/patient/reports', label: 'Medical Reports', icon: FileText },
      { to: '/patient/prescriptions', label: 'Prescriptions', icon: Pill },
      { to: '/patient/messages', label: 'Messages', icon: MessageCircle },
      { to: '/patient/profile', label: 'Profile', icon: User },
    ],
  },
  doctor: {
    name: 'Doctor Hub',
    subtitle: 'Practice management',
    links: [
      { to: '/doctor/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { to: '/doctor/profile', label: 'My Profile', icon: User },
      { to: '/doctor/clinics', label: 'Clinics', icon: Building2 },
      { to: '/doctor/schedule', label: 'Schedule', icon: CalendarClock },
      { to: '/doctor/appointments', label: 'Appointments', icon: Calendar },
      { to: '/doctor/patients', label: 'Patients', icon: Users },
      { to: '/doctor/assistants', label: 'Assistants', icon: UserPlus },
      { to: '/doctor/messages', label: 'Messages', icon: MessageCircle },
      { to: '/doctor/prescriptions', label: 'Prescriptions', icon: Pill },
    ],
  },
  assistant: {
    name: 'Assistant Portal',
    subtitle: 'Clinic operations',
    links: [
      { to: '/assistant/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { to: '/assistant/pending-payments', label: 'Pending Payments', icon: CreditCard },
      { to: '/assistant/appointments', label: 'Appointments', icon: Calendar },
      { to: '/assistant/bookings', label: 'Bookings', icon: BookOpen },
    ],
  },
  admin: {
    name: 'Admin Panel',
    subtitle: 'System management',
    links: [
      { to: '/admin/dashboard', label: 'Analytics', icon: LayoutDashboard },
      { to: '/admin/doctors', label: 'Doctors', icon: Stethoscope },
      { to: '/admin/assistants', label: 'Assistants', icon: UserPlus },
      { to: '/admin/patients', label: 'Patients', icon: Users },
      { to: '/admin/appointments', label: 'Appointments', icon: Calendar },
      { to: '/admin/payments', label: 'Payments', icon: CreditCard },
    ],
  },
  superadmin: {
    name: 'Super Admin',
    subtitle: 'Full system control',
    links: [
      { to: '/admin/dashboard', label: 'Analytics', icon: LayoutDashboard },
      { to: '/admin/doctors', label: 'Doctors', icon: Stethoscope },
      { to: '/admin/assistants', label: 'Assistants', icon: UserPlus },
      { to: '/admin/patients', label: 'Patients', icon: Users },
      { to: '/admin/appointments', label: 'Appointments', icon: Calendar },
      { to: '/admin/payments', label: 'Payments', icon: CreditCard },
      { to: '/admin/admins', label: 'Manage Admins', icon: Shield },
      { to: '/admin/users', label: 'Delete Users', icon: Trash2 },
    ],
  },
}

export const getPortalConfig = (role) => {
  if (role === 'superadmin') return portalConfig.superadmin
  return portalConfig[role] || portalConfig.patient
}
