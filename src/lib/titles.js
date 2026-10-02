export function scopeTitle({ kind, tag, q }) {
  if (kind === 'archived') return 'Archived Notes'
  if (kind === 'tag') return `Notes Tagged: ${tag}`
  if (kind === 'search') return q ? `Showing results for: ${q}` : 'Search'
  return 'All Notes'
}

export function scopeHint({ kind, tag, q }, count) {
  if (kind === 'archived') return 'All your archived notes are stored here. You can restore or delete them anytime.'
  if (kind === 'tag') return `All notes with the “${tag}” tag are shown here.`
  if (kind === 'search') {
    if (!q) return 'Search by title, content, or tags.'
    if (count === 0) return `No notes match your search. Try a different keyword or create a new note.`
  }
  return null
}

export const EMPTY_COPY = {
  all: 'You don’t have any notes yet. Start a new note to capture your thoughts and ideas.',
  archived: 'No notes have been archived yet. Move notes here for safekeeping, or create a new note.',
  tag: 'No notes with this tag yet.',
  search: '',
}
