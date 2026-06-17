import { useNavigate } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import {
  ArrowRight, Shield, Clock, Users, Stethoscope, HeartPulse,
  CheckCircle2, Globe, Award, Sparkles, ChevronRight, Activity, Star, Zap,
} from 'lucide-react'

// Scroll animation hook
const useScrollReveal = () => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('revealed')
          observer.unobserve(e.target)
        }
      }),
      { threshold: 0.15 }
    )
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])
}

// Animated counter
const Counter = ({ end, suffix = '' }) => {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        let start = 0
        const step = end / 60
        const timer = setInterval(() => {
          start += step
          if (start >= end) { setCount(end); clearInterval(timer) }
          else setCount(Math.floor(start))
        }, 16)
        observer.unobserve(ref.current)
      }
    })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [end])
  return <span ref={ref}>{count}{suffix}</span>
}

const features = [
  { icon: Stethoscope, title: 'Verified Doctors', desc: 'Every physician verified by our admin team before listing.', color: 'from-red-600 to-red-800' },
  { icon: HeartPulse, title: 'All Treatments', desc: 'Allopathic, homeopathic & herbal — all in one platform.', color: 'from-rose-500 to-red-700' },
  { icon: Clock, title: 'Smart Scheduling', desc: 'Real-time slots with instant booking & reminders.', color: 'from-red-700 to-rose-900' },
  { icon: Shield, title: 'Secure Records', desc: 'HIPAA-grade encryption for all medical data.', color: 'from-red-800 to-gray-900' },
]

const stats = [
  { value: 500, suffix: '+', label: 'Verified Doctors' },
  { value: 10, suffix: 'K+', label: 'Appointments' },
  { value: 98, suffix: '%', label: 'Satisfaction' },
  { value: 24, suffix: '/7', label: 'Platform Access' },
]

const roles = [
  { role: 'Patients', icon: Users, desc: 'Find doctors, book slots, view history & prescriptions', login: '/login/patient', delay: '0ms' },
  { role: 'Doctors', icon: Stethoscope, desc: 'Manage clinics, schedules & digital prescriptions', login: '/login/staff', delay: '100ms' },
  { role: 'Assistants', icon: Activity, desc: 'Verify payments and manage clinic bookings', login: '/login/staff', delay: '200ms' },
  { role: 'Admins', icon: Shield, desc: 'Platform analytics & full user management', login: '/login/admin', delay: '300ms' },
]

const testimonials = [
  { name: 'Sarah Johnson', role: 'Patient', text: 'Booking my appointment was so easy. The platform is intuitive and fast!', stars: 5 },
  { name: 'Dr. Ahmed Khan', role: 'Cardiologist', text: 'Doctor Hub has transformed how I manage my practice and patient records.', stars: 5 },
  { name: 'Maria Garcia', role: 'Patient', text: 'I love having all my medical history in one secure place. Highly recommend!', stars: 5 },
]

