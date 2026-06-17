import { Shield } from 'lucide-react'
import RoleLoginForm from '../../components/auth/RoleLoginForm'
import { LOGIN_PORTALS } from '../../utils/auth'

const AdminLogin = () => (
    <RoleLoginForm
        title='Admin Sign In'
        subtitle='For administrators and super admins'
        icon={Shield}
        iconClassName='from-amber-500 to-amber-700'
        allowedRoles={['admin', 'superadmin']}
        wrongPortalMessage='This portal is for admins and super admins only. Please use the correct login page for your role.'
        alternatePortals={[
            { to: LOGIN_PORTALS.patient, label: 'Patient' },
            { to: LOGIN_PORTALS.staff, label: 'Doctor / Assistant' },
        ]}
    />
)

export default AdminLogin
