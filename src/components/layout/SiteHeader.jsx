import { useEffect, useId, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router'
import { AnimatePresence, m } from 'motion/react'
import { Menu, X } from 'lucide-react'
import { site } from '../../lib/content.js'
import Brand from '../ui/Brand.jsx'

const trimSlash = (path) => path.replace(/\/+$/, '') || '/'

// On large screens the logo is the link to the home page, so "Home" is only
// listed in the mobile menu (and the footer).
const desktopNavigation = site.navigation.filter((item) => item.path !== '/')

export function isActivePath(pathname, path) {
  const current = trimSlash(pathname)
  const target = trimSlash(path)
  return target === '/' ? current === '/' : current === target || current.startsWith(`${target}/`)
}

export default function SiteHeader() {
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const toggleRef = useRef(null)
  const menuId = useId()

  useEffect(() => setOpen(false), [pathname])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (event) => {
      if (event.key === 'Escape') {
        setOpen(false)
        toggleRef.current?.focus()
      }
    }
    const onResize = () => window.innerWidth >= 1024 && setOpen(false)
    document.addEventListener('keydown', onKey)
    window.addEventListener('resize', onResize)
    return () => {
      document.removeEventListener('keydown', onKey)
      window.removeEventListener('resize', onResize)
    }
  }, [open])

  return (
    <header className="sticky top-0 z-50">
      <div className="h-1 bg-brand-gradient" aria-hidden="true" />
      <div
        className={`relative border-b bg-white/92 backdrop-blur-lg transition-shadow duration-300 ${
          scrolled || open ? 'border-line shadow-soft' : 'border-transparent'
        }`}
      >
        <div className="container-page flex h-[4.25rem] items-center justify-between gap-6 sm:h-[4.75rem]">
          <Link
            to="/"
            aria-current={pathname === '/' ? 'page' : undefined}
            className="shrink-0 rounded-lg transition-opacity duration-200 hover:opacity-80"
            aria-label={`${site.name}, home page`}
          >
            <Brand />
          </Link>

          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center gap-0.5 xl:gap-1">
              {desktopNavigation.map((item) => {
                const active = isActivePath(pathname, item.path)
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      aria-current={active ? 'page' : undefined}
                      className={`relative block rounded-full px-3 py-2 font-display text-base font-semibold transition-colors xl:px-3.5 xl:text-lg ${
                        active ? 'text-navy-900' : 'text-ink-muted hover:bg-tint/70 hover:text-navy-900'
                      }`}
                    >
                      {item.label}
                      {active && (
                        <m.span
                          layoutId="nav-active"
                          className="absolute inset-x-3 -bottom-[0.95rem] h-[3px] rounded-full bg-brand-gradient xl:inset-x-3.5"
                          transition={{ type: 'spring', stiffness: 420, damping: 36 }}
                        />
                      )}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          <button
            ref={toggleRef}
            type="button"
            className="inline-flex size-11 items-center justify-center rounded-full text-navy-900 ring-1 ring-line transition hover:bg-tint lg:hidden"
            aria-expanded={open}
            aria-controls={menuId}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
            <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
          </button>
        </div>

        <AnimatePresence initial={false}>
          {open && (
            <m.nav
              id={menuId}
              aria-label="Main"
              key="mobile-menu"
              className="overflow-hidden border-t border-line lg:hidden"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <ul className="container-page grid gap-1 py-4">
                {site.navigation.map((item, index) => {
                  const active = isActivePath(pathname, item.path)
                  return (
                    <m.li
                      key={item.path}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.03 * index + 0.05, duration: 0.25 }}
                    >
                      <Link
                        to={item.path}
                        aria-current={active ? 'page' : undefined}
                        className={`flex min-h-12 items-center gap-3 rounded-xl px-4 font-display text-lg font-semibold transition ${
                          active ? 'bg-tint text-navy-900' : 'text-ink hover:bg-mist'
                        }`}
                      >
                        <span
                          aria-hidden="true"
                          className={`h-5 w-1 rounded-full ${active ? 'bg-brand-gradient' : 'bg-transparent'}`}
                        />
                        {item.label}
                      </Link>
                    </m.li>
                  )
                })}
              </ul>
            </m.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}
