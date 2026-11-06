import { Link } from 'react-router'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { isExternalUrl } from '../../lib/assets.js'

const VARIANTS = {
  primary:
    'bg-navy-900 text-white shadow-soft hover:bg-navy-800 hover:shadow-glow',
  secondary:
    'bg-white text-navy-900 ring-1 ring-line-strong hover:ring-navy-900/40 hover:shadow-soft',
  light:
    'bg-white text-navy-900 hover:bg-tint',
}

export default function ButtonLink({ to, variant = 'primary', icon = true, className = '', children }) {
  const external = isExternalUrl(to)
  const Icon = external ? ArrowUpRight : ArrowRight
  const classes = `group inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 py-3 font-display text-[0.9375rem] font-bold transition duration-300 ease-out-soft ${VARIANTS[variant]} ${className}`
  const content = (
    <>
      {children}
      {icon && <Icon className="size-[1.1em] transition-transform duration-300 ease-out-soft group-hover:translate-x-0.5" aria-hidden="true" />}
    </>
  )
  return external ? (
    <a href={to} className={classes} target="_blank" rel="noopener noreferrer">
      {content}
    </a>
  ) : (
    <Link to={to} className={classes}>
      {content}
    </Link>
  )
}

/** Quiet text link with an arrow, for "see more" style links. */
export function ArrowLink({ to, className = '', children }) {
  return (
    <Link
      to={to}
      className={`group inline-flex items-center gap-1.5 font-display font-bold text-blue-text underline-offset-4 hover:underline ${className}`}
    >
      {children}
      <ArrowRight className="size-4 transition-transform duration-300 ease-out-soft group-hover:translate-x-1" aria-hidden="true" />
    </Link>
  )
}
