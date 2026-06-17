import { NavLink } from 'react-router-dom'
import { Stethoscope, Mail, Phone, MapPin, ArrowUpRight } from 'lucide-react'

const Footer = () => (
  <footer className='bg-surface-sidebar text-slate-400 mt-auto relative overflow-hidden'>
    <div className='absolute inset-0 bg-[url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.02\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")]' />

    <div className='relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
      <div className='grid sm:grid-cols-2 lg:grid-cols-4 gap-10'>
        <div className='sm:col-span-2'>
          <div className='flex items-center gap-3 mb-5'>
            <div className='w-10 h-10 rounded-xl bg-gradient-brand flex items-center justify-center'>
              <Stethoscope size={20} className='text-white' />
            </div>
            <div>
              <span className='text-xl font-bold text-white block'>Doctor Hub</span>
              <span className='text-xs text-brand-400 font-semibold uppercase tracking-wider'>Healthcare Platform</span>
            </div>
          </div>
          <p className='text-sm leading-relaxed max-w-md text-slate-400'>
            A world-class healthcare platform connecting patients with verified doctors across allopathic, homeopathic, and herbal treatments — built to international standards.
          </p>
        </div>

        <div>
          <h4 className='text-white font-semibold text-sm mb-5'>Quick Links</h4>
          <ul className='space-y-3 text-sm'>
            {[
              { to: '/', label: 'Home' },
              { to: '/about', label: 'About Us' },
              { to: '/contact', label: 'Contact' },
              { to: '/login', label: 'Sign In' },
            ].map((link) => (
              <li key={link.to}>
                <NavLink to={link.to} className='hover:text-white transition-colors duration-200 flex items-center gap-1 group'>
                  {link.label}
                  <ArrowUpRight size={12} className='opacity-0 group-hover:opacity-100 transition-opacity' />
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className='text-white font-semibold text-sm mb-5'>Contact</h4>
          <ul className='space-y-3.5 text-sm'>
            <li className='flex items-center gap-3'>
              <div className='w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0'>
                <Mail size={14} className='text-brand-400' />
              </div>
              support@doctorhub.com
            </li>
            <li className='flex items-center gap-3'>
              <div className='w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0'>
                <Phone size={14} className='text-brand-400' />
              </div>
              +92 300 1234567
            </li>
            <li className='flex items-center gap-3'>
              <div className='w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0'>
                <MapPin size={14} className='text-brand-400' />
              </div>
              Lahore, Pakistan
            </li>
          </ul>
        </div>
      </div>

      <div className='border-t border-white/10 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500'>
        <p>&copy; {new Date().getFullYear()} Doctor Hub. All rights reserved.</p>
        <div className='flex gap-6'>
          <span className='hover:text-slate-300 cursor-pointer transition-colors'>Privacy Policy</span>
          <span className='hover:text-slate-300 cursor-pointer transition-colors'>Terms of Service</span>
        </div>
      </div>
    </div>
  </footer>
)

export default Footer
