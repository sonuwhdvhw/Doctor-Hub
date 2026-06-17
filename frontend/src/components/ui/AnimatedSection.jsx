const AnimatedSection = ({ children, className = '', delay = 0, animation = 'slide-up' }) => {
  const animClass = {
    'fade-in': 'animate-fade-in',
    'slide-up': 'animate-slide-up',
    'scale-in': 'animate-scale-in',
  }[animation] || 'animate-slide-up'

  return (
    <div
      className={`${animClass} ${className}`}
      style={{ animationDelay: delay ? `${delay}ms` : undefined, opacity: delay ? 0 : undefined }}
    >
      {children}
    </div>
  )
}

export default AnimatedSection
