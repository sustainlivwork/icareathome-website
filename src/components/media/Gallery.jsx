import { useState } from 'react'
import { ImageOff, Maximize2 } from 'lucide-react'
import SmartImage from './SmartImage.jsx'
import Lightbox from './Lightbox.jsx'

/** Grid of photo thumbnails; selecting one opens the full-size viewer. */
export default function Gallery({ images, title }) {
  const [openIndex, setOpenIndex] = useState(null)
  const count = images.length

  return (
    <>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
        {images.map((image, index) => (
          <li key={`${image.src}-${index}`}>
            <figure>
              <button
                type="button"
                aria-haspopup="dialog"
                onClick={() => setOpenIndex(index)}
                className="group relative block aspect-[4/3] w-full overflow-hidden rounded-xl bg-tint shadow-soft"
              >
                <SmartImage
                  src={image.src}
                  alt=""
                  sizes="(min-width: 1024px) 340px, (min-width: 640px) 33vw, 50vw"
                  className="transition duration-500 ease-out-soft group-hover:scale-[1.04]"
                  fallback={
                    <span className="flex h-full w-full items-center justify-center text-ink-subtle">
                      <ImageOff className="size-7" aria-hidden="true" />
                    </span>
                  }
                />
                <span className="absolute inset-0 flex items-end justify-end bg-linear-to-t from-navy-950/45 via-transparent to-transparent p-3 opacity-0 transition duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                  <span className="inline-flex size-9 items-center justify-center rounded-full bg-white/90 text-navy-900">
                    <Maximize2 className="size-4" aria-hidden="true" />
                  </span>
                </span>
                <span className="sr-only">
                  Open photo {index + 1} of {count}: {image.alt}
                </span>
              </button>
              {image.caption && <figcaption className="mt-2 type-small text-ink-muted">{image.caption}</figcaption>}
            </figure>
          </li>
        ))}
      </ul>

      <Lightbox
        images={images}
        index={openIndex}
        onClose={() => setOpenIndex(null)}
        onChange={setOpenIndex}
        label={`Photos: ${title}`}
      />
    </>
  )
}
