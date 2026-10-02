const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

// "29 Oct 2024" — Intl en-GB emits "Sept", which diverges from the design.
export function formatDate(iso) {
  const d = new Date(iso)
  return `${String(d.getDate()).padStart(2, '0')} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`
}

export function parseTags(input) {
  const seen = new Set()
  return input
    .split(',')
    .map((t) => t.trim())
    .filter((t) => {
      const key = t.toLowerCase()
      if (!t || seen.has(key)) return false
      seen.add(key)
      return true
    })
}
