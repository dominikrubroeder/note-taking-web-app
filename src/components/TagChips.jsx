export default function TagChips({ tags }) {
  if (!tags.length) return null
  return (
    <span className="chips">
      <span className="sr-only">Tags: </span>
      {tags.map((t) => (
        <span key={t} className="chip">
          {t}
        </span>
      ))}
    </span>
  )
}
