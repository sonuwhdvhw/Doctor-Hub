import { Navigate, Route, Routes } from 'react-router-dom'
import PublicLayout from './layouts/PublicLayout'
import DashboardLayout from './layouts/DashboardLayout'
import ProtectedRoute from './components/ProtectedRoute'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import Login from './pages/Login'
import PatientLogin from './pages/login/PatientLogin'
import StaffLogin from './pages/login/StaffLogin'
import AdminLogin from './pages/login/AdminLogin'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import NotFound from './pages/NotFound'
import Unauthorized from './pages/Unauthorized'

import PatientHome from './pages/patient/PatientHome'
import FindDoctor from './pages/patient/FindDoctor'
import DoctorDetail from './pages/patient/DoctorDetail'
import BookAppointment from './pages/patient/BookAppointment'
import PatientAppointments from './pages/patient/Appointments'
import MedicalHistory from './pages/patient/MedicalHistory'
import PatientPrescriptions from './pages/patient/Prescriptions'
import PatientProfile from './pages/patient/Profile'
import SymptomChecker from './pages/patient/SymptomChecker'
import MedicalReports from './pages/patient/MedicalReports'
import PatientMessages from './pages/patient/Messages'

import DoctorHome from './pages/doctor/DoctorHome'
import DoctorProfile from './pages/doctor/Profile'
import DoctorClinics from './pages/doctor/Clinics'
import DoctorSchedule from './pages/doctor/Schedule'
import DoctorAppointments from './pages/doctor/Appointments'
import DoctorPatients from './pages/doctor/Patients'
import DoctorPrescriptions from './pages/doctor/Prescriptions'
import AppointmentDetail from './pages/doctor/AppointmentDetail'
import AddMedicalRecord from './pages/doctor/AddMedicalRecord'
import AddPrescription from './pages/doctor/AddPrescription'
import PatientHistory from './pages/doctor/PatientHistory'
import DoctorAssistants from './pages/doctor/Assistants'
import DoctorMessages from './pages/doctor/Messages'

import AssistantHome from './pages/assistant/AssistantHome'
import PendingPayments from './pages/assistant/PendingPayments'
import AssistantAppointments from './pages/assistant/Appointments'
import AssistantBookings from './pages/assistant/Bookings'

import AdminHome from './pages/admin/AdminHome'
import AdminDoctors from './pages/admin/Doctors'
import AdminAssistants from './pages/admin/Assistants'
import AdminPatients from './pages/admin/Patients'
import AdminAppointments from './pages/admin/Appointments'
import AdminPayments from './pages/admin/Payments'
import ManageAdmins from './pages/admin/ManageAdmins'
import DeleteUsers from './pages/admin/DeleteUsers'

const LegacyRedirect = ({ to }) => <Navigate to={to} replace />

const App = () => (
  <>
    <ToastContainer position='top-right' autoClose={3000} theme='light' />
    <Routes>
      {/* Dashboard portals — separate shell, no public navbar */}
      <Route path='/patient' element={<ProtectedRoute allowedRoles={['patient']}><DashboardLayout /></ProtectedRoute>}>
        <Route path='dashboard' element={<PatientHome />} />
        <Route path='symptom-checker' element={<SymptomChecker />} />
        <Route path='find-doctor' element={<FindDoctor />} />
        <Route path='doctors/:id' element={<DoctorDetail />} />
        <Route path='book/:doctorId' element={<BookAppointment />} />
        <Route path='appointments' element={<PatientAppointments />} />
        <Route path='history' element={<MedicalHistory />} />
        <Route path='reports' element={<MedicalReports />} />
        <Route path='prescriptions' element={<PatientPrescriptions />} />
        <Route path='messages' element={<PatientMessages />} />
        <Route path='profile' element={<PatientProfile />} />
      </Route>

      <Route path='/doctor' element={<ProtectedRoute allowedRoles={['doctor']}><DashboardLayout /></ProtectedRoute>}>
        <Route path='dashboard' element={<DoctorHome />} />
        <Route path='profile' element={<DoctorProfile />} />
        <Route path='clinics' element={<DoctorClinics />} />
        <Route path='schedule' element={<DoctorSchedule />} />
        <Route path='appointments' element={<DoctorAppointments />} />
        <Route path='appointments/:appointmentId' element={<AppointmentDetail />} />
        <Route path='appointments/:appointmentId/medical-record' element={<AddMedicalRecord />} />
        <Route path='appointments/:appointmentId/prescription' element={<AddPrescription />} />
        <Route path='patients' element={<DoctorPatients />} />
        <Route path='patients/:patientId/history' element={<PatientHistory />} />
        <Route path='assistants' element={<DoctorAssistants />} />
        <Route path='messages' element={<DoctorMessages />} />
        <Route path='prescriptions' element={<DoctorPrescriptions />} />
      </Route>

      <Route path='/assistant' element={<ProtectedRoute allowedRoles={['assistant']}><DashboardLayout /></ProtectedRoute>}>
        <Route path='dashboard' element={<AssistantHome />} />
        <Route path='pending-payments' element={<PendingPayments />} />
        <Route path='appointments' element={<AssistantAppointments />} />
        <Route path='bookings' element={<AssistantBookings />} />
      </Route>

      <Route path='/admin' element={<ProtectedRoute allowedRoles={['admin', 'superadmin']}><DashboardLayout /></ProtectedRoute>}>
        <Route path='dashboard' element={<AdminHome />} />
        <Route path='doctors' element={<AdminDoctors />} />
        <Route path='assistants' element={<AdminAssistants />} />
        <Route path='patients' element={<AdminPatients />} />
        <Route path='appointments' element={<AdminAppointments />} />
        <Route path='payments' element={<AdminPayments />} />
        <Route path='admins' element={<ProtectedRoute allowedRoles={['superadmin']}><ManageAdmins /></ProtectedRoute>} />
        <Route path='users' element={<ProtectedRoute allowedRoles={['superadmin']}><DeleteUsers /></ProtectedRoute>} />
      </Route>

      {/* Public pages */}
      <Route element={<PublicLayout />}>
        <Route path='/' element={<Home />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/login' element={<Login />} />
        <Route path='/login/patient' element={<PatientLogin />} />
        <Route path='/login/staff' element={<StaffLogin />} />
        <Route path='/login/admin' element={<AdminLogin />} />
        <Route path='/register' element={<Register />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/reset-password' element={<ResetPassword />} />
        <Route path='/unauthorized' element={<Unauthorized />} />

        {/* Legacy route redirects */}
        <Route path='/doctors' element={<LegacyRedirect to='/' />} />
        <Route path='/doctors/:speciality' element={<LegacyRedirect to='/' />} />
        <Route path='/my-profile' element={<LegacyRedirect to='/patient/profile' />} />
        <Route path='/my-appointments' element={<LegacyRedirect to='/patient/appointments' />} />
        <Route path='/payment-success' element={<LegacyRedirect to='/patient/appointments' />} />
        <Route path='/appointment/:docId' element={<LegacyRedirect to='/register' />} />

        <Route path='*' element={<NotFound />} />
      </Route>
    </Routes>
  </>
)

export default App
