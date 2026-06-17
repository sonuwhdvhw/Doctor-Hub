import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, ArrowRight } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import AnimatedSection from '../ui/AnimatedSection'

const RoleLoginForm = ({
  title,
  subtitle,
  icon: Icon,
  iconClassName = 'from-brand-500 to-brand-700',
  allowedRoles,
  wrongPortalMessage,
  showRegisterLink = false,
  alternatePortals = [],
}) => {
  const { login, loading } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const onSubmit = async (e) => {
    e.preventDefault()
    const result = await login(email, password, allowedRoles, wrongPortalMessage)
    if (result.success) navigate(result.redirectTo)
  }

  return (
    <div className='min-h-[85vh] flex items-center justify-center px-4 py-12 bg-hero-mesh'>
      <div className='w-full max-w-md'>
        <AnimatedSection className='text-center mb-8'>
          <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${iconClassName} flex items-center justify-center shadow-glow mb-5`}>
            <Icon size={28} className='text-white' />
          </div>
          <h1 className='text-2xl font-bold text-slate-900'>{title}</h1>
          <p className='text-slate-500 text-sm mt-2'>{subtitle}</p>
        </AnimatedSection>

        <AnimatedSection delay={100}>
          <form onSubmit={onSubmit} className='card p-8 space-y-5 shadow-card-hover'>
            <div>
              <label className='text-sm font-semibold text-slate-700 mb-1.5 block'>Email Address</label>
              <div className='relative'>
                <Mail size={16} className='absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400' />
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className='input-field pl-10'
                  type='email'
                  autoComplete='email'
                  required
                  placeholder='you@email.com'
                />
              </div>
            </div>

            <div>
              <label className='text-sm font-semibold text-slate-700 mb-1.5 block'>Password</label>
              <div className='relative'>
                <Lock size={16} className='absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400' />
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className='input-field pl-10'
                  type='password'
                  autoComplete='current-password'
                  required
                  placeholder='••••••••'
                />
              </div>
            </div>

            <div className='text-right'>
              <Link to='/forgot-password' className='text-brand-600 text-xs font-semibold hover:text-brand-700 transition-colors'>
                Forgot password?
              </Link>
            </div>

            <button type='submit' disabled={loading} className='btn-primary w-full py-3'>
              {loading ? 'Signing in...' : 'Sign In'}
              {!loading && <ArrowRight size={16} />}
            </button>
          </form>
        </AnimatedSection>

        {showRegisterLink && (
          <p className='text-center text-sm text-slate-500 mt-6 animate-fade-in'>
            Don't have an account?{' '}
            <Link to='/register' className='text-brand-600 font-semibold hover:text-brand-700'>
              Create one
            </Link>
          </p>
        )}

        {alternatePortals.length > 0 && (
          <div className='mt-6 pt-6 border-t border-slate-200/60'>
            <p className='text-center text-xs text-slate-400 mb-3 font-medium'>Sign in as a different role</p>
            <div className='flex flex-wrap justify-center gap-2'>
              {alternatePortals.map((portal) => (
                <Link
                  key={portal.to}
                  to={portal.to}
                  className='text-xs font-semibold text-slate-600 hover:text-brand-600 px-3 py-1.5 rounded-lg hover:bg-brand-50 transition-all duration-200'
                >
                  {portal.label}
                </Link>
              ))}
            </div>
          </div>
        )}

        <p className='text-center text-sm text-slate-500 mt-4'>
          <Link to='/login' className='text-slate-500 hover:text-brand-600 transition-colors'>
            ← All login portals
          </Link>
        </p>
      </div>
    </div>
  )
}

export default RoleLoginForm
