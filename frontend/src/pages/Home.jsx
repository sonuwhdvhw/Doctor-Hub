import { useNavigate } from 'react-router-dom'
import {
  ArrowRight, Shield, Clock, Users, Stethoscope, HeartPulse,
  CheckCircle2, Globe, Award, Sparkles, ChevronRight,
} from 'lucide-react'
import AnimatedSection from '../components/ui/AnimatedSection'

const features = [
  { icon: Stethoscope, title: 'Verified Doctors', desc: 'Every physician is verified by our admin team before appearing in search results.', color: 'from-brand-500 to-brand-700' },
  { icon: HeartPulse, title: 'All Treatment Types', desc: 'Allopathic, homeopathic, and herbal specialists — all in one trusted platform.', color: 'from-accent-500 to-accent-700' },
  { icon: Clock, title: 'Smart Scheduling', desc: 'Real-time slot availability with instant booking and automated reminders.', color: 'from-violet-500 to-violet-700' },
  { icon: Shield, title: 'Secure Health Records', desc: 'HIPAA-grade encryption for medical history, prescriptions, and reports.', color: 'from-blue-500 to-blue-700' },
]

const stats = [
  { value: '500+', label: 'Verified Doctors' },
  { value: '10K+', label: 'Appointments' },
  { value: '98%', label: 'Satisfaction Rate' },
  { value: '24/7', label: 'Platform Access' },
]

const trustBadges = [
  { icon: Globe, label: 'Global Standards' },
  { icon: Award, label: 'ISO Compliant' },
  { icon: Shield, label: 'Data Protected' },
]

const roles = [
  { role: 'Patients', desc: 'Find doctors, book appointments, view history & prescriptions', color: 'from-brand-500 to-brand-700', login: '/login/patient' },
  { role: 'Doctors', desc: 'Manage clinics, schedules, patients & digital prescriptions', color: 'from-accent-500 to-accent-700', login: '/login/staff' },
  { role: 'Assistants', desc: 'Verify payments and manage clinic bookings efficiently', color: 'from-violet-500 to-violet-700', login: '/login/staff' },
  { role: 'Admins', desc: 'Platform analytics, user management, and full oversight', color: 'from-amber-500 to-amber-600', login: '/login/admin' },
]

