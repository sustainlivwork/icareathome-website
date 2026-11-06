import SmartImage from './SmartImage.jsx'

/**
 * Partner logo shown whole (never cropped, stretched or recoloured) inside a
 * fixed-height box. Some official logo files include generous empty margins;
 * `logoScale` in partners.json enlarges such a logo optically (e.g. 1.3) or
 * shrinks a dominant one (e.g. 0.9) so all logos look balanced side by side.
 */
export default function PartnerLogo({ partner, height = 72, className = '' }) {
  const scale = Number(partner.logoScale) > 0 ? Number(partner.logoScale) : 1
  const fallback = (
    <span className="px-2 text-center font-display text-sm font-semibold leading-snug text-navy-900">{partner.name}</span>
  )
  return (
    <div className={`flex items-center justify-center ${className}`} style={{ height }}>
      <div className="flex h-[80%] w-full items-center justify-center" style={scale !== 1 ? { transform: `scale(${scale})` } : undefined}>
        <SmartImage src={partner.logo} alt={partner.name} fit="contain" fallback={fallback} />
      </div>
    </div>
  )
}
