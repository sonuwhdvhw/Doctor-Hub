import { NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const baseLinks = [
    { to: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
    { to: '/admin/doctors', label: 'Doctors', icon: '👨‍⚕️' },
    { to: '/admin/patients', label: 'Patients', icon: '🧑' },
    { to: '/admin/appointments', label: 'Appointments', icon: '📋' },
    { to: '/admin/payments', label: 'Payments', icon: '💳' },
]

const superLinks = [
    { to: '/admin/admins', label: 'Manage Admins', icon: '🛡️' },
    { to: '/admin/users', label: 'Delete Users', icon: '🗑️' },
]

const AdminSidebar = () => {
    const { user, logout } = useAuth()
    const isSuperAdmin = user?.role === 'superadmin'
    const links = isSuperAdmin ? [...baseLinks, ...superLinks] : baseLinks

    return (
        <aside className='w-full lg:w-64 shrink-0 bg-white border border-gray-200 rounded-xl p-4 h-fit lg:sticky lg:top-4'>
            <div className='mb-6 pb-4 border-b border-gray-100'>
                <p className='text-xs text-gray-400 uppercase tracking-wide'>
                    {isSuperAdmin ? 'Super Admin' : 'Admin Panel'}
                </p>
                <p className='font-semibold text-gray-800 mt-1'>{user?.name}</p>
                <p className='text-xs text-gray-500'>{user?.email}</p>
            </div>

            <nav className='flex flex-col gap-1'>
                {links.map((link) => (
                    <NavLink
                        key={link.to}
                        to={link.to}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                                isActive ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-50'
                            }`
                        }
                    >
                        <span>{link.icon}</span>
                        {link.label}
                    </NavLink>
                ))}
            </nav>

            <button
                onClick={logout}
                className='mt-6 w-full text-sm text-red-500 border border-red-200 py-2 rounded-lg hover:bg-red-50'
            >
                Logout
            </button>
        </aside>
    )
}

export default AdminSidebar
