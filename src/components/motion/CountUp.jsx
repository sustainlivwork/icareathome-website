import { useEffect, useRef, useState } from 'react'

const NUMBER = /^([^\d]*)(\d+(?:\.\d+)?)(.*)$/

/** Shows a figure such as "32.1%" and counts up to it once when it comes into view, including
 *  when it is already on screen as the page opens. The final value is always in the page for
 *  search engines and screen readers. (Until the page is interactive the figure sits inside a card
 *  that is still faded out, so resetting it to 0 is never visible as a jump.) */
export default function CountUp({ value, duration = 1400 }) {
  const ref = useRef(null)
  const [display, setDisplay] = useState(value)

  useEffect(() => {
    const element = ref.current
    const match = value.match(NUMBER)
    if (!element || !match || typeof IntersectionObserver === 'undefined') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const [, prefix, number, suffix] = match
    const target = Number(number)
    const decimals = number.split('.')[1]?.length ?? 0
    const format = (current) => `${prefix}${current.toFixed(decimals)}${suffix}`
    let frame = 0

    setDisplay(format(0))
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        observer.disconnect()
        const start = performance.now()
        const tick = (now) => {
          const progress = Math.min((now - start) / duration, 1)
          const eased = 1 - (1 - progress) ** 3
          setDisplay(progress < 1 ? format(target * eased) : value)
          if (progress < 1) frame = requestAnimationFrame(tick)
        }
        frame = requestAnimationFrame(tick)
      },
      { threshold: 0.5 },
    )
    observer.observe(element)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [value, duration])

  return (
    <span ref={ref}>
      <span aria-hidden="true" className="tabular-nums">{display}</span>
      <span className="sr-only">{value}</span>
    </span>
  )
}
