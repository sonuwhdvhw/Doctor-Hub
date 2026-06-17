import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Stethoscope, User, Mail, Lock, ArrowRight } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import AnimatedSection from '../components/ui/AnimatedSection'

const ROLES = [
  { value: 'patient', label: 'Patient' },
  { value: 'doctor', label: 'Doctor' },
]

const Register = () => {
  const { register, loading } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('patient')

  const onSubmit = async (e) => {
    e.preventDefault()
    const result = await register(name, email, password, role)
    if (result.success) navigate(result.redirectTo)
  }

  return (
    <div className='min-h-[85vh] flex items-center justify-center px-4 py-12 bg-hero-mesh'>
      <div className='w-full max-w-md'>
        <AnimatedSection className='text-center mb-8'>
          <div className='w-16 h-16 mx-auto rounded-2xl bg-gradient-brand flex items-center justify-center shadow-glow mb-5'>
            <Stethoscope size={28} className='text-white' />
          </div>
          <h1 className='text-2xl font-bold text-slate-900'>Create Your Account</h1>
          <p className='text-slate-500 text-sm mt-2'>Join Doctor Hub — world-class healthcare, simplified</p>
        </AnimatedSection>

        <AnimatedSection delay={100}>
          <form onSubmit={onSubmit} className='card p-8 space-y-5 shadow-card-hover'>
            <div>
              <label className='text-sm font-semibold text-slate-700 mb-1.5 block'>Full Name</label>
              <div className='relative'>
                <User size={16} className='absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400' />
                <input value={name} onChange={(e) => setName(e.target.value)} className='input-field pl-10' type='text' required placeholder='John Doe' />
              </div>
            </div>

            <div>
              <label className='text-sm font-semibold text-slate-700 mb-1.5 block'>Email Address</label>
              <div className='relative'>
                <Mail size={16} className='absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400' />
                <input value={email} onChange={(e) => setEmail(e.target.value)} className='input-field pl-10' type='email' required placeholder='you@email.com' />
              </div>
            </div>

            <div>
              <label className='text-sm font-semibold text-slate-700 mb-1.5 block'>Password</label>
              <div className='relative'>
                <Lock size={16} className='absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400' />
                <input value={password} onChange={(e) => setPassword(e.target.value)} className='input-field pl-10' type='password' minLength={8} required placeholder='Min. 8 characters' />
              </div>
            </div>

            <div>
              <label className='text-sm font-semibold text-slate-700 mb-1.5 block'>Register As</label>
              <select value={role} onChange={(e) => setRole(e.target.value)} className='input-field'>
                {ROLES.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
              </select>
            </div>

            <button type='submit' disabled={loading} className='btn-primary w-full py-3'>
              {loading ? 'Creating account...' : 'Create Account'}
              {!loading && <ArrowRight size={16} />}
            </button>
          </form>
        </AnimatedSection>

        <p className='text-center text-sm text-slate-500 mt-6'>
          Already have an account?{' '}
          <Link to='/login/patient' className='text-brand-600 font-semibold hover:text-brand-700 transition-colors'>Sign in</Link>
        </p>
      </div>
    </div>
  )
}

export default Register
