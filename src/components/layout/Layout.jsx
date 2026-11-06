import { useEffect, useRef, useState } from 'react'
import { Outlet, useLocation } from 'react-router'
import MotionProvider from '../motion/MotionProvider.jsx'
import SiteHeader from './SiteHeader.jsx'
import SiteFooter from './SiteFooter.jsx'

export default function Layout() {
  const location = useLocation()
  const mainRef = useRef(null)
  const isFirstRender = useRef(true)
  const [hasNavigated, setHasNavigated] = useState(false)

  // After moving to another page: scroll to the top (or to #section) and move
  // keyboard/screen-reader focus to the new content.
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    setHasNavigated(true)
    const target = location.hash && document.getElementById(decodeURIComponent(location.hash.slice(1)))
    if (target) {
      target.scrollIntoView()
      return
    }
    window.scrollTo(0, 0)
    mainRef.current?.focus({ preventScroll: true })
  }, [location.pathname, location.hash])

  return (
    <MotionProvider>
      <div id="top" className="flex min-h-dvh flex-col">
        <a
          href="#main"
          className="sr-only z-[60] rounded-full bg-navy-900 px-5 py-3 font-semibold text-white focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
        >
          Skip to main content
        </a>
        <SiteHeader />
        <main id="main" ref={mainRef} tabIndex={-1} className="flex-1">
          <div key={location.pathname} className={hasNavigated ? 'animate-fade-in' : undefined}>
            <Outlet />
          </div>
        </main>
        <SiteFooter />
      </div>
    </MotionProvider>
  )
}
