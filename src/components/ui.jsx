/* Shared Glassmorphism UI primitives for the SST training platform. */

export function Card({ className = '', children }) {
  return (
    <div
      className={`rounded-3xl border border-white/20 bg-white/10 shadow-xl shadow-purple-950/20 backdrop-blur-xl ${className}`}
    >
      {children}
    </div>
  )
}

export function Button({
  variant = 'primary',
  className = '',
  type = 'button',
  ...props
}) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-2xl font-semibold transition-all duration-150 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40'
  const variants = {
    primary:
      'bg-white text-primary shadow-lg shadow-purple-950/30 hover:bg-white/90',
    neutral:
      'border border-white/30 bg-white/15 text-white backdrop-blur-xl hover:bg-white/25',
  }
  return (
    <button
      type={type}
      className={`${base} ${variants[variant]} ${className}`}
      {...props}
    />
  )
}

export function Input({ className = '', ...props }) {
  return (
    <input
      className={`w-full rounded-2xl border border-white/30 bg-white/15 px-4 py-3 text-white shadow-inner outline-none backdrop-blur-xl placeholder:text-white/50 focus:border-white/60 focus:bg-white/20 ${className}`}
      {...props}
    />
  )
}

export function Pill({ active = false, className = '', ...props }) {
  return (
    <button
      type="button"
      className={`inline-flex cursor-pointer items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-150 ${
        active
          ? 'bg-white text-primary shadow-lg shadow-purple-950/30'
          : 'border border-white/25 bg-white/10 text-white/80 backdrop-blur-xl hover:bg-white/20 hover:text-white'
      } ${className}`}
      {...props}
    />
  )
}

/* Inline icons (kept dependency-free). */
export function IconShield({ className = 'h-6 w-6' }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2l8 3v6c0 5-3.5 8.5-8 11-4.5-2.5-8-6-8-11V5l8-3z" />
    </svg>
  )
}

export function IconChevronLeft({ className = 'h-6 w-6' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polyline points="15 18 9 12 15 6" />
    </svg>
  )
}

export function IconChevronRight({ className = 'h-6 w-6' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  )
}

export function IconVolume({ className = 'h-5 w-5' }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M11 5L6 9H2v6h4l5 4V5z" />
      <path
        d="M15.5 8.5a5 5 0 0 1 0 7"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M18.5 5.5a9 9 0 0 1 0 13"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function IconStop({ className = 'h-5 w-5' }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <rect x="6" y="6" width="12" height="12" rx="2" />
    </svg>
  )
}

export function IconCheck({ className = 'h-5 w-5' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}
