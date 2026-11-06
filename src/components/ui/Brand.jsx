import { site } from '../../lib/content.js'
import { assetUrl } from '../../lib/assets.js'

/**
 * Logo: [symbol] Care@Home — the word styled like the logo artwork
 * ("Care@" in navy, "Home" in the blue→green gradient). When a complete
 * horizontal logo file is set in site.json ("logo.horizontal"), that image is used instead.
 */
export default function Brand() {
  const { logo, name } = site

  if (logo.horizontal) {
    return <img src={assetUrl(logo.horizontal)} alt={name} className="h-10 w-auto" />
  }

  const at = name.indexOf('@')
  return (
    <span className="flex items-center gap-3">
      <img
        src={assetUrl(logo.symbol)}
        alt=""
        width={logo.symbolWidth || undefined}
        height={logo.symbolHeight || undefined}
        className="h-11 w-auto shrink-0 sm:h-[3.25rem]"
      />
      <span
        className="font-display text-[1.625rem] leading-none font-bold tracking-[-0.025em] text-navy-900 sm:text-[1.875rem]"
      >
        {at === -1 ? (
          name
        ) : (
          <>
            {name.slice(0, at + 1)}
            <span className="bg-[linear-gradient(90deg,#4f7cff,#24b7c5_55%,#17c188)] bg-clip-text text-transparent">
              {name.slice(at + 1)}
            </span>
          </>
        )}
      </span>
    </span>
  )
}
