import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const links = [
    { to: '/assistant/dashboard', label: 'Dashboard', icon: '📊' },
    { to: '/assistant/pending-payments', label: 'Pending Payments', icon: '💳' },
    { to: '/assistant/appointments', label: 'All Appointments', icon: '📋' },
    { to: '/assistant/bookings', label: 'Bookings', icon: '📅' },
]

const AssistantSidebar = () => {
    const { user, logout } = useAuth()

    return (
        <aside className='w-full lg:w-64 shrink-0 bg-white border border-gray-200 rounded-xl p-4 h-fit lg:sticky lg:top-4'>
            <div className='mb-6 pb-4 border-b border-gray-100'>
                <p className='text-xs text-gray-400 uppercase tracking-wide'>Assistant Portal</p>
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

export default AssistantSidebar
