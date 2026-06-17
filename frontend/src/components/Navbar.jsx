import { useState, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { Menu, X, ChevronDown, Stethoscope } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { getLoginPath } from '../utils/auth'

const Navbar = () => {
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { isAuthenticated, user, logout, getDashboardPath } = useAuth()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleLogout = () => {
    logout()
    navigate(getLoginPath(user?.role))
    setDropdownOpen(false)
  }

  const dashboardPath = user ? getDashboardPath(user.role) : '/'

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
  ]

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-white/95 backdrop-blur-xl shadow-nav border-b border-slate-100' : 'bg-white/80 backdrop-blur-lg border-b border-transparent'
    }`}>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center justify-between h-16 lg:h-[4.5rem]'>
          <button onClick={() => navigate('/')} className='flex items-center gap-3 group'>
            <div className='w-10 h-10 rounded-xl bg-gradient-brand flex items-center justify-center shadow-glow group-hover:scale-105 transition-transform duration-300'>
              <Stethoscope size={20} className='text-white' />
            </div>
            <div className='text-left'>
              <span className='text-lg font-bold text-slate-900 tracking-tight block leading-tight'>Doctor Hub</span>
              <span className='text-[10px] font-semibold text-brand-600 uppercase tracking-widest hidden sm:block'>Healthcare Platform</span>
            </div>
          </button>

          <nav className='hidden md:flex items-center gap-1'>
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'text-brand-700 bg-brand-50'
                      : 'text-slate-600 hover:text-brand-700 hover:bg-slate-50'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className='hidden md:flex items-center gap-3'>
            {isAuthenticated ? (
              <div className='relative'>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className='flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-50 border border-slate-200/80 transition-all duration-200'
                >
                  <div className='w-8 h-8 rounded-full bg-gradient-brand flex items-center justify-center text-white text-xs font-bold'>
                    {user?.name?.charAt(0)?.toUpperCase()}
                  </div>
                  <span className='text-sm font-medium text-slate-700 capitalize'>{user?.role}</span>
                  <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {dropdownOpen && (
                  <>
                    <div className='fixed inset-0' onClick={() => setDropdownOpen(false)} />
                    <div className='absolute right-0 top-full mt-2 w-52 card p-2 shadow-card-hover animate-scale-in'>
                      <button onClick={() => { navigate(dashboardPath); setDropdownOpen(false) }} className='w-full text-left px-3 py-2.5 text-sm text-slate-700 hover:bg-brand-50 hover:text-brand-700 rounded-lg font-medium transition-colors'>
                        Dashboard
                      </button>
                      <button onClick={handleLogout} className='w-full text-left px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors'>
                        Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <>
                <button onClick={() => navigate('/login')} className='btn-ghost'>Sign In</button>
                <button onClick={() => navigate('/register')} className='btn-primary'>Get Started</button>
              </>
            )}
          </div>

          <button onClick={() => setMobileOpen(!mobileOpen)} className='md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors'>
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className='md:hidden border-t border-slate-100 bg-white px-4 py-4 space-y-1 animate-slide-down'>
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `block px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-50'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
          <div className='pt-3 border-t border-slate-100 space-y-2'>
            {isAuthenticated ? (
              <>
                <button onClick={() => { navigate(dashboardPath); setMobileOpen(false) }} className='w-full btn-secondary'>Dashboard</button>
                <button onClick={() => { handleLogout(); setMobileOpen(false) }} className='w-full btn-danger'>Sign Out</button>
              </>
            ) : (
              <>
                <button onClick={() => { navigate('/login'); setMobileOpen(false) }} className='w-full btn-secondary'>Sign In</button>
                <button onClick={() => { navigate('/register'); setMobileOpen(false) }} className='w-full btn-primary'>Get Started</button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar
