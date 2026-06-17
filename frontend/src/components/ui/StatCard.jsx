const colorMap = {
  blue: 'from-brand-500 to-brand-700',
  green: 'from-accent-500 to-accent-700',
  purple: 'from-violet-500 to-violet-700',
  orange: 'from-amber-500 to-amber-600',
  cyan: 'from-brand-500 to-accent-600',
  rose: 'from-rose-500 to-rose-600',
}

const StatCard = ({ label, value, icon: Icon, color = 'cyan' }) => (
  <div className='card p-5 sm:p-6 hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 group'>
    <div className='flex items-start justify-between'>
      <div>
        <p className='text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight'>{value}</p>
        <p className='text-sm text-slate-500 mt-2 font-medium'>{label}</p>
      </div>
      {Icon && (
        <div className={`p-3 rounded-xl bg-gradient-to-br ${colorMap[color]} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
          <Icon size={20} />
        </div>
      )}
    </div>
  </div>
)

export default StatCard
