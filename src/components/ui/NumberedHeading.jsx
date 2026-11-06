/** "01", "02", … for numbered sections. */
export const formatNumber = (index) => String(index + 1).padStart(2, '0')

/** Section heading with a small, muted number above it (About and Objectives pages). */
export default function NumberedHeading({ id, index, children }) {
  return (
    <div>
      <span aria-hidden="true" className="block text-xs font-medium tracking-[0.12em] text-ink-subtle tabular-nums">
        {formatNumber(index)}
      </span>
      <h2 id={id} className="mt-1.5 type-heading">
        {children}
      </h2>
    </div>
  )
}
