const PageHeader = ({ title, subtitle, action }) => (
  <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 pb-6 border-b border-slate-100'>
    <div className='animate-slide-up'>
      <h1 className='text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight'>{title}</h1>
      {subtitle && <p className='text-slate-500 text-sm mt-1.5'>{subtitle}</p>}
    </div>
    {action && <div className='shrink-0 animate-fade-in'>{action}</div>}
  </div>
)

export default PageHeader
