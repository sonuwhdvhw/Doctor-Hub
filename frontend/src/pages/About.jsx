import { Target, Eye, Heart, Users, Globe, Award } from 'lucide-react'
import AnimatedSection from '../components/ui/AnimatedSection'

const values = [
  { icon: Heart, title: 'Patient First', desc: 'Every feature is designed around improving patient experience and health outcomes.', color: 'from-rose-500 to-rose-600' },
  { icon: Eye, title: 'Transparency', desc: 'Verified doctors, clear pricing, and honest communication at every step.', color: 'from-brand-500 to-brand-700' },
  { icon: Target, title: 'Precision', desc: 'Accurate records, reliable scheduling, and data you can trust.', color: 'from-accent-500 to-accent-700' },
  { icon: Users, title: 'Community', desc: 'Building a connected healthcare ecosystem for patients and providers.', color: 'from-violet-500 to-violet-700' },
]

const About = () => (
  <div>
    <section className='relative bg-hero-mesh py-20 sm:py-28 overflow-hidden'>
      <div className='absolute top-10 right-10 w-64 h-64 bg-brand-400/10 rounded-full blur-3xl' />
      <div className='relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
        <AnimatedSection>
          <div className='section-label mx-auto mb-4'>About Us</div>
          <h1 className='text-4xl sm:text-5xl font-bold text-slate-900'>About Doctor Hub</h1>
          <p className='text-slate-500 mt-5 max-w-2xl mx-auto leading-relaxed text-lg'>
            A world-class healthcare platform bridging patients and verified medical professionals — supporting allopathic, homeopathic, and herbal treatments under one unified system.
          </p>
        </AnimatedSection>
      </div>
    </section>

    <section className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20'>
      <div className='grid lg:grid-cols-2 gap-12 items-center'>
        <AnimatedSection>
          <h2 className='text-3xl font-bold text-slate-900 mb-5'>Our Mission</h2>
          <p className='text-slate-500 leading-relaxed text-lg'>
            We believe healthcare should be accessible, transparent, and efficient. Doctor Hub empowers patients to find the right doctor, book appointments seamlessly, and maintain a complete medical history — while giving doctors and clinics powerful tools to manage their practice.
          </p>
          <div className='flex gap-6 mt-8'>
            <div className='flex items-center gap-2 text-sm text-slate-600'>
              <Globe size={16} className='text-brand-600' />
              <span className='font-medium'>Global Standards</span>
            </div>
            <div className='flex items-center gap-2 text-sm text-slate-600'>
              <Award size={16} className='text-accent-600' />
              <span className='font-medium'>Trusted Platform</span>
            </div>
          </div>
        </AnimatedSection>
        <AnimatedSection delay={150} animation='scale-in'>
          <div className='relative rounded-3xl p-10 bg-gradient-brand text-white overflow-hidden shadow-glow'>
            <div className='absolute inset-0' style={{backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E\")"}} />
            <div className='relative'>
              <p className='text-6xl font-bold'>2024</p>
              <p className='text-white/80 mt-3 font-medium text-lg'>Founded with a vision to modernize healthcare</p>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>

    <section className='bg-surface-muted py-20'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <AnimatedSection className='text-center mb-12'>
          <h2 className='text-3xl font-bold text-slate-900'>Our Core Values</h2>
          <p className='text-slate-500 mt-3'>The principles that guide everything we build</p>
        </AnimatedSection>
        <div className='grid sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-stagger'>
          {values.map((v) => (
            <div key={v.title} className='card-hover p-6 text-center group'>
              <div className={`w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br ${v.color} text-white flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                <v.icon size={24} />
              </div>
              <h3 className='font-bold text-slate-900 text-lg'>{v.title}</h3>
              <p className='text-sm text-slate-500 mt-2 leading-relaxed'>{v.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  </div>
)

export default About