const Home = () => {
  const navigate = useNavigate()

  return (
    <div className='overflow-hidden'>
      {/* Hero */}
      <section className='relative min-h-[90vh] flex items-center'>
        <div className='absolute inset-0 bg-hero-mesh' />
        <div className='absolute inset-0 bg-gradient-to-b from-white/0 via-white/50 to-surface' />

        {/* Floating orbs */}
        <div className='absolute top-32 right-[10%] w-64 h-64 bg-brand-400/10 rounded-full blur-3xl animate-float' />
        <div className='absolute bottom-20 left-[5%] w-80 h-80 bg-accent-400/10 rounded-full blur-3xl animate-float' style={{ animationDelay: '2s' }} />

        <div className='relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 w-full'>
          <div className='grid lg:grid-cols-2 gap-12 items-center'>
            <AnimatedSection>
              <div className='section-label mb-6'>
                <Sparkles size={12} />
                Enterprise Healthcare Platform
              </div>
              <h1 className='text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1]'>
                World-Class Care,{' '}
                <span className='gradient-text'>One Platform</span>
              </h1>
              <p className='text-lg text-slate-500 mt-6 leading-relaxed max-w-lg'>
                Doctor Hub connects patients with verified healthcare professionals worldwide.
                Book appointments, manage records, and access prescriptions — seamlessly.
              </p>

              <div className='flex flex-wrap gap-4 mt-8'>
                <button onClick={() => navigate('/register')} className='btn-primary text-base px-8 py-3.5'>
                  Get Started Free
                  <ArrowRight size={18} />
                </button>
                <button onClick={() => navigate('/login/patient')} className='btn-secondary text-base px-8 py-3.5'>
                  Patient Sign In
                </button>
              </div>

              <div className='flex flex-wrap gap-6 mt-10'>
                {trustBadges.map((b) => (
                  <div key={b.label} className='flex items-center gap-2 text-sm text-slate-500'>
                    <div className='w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center'>
                      <b.icon size={14} className='text-brand-600' />
                    </div>
                    <span className='font-medium'>{b.label}</span>
                  </div>
                ))}
              </div>
            </AnimatedSection>

            {/* Hero visual card */}
            <AnimatedSection delay={200} animation='scale-in' className='hidden lg:block'>
              <div className='relative'>
                <div className='card-glass p-8 shadow-card-hover'>
                  <div className='flex items-center gap-4 mb-6'>
                    <div className='w-14 h-14 rounded-2xl bg-gradient-brand flex items-center justify-center shadow-glow'>
                      <HeartPulse size={28} className='text-white' />
                    </div>
                    <div>
                      <p className='font-bold text-slate-900 text-lg'>Doctor Hub</p>
                      <p className='text-sm text-slate-500'>Healthcare Management Suite</p>
                    </div>
                  </div>
                  <div className='space-y-3'>
                    {['AI Symptom Checker', 'Online Appointments', 'Digital Prescriptions', 'Secure Messaging'].map((item, i) => (
                      <div key={item} className='flex items-center gap-3 p-3 rounded-xl bg-surface-muted/60 animate-slide-up' style={{ animationDelay: `${300 + i * 100}ms` }}>
                        <CheckCircle2 size={18} className='text-accent-500 shrink-0' />
                        <span className='text-sm font-medium text-slate-700'>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className='absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-brand rounded-2xl opacity-20 blur-2xl' />
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10'>
        <div className='grid grid-cols-2 lg:grid-cols-4 gap-4 animate-stagger'>
          {stats.map((s) => (
            <div key={s.label} className='card p-6 text-center group hover:shadow-card-hover transition-all duration-300'>
              <p className='text-3xl font-bold gradient-text'>{s.value}</p>
              <p className='text-sm text-slate-500 mt-1 font-medium'>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24'>
        <AnimatedSection className='text-center mb-14'>
          <div className='section-label mx-auto mb-4'>Why Doctor Hub</div>
          <h2 className='text-3xl sm:text-4xl font-bold text-slate-900'>Built for Modern Healthcare</h2>
          <p className='text-slate-500 mt-4 max-w-lg mx-auto'>Enterprise-grade tools trusted by patients, doctors, and healthcare administrators</p>
        </AnimatedSection>

        <div className='grid sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-stagger'>
          {features.map((f) => (
            <div key={f.title} className='card-hover p-6 group'>
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center text-white mb-5 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                <f.icon size={22} />
              </div>
              <h3 className='font-bold text-slate-900 text-lg'>{f.title}</h3>
              <p className='text-sm text-slate-500 mt-2 leading-relaxed'>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Roles */}
      <section className='bg-gradient-dark py-24 relative overflow-hidden'>
        <div className='absolute inset-0 bg-[url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.02\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")]' />
        <div className='relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <AnimatedSection className='text-center mb-14'>
            <div className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white/80 text-xs font-bold uppercase tracking-wider mb-4'>
              Multi-Portal Access
            </div>
            <h2 className='text-3xl sm:text-4xl font-bold text-white'>Built for Everyone</h2>
            <p className='text-slate-400 mt-4'>Dedicated portals for each role in the healthcare ecosystem</p>
          </AnimatedSection>

          <div className='grid sm:grid-cols-2 lg:grid-cols-4 gap-5 animate-stagger'>
            {roles.map((r) => (
              <button
                key={r.role}
                type='button'
                onClick={() => navigate(r.login)}
                className='text-left bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-brand-400/40 hover:bg-white/10 transition-all duration-300 group'
              >
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${r.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <Users size={18} className='text-white' />
                </div>
                <h3 className='text-white font-bold text-lg'>{r.role}</h3>
                <p className='text-slate-400 text-sm mt-2 leading-relaxed'>{r.desc}</p>
                <p className='text-brand-400 text-xs font-semibold mt-4 flex items-center gap-1 group-hover:gap-2 transition-all'>
                  Sign in <ChevronRight size={14} />
                </p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24'>
        <AnimatedSection>
          <div className='relative rounded-3xl p-10 sm:p-16 text-center overflow-hidden'>
            <div className='absolute inset-0 bg-gradient-brand' />
            <div className='absolute inset-0 bg-[url("data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.05\'%3E%3Cpath d=\'M0 40L40 0H20L0 20M40 40V20L20 40\'/%3E%3C/g%3E%3C/svg%3E")]' />
            <div className='relative'>
              <h2 className='text-3xl sm:text-4xl font-bold text-white'>Ready to transform your healthcare experience?</h2>
              <p className='text-white/80 mt-4 max-w-md mx-auto text-lg'>Join thousands of patients and healthcare professionals on Doctor Hub today.</p>
              <button
                onClick={() => navigate('/register')}
                className='mt-8 bg-white text-brand-700 px-8 py-3.5 rounded-xl font-bold text-sm hover:bg-brand-50 transition-all duration-300 inline-flex items-center gap-2 hover:-translate-y-0.5 hover:shadow-lg'
              >
                Create Free Account <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </AnimatedSection>
      </section>
    </div>
  )
}

export default Home
