import { useState } from 'react'
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react'
import { toast } from 'react-toastify'
import AnimatedSection from '../components/ui/AnimatedSection'

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' })

  const handleSubmit = (e) => {
    e.preventDefault()
    toast.success('Message sent! We will get back to you soon.')
    setForm({ name: '', email: '', message: '' })
  }

  const contactInfo = [
    { icon: Mail, label: 'Email', value: 'support@doctorhub.com', color: 'bg-brand-50 text-brand-600' },
    { icon: Phone, label: 'Phone', value: '+92 300 1234567', color: 'bg-accent-50 text-accent-600' },
    { icon: MapPin, label: 'Address', value: 'Lahore, Pakistan', color: 'bg-violet-50 text-violet-600' },
  ]

  return (
    <div>
      <section className='relative bg-hero-mesh py-20 sm:py-24 overflow-hidden'>
        <div className='relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
          <AnimatedSection>
            <div className='section-label mx-auto mb-4'>Get In Touch</div>
            <h1 className='text-4xl sm:text-5xl font-bold text-slate-900'>Contact Us</h1>
            <p className='text-slate-500 mt-4 text-lg'>Have questions? Our team is here to help.</p>
          </AnimatedSection>
        </div>
      </section>

      <section className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 -mt-8'>
        <div className='grid lg:grid-cols-3 gap-8'>
          <AnimatedSection className='space-y-4'>
            {contactInfo.map((c) => (
              <div key={c.label} className='card p-5 flex items-center gap-4 hover:shadow-card-hover transition-all duration-300'>
                <div className={`w-12 h-12 rounded-xl ${c.color} flex items-center justify-center shrink-0`}>
                  <c.icon size={20} />
                </div>
                <div>
                  <p className='text-xs text-slate-400 font-semibold uppercase tracking-wider'>{c.label}</p>
                  <p className='text-sm font-semibold text-slate-800 mt-0.5'>{c.value}</p>
                </div>
              </div>
            ))}
          </AnimatedSection>

          <AnimatedSection delay={150} className='lg:col-span-2'>
            <form onSubmit={handleSubmit} className='card p-8 space-y-5 shadow-card-hover'>
              <div className='flex items-center gap-3 mb-2'>
                <div className='w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center'>
                  <MessageSquare size={18} />
                </div>
                <div>
                  <h2 className='font-bold text-slate-900'>Send a Message</h2>
                  <p className='text-xs text-slate-500'>We typically respond within 24 hours</p>
                </div>
              </div>

              <div className='grid sm:grid-cols-2 gap-5'>
                <div>
                  <label className='text-sm font-semibold text-slate-700 mb-1.5 block'>Name</label>
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className='input-field' required placeholder='Your name' />
                </div>
                <div>
                  <label className='text-sm font-semibold text-slate-700 mb-1.5 block'>Email</label>
                  <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className='input-field' type='email' required placeholder='you@email.com' />
                </div>
              </div>
              <div>
                <label className='text-sm font-semibold text-slate-700 mb-1.5 block'>Message</label>
                <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className='input-field min-h-[140px] resize-y' required placeholder='How can we help?' />
              </div>
              <button type='submit' className='btn-primary'>
                Send Message <Send size={16} />
              </button>
            </form>
          </AnimatedSection>
        </div>
      </section>
    </div>
  )
}

export default Contact
