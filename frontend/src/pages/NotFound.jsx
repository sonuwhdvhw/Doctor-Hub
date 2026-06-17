import { Link } from 'react-router-dom'
import { Home, ArrowLeft } from 'lucide-react'

const NotFound = () => (
  <div className='min-h-[70vh] flex flex-col items-center justify-center text-center px-4 animate-fade-in'>
    <p className='text-8xl font-extrabold bg-gradient-to-r from-brand-600 to-cyan-500 bg-clip-text text-transparent'>404</p>
    <h1 className='text-2xl font-bold text-slate-900 mt-4'>Page Not Found</h1>
    <p className='text-slate-500 text-sm mt-2 max-w-md'>The page you're looking for doesn't exist or has been moved.</p>
    <Link to='/' className='btn-primary mt-8'>
      <Home size={16} /> Go Home
    </Link>
  </div>
)

export default NotFound
