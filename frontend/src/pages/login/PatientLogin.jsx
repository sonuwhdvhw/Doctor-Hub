import { HeartPulse } from 'lucide-react'
import RoleLoginForm from '../../components/auth/RoleLoginForm'
import { LOGIN_PORTALS } from '../../utils/auth'

const PatientLogin = () => (
    <RoleLoginForm
        title='Patient Sign In'
        subtitle='Book appointments, view records, and manage your health'
        icon={HeartPulse}
        iconClassName='from-blue-500 to-blue-700'
        allowedRoles={['patient']}
        wrongPortalMessage='This portal is for patients only. Please use the correct login page for your role.'
        showRegisterLink
        alternatePortals={[
            { to: LOGIN_PORTALS.staff, label: 'Doctor / Assistant' },
            { to: LOGIN_PORTALS.admin, label: 'Admin / Super Admin' },
        ]}
    />
)

export default PatientLogin
