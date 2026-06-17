import { Link } from 'react-router-dom'
import { ShieldOff, ArrowLeft } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { getDashboardPath, getLoginPath } from '../utils/auth'

const Unauthorized = () => {
  const { user, isAuthenticated } = useAuth()
  const dashboard = user ? getDashboardPath(user.role) : getLoginPath(user?.role)

  return (
    <div className='min-h-[70vh] flex flex-col items-center justify-center text-center px-4 animate-fade-in'>
      <div className='w-20 h-20 rounded-2xl bg-red-100 text-red-500 flex items-center justify-center mb-6'>
        <ShieldOff size={36} />
      </div>
      <p className='text-6xl font-extrabold text-red-500'>403</p>
      <h1 className='text-2xl font-bold text-slate-900 mt-4'>Access Denied</h1>
      <p className='text-slate-500 text-sm mt-2 max-w-md'>You don't have permission to view this page with your current role.</p>
      <div className='flex gap-3 mt-8 flex-wrap justify-center'>
        {isAuthenticated ? (
          <Link to={dashboard} className='btn-primary'><ArrowLeft size={16} /> Go to Dashboard</Link>
        ) : (
          <Link to='/login' className='btn-primary'>Choose Portal</Link>
        )}
        <Link to='/' className='btn-secondary'>Home</Link>
      </div>
    </div>
  )
}

export default Unauthorized
