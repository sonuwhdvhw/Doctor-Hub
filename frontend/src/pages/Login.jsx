import { Link } from 'react-router-dom'
import { HeartPulse, Stethoscope, Shield, ArrowRight } from 'lucide-react'
import { LOGIN_PORTALS } from '../utils/auth'
import AnimatedSection from '../components/ui/AnimatedSection'

const portals = [
  {
    to: LOGIN_PORTALS.patient,
    title: 'Patient Portal',
    desc: 'Book appointments, view medical history and prescriptions',
    icon: HeartPulse,
    color: 'from-brand-500 to-brand-700',
    hoverBorder: 'hover:border-brand-300',
    bgHover: 'hover:bg-brand-50/50',
  },
  {
    to: LOGIN_PORTALS.staff,
    title: 'Doctor & Assistant',
    desc: 'Manage clinics, schedules, patients, and payments',
    icon: Stethoscope,
    color: 'from-accent-500 to-accent-700',
    hoverBorder: 'hover:border-accent-300',
    bgHover: 'hover:bg-accent-50/50',
  },
  {
    to: LOGIN_PORTALS.admin,
    title: 'Admin Portal',
    desc: 'Platform oversight, user management, and analytics',
    icon: Shield,
    color: 'from-amber-500 to-amber-600',
    hoverBorder: 'hover:border-amber-300',
    bgHover: 'hover:bg-amber-50/50',
  },
]

const Login = () => (
  <div className='min-h-[85vh] flex items-center justify-center px-4 py-12 bg-hero-mesh'>
    <div className='w-full max-w-2xl'>
      <AnimatedSection className='text-center mb-10'>
        <div className='section-label mx-auto mb-4'>Secure Access</div>
        <h1 className='text-2xl sm:text-3xl font-bold text-slate-900'>Choose Your Portal</h1>
        <p className='text-slate-500 text-sm mt-2'>Select the login page that matches your role</p>
      </AnimatedSection>

      <div className='grid gap-4 animate-stagger'>
        {portals.map((portal) => (
          <Link
            key={portal.to}
            to={portal.to}
            className={`card p-6 flex items-center gap-5 border-2 border-transparent ${portal.hoverBorder} ${portal.bgHover} transition-all duration-300 group hover:shadow-card-hover hover:-translate-y-0.5`}
          >
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${portal.color} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
              <portal.icon size={26} className='text-white' />
            </div>
            <div className='flex-1 min-w-0'>
              <h2 className='text-lg font-bold text-slate-900'>{portal.title}</h2>
              <p className='text-sm text-slate-500 mt-1'>{portal.desc}</p>
            </div>
            <ArrowRight size={20} className='text-slate-300 group-hover:text-brand-600 shrink-0 transition-all duration-300 group-hover:translate-x-1' />
          </Link>
        ))}
      </div>

      <AnimatedSection delay={300} className='text-center text-sm text-slate-500 mt-8'>
        New patient?{' '}
        <Link to='/register' className='text-brand-600 font-semibold hover:text-brand-700 transition-colors'>
          Create an account
        </Link>
      </AnimatedSection>
    </div>
  </div>
)

export default Login
