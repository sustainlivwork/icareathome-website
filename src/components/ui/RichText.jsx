/** Renders text in which **words between double asterisks** are emphasised. */
export default function RichText({ text, strongClassName = 'font-semibold text-navy-900' }) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, index) =>
    part.startsWith('**') && part.endsWith('**') ? (
      <strong key={index} className={strongClassName}>
        {part.slice(2, -2)}
      </strong>
    ) : (
      part
    ),
  )
}
