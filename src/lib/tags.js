export function allTags(notes) {
  const map = new Map()
  for (const n of notes) {
    if (n.isArchived) continue
    for (const t of n.tags) if (!map.has(t.toLowerCase())) map.set(t.toLowerCase(), t)
  }
  return [...map.values()].sort((a, b) => a.localeCompare(b))
}
