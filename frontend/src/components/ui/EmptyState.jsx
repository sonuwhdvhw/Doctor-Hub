const EmptyState = ({ icon: Icon, title, description, action }) => (
  <div className='card p-12 text-center'>
    {Icon && (
      <div className='w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400'>
        <Icon size={28} />
      </div>
    )}
    <h3 className='text-lg font-semibold text-slate-800'>{title}</h3>
    {description && <p className='text-sm text-slate-500 mt-2 max-w-sm mx-auto'>{description}</p>}
    {action && <div className='mt-6'>{action}</div>}
  </div>
)

export default EmptyState
