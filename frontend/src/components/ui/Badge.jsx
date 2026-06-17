const variants = {
  success: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20',
  warning: 'bg-amber-50 text-amber-700 ring-1 ring-amber-600/20',
  danger: 'bg-red-50 text-red-700 ring-1 ring-red-600/20',
  info: 'bg-blue-50 text-blue-700 ring-1 ring-blue-600/20',
  neutral: 'bg-slate-100 text-slate-600 ring-1 ring-slate-500/10',
  brand: 'bg-brand-50 text-brand-700 ring-1 ring-brand-600/20',
}

const Badge = ({ children, variant = 'neutral' }) => (
  <span className={`badge ${variants[variant]}`}>{children}</span>
)

export default Badge