const Home = () => {
  const navigate = useNavigate()
  useScrollReveal()

  return (
    <div className='overflow-hidden bg-white'>

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className='relative min-h-screen flex items-center bg-black overflow-hidden'>
        {/* Grid bg */}
        <div className='absolute inset-0 opacity-10'
          style={{ backgroundImage: 'linear-gradient(rgb(255 0 0 / 0.3) 1px, transparent 1px), linear-gradient(90deg, rgb(255 0 0 / 0.3) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

        {/* Glow orbs */}
        <div className='absolute top-1/4 left-1/3 w-96 h-96 bg-red-600/20 rounded-full blur-[120px] animate-pulse-soft' />
        <div className='absolute bottom-1/4 right-1/4 w-80 h-80 bg-red-800/15 rounded-full blur-[100px] animate-float-slow' />

        {/* 3D Rotating ring */}
        <div className='absolute right-[8%] top-1/2 -translate-y-1/2 hidden xl:block' style={{ perspective: '1000px' }}>
          <div className='relative w-80 h-80' style={{ transformStyle: 'preserve-3d' }}>
            <div className='absolute inset-0 rounded-full border-2 border-red-600/30 animate-rotate-slow'
              style={{ transform: 'rotateX(70deg)' }} />
            <div className='absolute inset-4 rounded-full border border-red-500/20 animate-rotate-reverse'
              style={{ transform: 'rotateX(70deg)' }} />
            <div className='absolute inset-8 rounded-full border border-red-400/15 animate-rotate-slow'
              style={{ transform: 'rotateX(70deg)', animationDuration: '12s' }} />
            {/* Center pulse */}
            <div className='absolute inset-0 flex items-center justify-center'>
              <div className='relative'>
                <div className='absolute inset-0 bg-red-600/30 rounded-full animate-pulse-ring scale-150' />
                <div className='w-20 h-20 bg-gradient-to-br from-red-600 to-red-900 rounded-2xl flex items-center justify-center shadow-glow rotate-12 hover:rotate-0 transition-all duration-500'>
                  <HeartPulse size={36} className='text-white' />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full'>
          <div className='max-w-3xl'>
            <div className='inline-flex items-center gap-2 px-4 py-2 rounded-full border border-red-600/40 bg-red-600/10 text-red-400 text-xs font-bold uppercase tracking-widest mb-8 animate-fade-in'>
              <Sparkles size={12} />
              Enterprise Healthcare Platform
            </div>

            <h1 className='text-5xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.05] animate-slide-up'>
              Healthcare
              <br />
              <span className='text-transparent bg-clip-text' style={{ backgroundImage: 'linear-gradient(135deg, #ff2323, #ff5757, #ff9494)' }}>
                Reimagined.
              </span>
            </h1>

            <p className='text-lg text-gray-400 mt-6 leading-relaxed max-w-xl animate-slide-up' style={{ animationDelay: '100ms' }}>
              Connect with verified doctors worldwide. Book appointments, manage records, and access prescriptions — all in one powerful platform.
            </p>

            <div className='flex flex-wrap gap-4 mt-10 animate-slide-up' style={{ animationDelay: '200ms' }}>
              <button onClick={() => navigate('/register')}
                className='group inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-xl font-bold text-sm transition-all duration-300 shadow-glow hover:shadow-glow-red hover:-translate-y-1'>
                Get Started Free
                <ArrowRight size={18} className='group-hover:translate-x-1 transition-transform' />
              </button>
              <button onClick={() => navigate('/login/patient')}
                className='inline-flex items-center gap-2 border border-white/20 text-white hover:bg-white/10 px-8 py-4 rounded-xl font-bold text-sm transition-all duration-300 hover:-translate-y-1'>
                Sign In
                <ChevronRight size={16} />
              </button>
            </div>

            <div className='flex flex-wrap gap-8 mt-12 animate-fade-in' style={{ animationDelay: '400ms' }}>
              {[{ icon: Globe, label: 'Global Standards' }, { icon: Award, label: 'ISO Compliant' }, { icon: Shield, label: 'HIPAA Secure' }].map((b) => (
                <div key={b.label} className='flex items-center gap-2 text-sm text-gray-500'>
                  <b.icon size={14} className='text-red-500' />
                  <span>{b.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className='absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-600 animate-float'>
          <span className='text-xs uppercase tracking-widest'>Scroll</span>
          <div className='w-px h-8 bg-gradient-to-b from-gray-600 to-transparent' />
        </div>
      </section>

      {/* ── STATS ────────────────────────────────────────────── */}
      <section className='bg-black border-y border-red-900/30'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='grid grid-cols-2 lg:grid-cols-4'>
            {stats.map((s, i) => (
              <div key={s.label} className={`py-12 px-8 text-center reveal opacity-0 ${i < 3 ? 'border-r border-red-900/20' : ''}`}
                style={{ transitionDelay: `${i * 100}ms` }}>
                <p className='text-4xl font-black text-white'>
                  <Counter end={s.value} suffix={s.suffix} />
                </p>
                <p className='text-sm text-gray-500 mt-2 uppercase tracking-widest'>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────── */}
      <section className='py-28 bg-white relative overflow-hidden'>
        <div className='absolute top-0 right-0 w-96 h-96 bg-red-50 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl' />
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative'>
          <div className='text-center mb-16 reveal opacity-0'>
            <div className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-red-600 text-xs font-bold uppercase tracking-wider mb-4'>
              <Zap size={12} /> Why Doctor Hub
            </div>
            <h2 className='text-4xl sm:text-5xl font-black text-gray-900'>Built for Modern Healthcare</h2>
            <p className='text-gray-500 mt-4 max-w-lg mx-auto text-lg'>Enterprise-grade tools trusted worldwide</p>
          </div>

          <div className='grid sm:grid-cols-2 lg:grid-cols-4 gap-6'>
            {features.map((f, i) => (
              <div key={f.title} className='reveal opacity-0 group relative bg-white rounded-3xl p-8 border border-gray-100 hover:border-red-200 transition-all duration-500 hover:-translate-y-2 hover:shadow-3d cursor-default'
                style={{ transitionDelay: `${i * 100}ms` }}>
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center text-white mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg`}>
                  <f.icon size={24} />
                </div>
                <h3 className='font-bold text-gray-900 text-xl mb-2'>{f.title}</h3>
                <p className='text-sm text-gray-500 leading-relaxed'>{f.desc}</p>
                <div className='absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 to-rose-500 rounded-b-3xl scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left' />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3D SHOWCASE ──────────────────────────────────────── */}
      <section className='py-28 bg-gradient-to-br from-gray-950 via-black to-red-950 relative overflow-hidden'>
        <div className='absolute inset-0 opacity-5'
          style={{ backgroundImage: 'radial-gradient(circle, rgb(255 35 35) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative'>
          <div className='grid lg:grid-cols-2 gap-16 items-center'>
            <div className='reveal opacity-0'>
              <div className='inline-flex items-center gap-2 px-3 py-1 rounded-full border border-red-600/30 text-red-400 text-xs font-bold uppercase tracking-wider mb-6'>
                Platform Overview
              </div>
              <h2 className='text-4xl sm:text-5xl font-black text-white leading-tight'>
                One Platform,<br />
                <span className='text-transparent bg-clip-text' style={{ backgroundImage: 'linear-gradient(135deg, #ff2323, #ff9494)' }}>
                  Every Role.
                </span>
              </h2>
              <p className='text-gray-400 mt-6 text-lg leading-relaxed'>
                Whether you're a patient, doctor, assistant, or admin — Doctor Hub has a dedicated portal designed specifically for your workflow.
              </p>
              <div className='mt-8 space-y-4'>
                {['Real-time appointment booking', 'Digital prescriptions & records', 'Secure patient messaging', 'AI Symptom Checker'].map((item) => (
                  <div key={item} className='flex items-center gap-3'>
                    <CheckCircle2 size={18} className='text-red-500 shrink-0' />
                    <span className='text-gray-300 text-sm font-medium'>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 3D Card Stack */}
            <div className='reveal opacity-0 relative h-80 hidden lg:block' style={{ perspective: '1200px' }}>
              <div className='absolute inset-0 flex items-center justify-center'>
                {['Admin Portal', 'Doctor Portal', 'Patient Portal'].map((label, i) => (
                  <div key={label}
                    className='absolute w-72 bg-gradient-to-br from-gray-900 to-gray-800 border border-red-900/30 rounded-2xl p-6 shadow-3d transition-all duration-700 hover:scale-105'
                    style={{
                      transform: `rotateY(${(i - 1) * 8}deg) rotateX(${i === 1 ? 0 : 4}deg) translateZ(${i === 1 ? 40 : -20 + i * 20}px) translateX(${(i - 1) * 30}px) translateY(${i === 1 ? -10 : i * 8}px)`,
                      zIndex: i === 1 ? 10 : i,
                      opacity: i === 1 ? 1 : 0.7,
                    }}>
                    <div className='w-8 h-8 rounded-lg bg-gradient-to-br from-red-600 to-red-900 flex items-center justify-center mb-4'>
                      <Activity size={16} className='text-white' />
                    </div>
                    <p className='text-white font-bold'>{label}</p>
                    <div className='mt-3 space-y-2'>
                      {[1, 2].map((j) => (
                        <div key={j} className='h-2 bg-gray-700 rounded-full' style={{ width: `${70 + j * 15}%` }} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── ROLES ────────────────────────────────────────────── */}
      <section className='py-28 bg-white relative'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-16 reveal opacity-0'>
            <div className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-red-600 text-xs font-bold uppercase tracking-wider mb-4'>
              Multi-Portal Access
            </div>
            <h2 className='text-4xl sm:text-5xl font-black text-gray-900'>Built for Everyone</h2>
            <p className='text-gray-500 mt-4 text-lg'>Dedicated portals for each role</p>
          </div>

          <div className='grid sm:grid-cols-2 lg:grid-cols-4 gap-6'>
            {roles.map((r) => (
              <button key={r.role} type='button' onClick={() => navigate(r.login)}
                className='reveal opacity-0 text-left group relative bg-white rounded-3xl p-8 border border-gray-100 hover:border-red-200 transition-all duration-500 hover:-translate-y-3 hover:shadow-3d overflow-hidden'
                style={{ transitionDelay: r.delay }}>
                <div className='absolute inset-0 bg-gradient-to-br from-red-600/0 to-red-600/0 group-hover:from-red-600/5 group-hover:to-red-900/10 transition-all duration-500' />
                <div className='relative'>
                  <div className='w-14 h-14 rounded-2xl bg-black flex items-center justify-center mb-6 group-hover:bg-red-600 transition-colors duration-300 group-hover:rotate-6 transition-all'>
                    <r.icon size={24} className='text-white' />
                  </div>
                  <h3 className='text-gray-900 font-black text-2xl'>{r.role}</h3>
                  <p className='text-gray-500 text-sm mt-3 leading-relaxed'>{r.desc}</p>
                  <div className='mt-6 flex items-center gap-2 text-red-600 text-sm font-bold group-hover:gap-3 transition-all duration-300'>
                    Sign in <ArrowRight size={16} className='group-hover:translate-x-1 transition-transform' />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────── */}
      <section className='py-28 bg-gray-950 relative overflow-hidden'>
        <div className='absolute top-0 left-0 w-64 h-64 bg-red-600/10 rounded-full blur-3xl' />
        <div className='absolute bottom-0 right-0 w-64 h-64 bg-red-800/10 rounded-full blur-3xl' />
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative'>
          <div className='text-center mb-16 reveal opacity-0'>
            <div className='inline-flex items-center gap-2 px-3 py-1 rounded-full border border-red-600/30 text-red-400 text-xs font-bold uppercase tracking-wider mb-4'>
              <Star size={12} /> Testimonials
            </div>
            <h2 className='text-4xl sm:text-5xl font-black text-white'>Trusted Worldwide</h2>
          </div>

          <div className='grid sm:grid-cols-3 gap-6'>
            {testimonials.map((t, i) => (
              <div key={t.name} className='reveal opacity-0 bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:border-red-600/30 transition-all duration-500 hover:-translate-y-2'
                style={{ transitionDelay: `${i * 100}ms` }}>
                <div className='flex gap-1 mb-4'>
                  {[...Array(t.stars)].map((_, j) => (
                    <Star key={j} size={14} className='text-red-500 fill-red-500' />
                  ))}
                </div>
                <p className='text-gray-300 text-sm leading-relaxed mb-6'>"{t.text}"</p>
                <div>
                  <p className='text-white font-bold'>{t.name}</p>
                  <p className='text-gray-500 text-xs mt-1'>{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className='py-28 bg-white relative overflow-hidden'>
        <div className='absolute inset-0 bg-gradient-to-br from-red-50 via-white to-rose-50' />
        <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center'>
          <div className='reveal opacity-0'>
            <div className='inline-flex w-20 h-20 rounded-3xl bg-gradient-to-br from-red-600 to-red-900 items-center justify-center mx-auto mb-8 shadow-glow animate-glow-pulse'>
              <HeartPulse size={36} className='text-white' />
            </div>
            <h2 className='text-4xl sm:text-5xl font-black text-gray-900'>
              Ready to transform<br />your healthcare?
            </h2>
            <p className='text-gray-500 mt-6 text-lg max-w-md mx-auto'>
              Join thousands of patients and healthcare professionals on Doctor Hub today.
            </p>
            <div className='flex flex-wrap gap-4 mt-10 justify-center'>
              <button onClick={() => navigate('/register')}
                className='group inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-10 py-4 rounded-xl font-black text-sm transition-all duration-300 shadow-glow hover:shadow-glow-red hover:-translate-y-1'>
                Create Free Account
                <ArrowRight size={18} className='group-hover:translate-x-1 transition-transform' />
              </button>
              <button onClick={() => navigate('/doctors')}
                className='inline-flex items-center gap-2 border-2 border-gray-200 hover:border-red-300 text-gray-700 hover:text-red-600 px-10 py-4 rounded-xl font-black text-sm transition-all duration-300 hover:-translate-y-1'>
                Browse Doctors
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}

export default Home
