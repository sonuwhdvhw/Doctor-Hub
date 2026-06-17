import { Stethoscope } from 'lucide-react'
import RoleLoginForm from '../../components/auth/RoleLoginForm'
import { LOGIN_PORTALS } from '../../utils/auth'

const StaffLogin = () => (
    <RoleLoginForm
        title='Doctor & Assistant Sign In'
        subtitle='Manage clinics, appointments, and patient care'
        icon={Stethoscope}
        iconClassName='from-emerald-500 to-emerald-700'
        allowedRoles={['doctor', 'assistant']}
        wrongPortalMessage='This portal is for doctors and assistants only. Please use the correct login page for your role.'
        alternatePortals={[
            { to: LOGIN_PORTALS.patient, label: 'Patient' },
            { to: LOGIN_PORTALS.admin, label: 'Admin / Super Admin' },
        ]}
    />
)

export default StaffLogin
