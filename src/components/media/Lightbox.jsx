import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, m } from 'motion/react'
import { ChevronLeft, ChevronRight, ImageOff, X } from 'lucide-react'
import SmartImage from './SmartImage.jsx'

const SWIPE_DISTANCE = 70
const SWIPE_VELOCITY = 450

/**
 * Full-screen photo viewer built on the native <dialog> element, which keeps
 * keyboard focus inside while open and returns it to the photo afterwards.
 * Keys: ← / → previous / next, Esc closes. On touch screens: swipe.
 */
export default function Lightbox({ images, index, onClose, onChange, label }) {
  const dialogRef = useRef(null)
  const [direction, setDirection] = useState(0)
  const open = index !== null
  const count = images.length
  const image = open ? images[index] : null

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) {
      dialog.showModal()
      document.documentElement.style.overflow = 'hidden'
    } else if (!open && dialog.open) {
      dialog.close()
    }
  }, [open])

  useEffect(() => () => {
    document.documentElement.style.overflow = ''
  }, [])

  const go = (step) => {
    if (count < 2) return
    setDirection(step)
    onChange((index + step + count) % count)
  }

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      go(1)
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault()
      go(-1)
    }
  }

  const handleClose = () => {
    document.documentElement.style.overflow = ''
    onClose()
  }

  const missing = (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-white/70">
      <ImageOff className="size-10" aria-hidden="true" />
      <span className="text-sm">This photo could not be loaded.</span>
    </div>
  )

  return (
    <dialog
      ref={dialogRef}
      aria-label={label}
      onClose={handleClose}
      onKeyDown={handleKeyDown}
      className="fixed inset-0 m-0 h-dvh max-h-none w-screen max-w-none overflow-hidden bg-navy-950/96 p-0 text-white backdrop:bg-navy-950/80"
    >
      {image && (
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6">
            <p className="font-display text-sm font-semibold tracking-wide text-white/80">
              {index + 1} / {count}
            </p>
            <button
              type="button"
              autoFocus
              onClick={() => dialogRef.current?.close()}
              className="inline-flex size-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
            >
              <X className="size-6" aria-hidden="true" />
              <span className="sr-only">Close photo viewer</span>
            </button>
          </div>

          <div
            className="relative min-h-0 flex-1"
            onClick={(event) => event.target === event.currentTarget && dialogRef.current?.close()}
          >
            <AnimatePresence initial={false} custom={direction}>
              <m.div
                key={index}
                custom={direction}
                className="absolute inset-0 flex items-center justify-center px-2 sm:px-20"
                initial={{ opacity: 0, x: direction * 80 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction * -80 }}
                transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                drag={count > 1 ? 'x' : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.5}
                onDragEnd={(_, { offset, velocity }) => {
                  if (offset.x < -SWIPE_DISTANCE || velocity.x < -SWIPE_VELOCITY) go(1)
                  else if (offset.x > SWIPE_DISTANCE || velocity.x > SWIPE_VELOCITY) go(-1)
                }}
                onClick={(event) => event.target === event.currentTarget && dialogRef.current?.close()}
              >
                <div className="h-full max-h-full w-full">
                  <SmartImage
                    src={image.src}
                    alt={image.alt}
                    fit="contain"
                    sizes="100vw"
                    priority
                    draggable={false}
                    className="pointer-events-none select-none"
                    fallback={missing}
                  />
                </div>
              </m.div>
            </AnimatePresence>

            {count > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => go(-1)}
                  className="absolute top-1/2 left-2 inline-flex size-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/25 sm:left-5"
                >
                  <ChevronLeft className="size-7" aria-hidden="true" />
                  <span className="sr-only">Previous photo</span>
                </button>
                <button
                  type="button"
                  onClick={() => go(1)}
                  className="absolute top-1/2 right-2 inline-flex size-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/25 sm:right-5"
                >
                  <ChevronRight className="size-7" aria-hidden="true" />
                  <span className="sr-only">Next photo</span>
                </button>
              </>
            )}
          </div>

          <div className="min-h-16 px-4 py-4 text-center sm:px-6">
            {image.caption && <p className="mx-auto max-w-3xl type-body text-white/90">{image.caption}</p>}
            <p className="sr-only" aria-live="polite">
              Photo {index + 1} of {count}: {image.alt}
            </p>
          </div>
        </div>
      )}
    </dialog>
  )
}
