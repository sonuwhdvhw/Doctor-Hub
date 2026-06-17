import { useAuth } from '../../context/AuthContext'

const DashboardLayout = ({ title, description, children }) => {
    const { user, logout } = useAuth()

    return (
        <div className='min-h-[70vh] py-8'>
            <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8'>
                <div>
                    <h1 className='text-2xl font-semibold text-gray-800'>{title}</h1>
                    <p className='text-gray-500 text-sm mt-1'>{description}</p>
                </div>
                <div className='flex items-center gap-3'>
                    <span className='text-sm text-gray-600'>
                        {user?.name} · <span className='capitalize'>{user?.role}</span>
                    </span>
                    <button
                        onClick={logout}
                        className='text-sm border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-50'
                    >
                        Logout
                    </button>
                </div>
            </div>
            {children}
        </div>
    )
}

export default DashboardLayout
