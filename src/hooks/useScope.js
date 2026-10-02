import { useLocation, useSearchParams } from 'react-router-dom'

/**
 * Derives what the notes view shows from the URL, so every state is linkable
 * and the back button works. Shapes:
 *   /  /archived  /tags/:tag  /search?q=   (+ /:id suffix, or /notes/:id, /notes/new)
 */
export function useScope() {
  const { pathname } = useLocation()
  const [params] = useSearchParams()
  const seg = pathname.split('/').filter(Boolean).map(decodeURIComponent)
  const q = params.get('q') ?? ''

  let kind = 'all'
  let tag = null
  let rest = seg
  if (seg[0] === 'archived') (kind = 'archived'), (rest = seg.slice(1))
  else if (seg[0] === 'search') (kind = 'search'), (rest = seg.slice(1))
  else if (seg[0] === 'tags') {
    kind = 'tag'
    tag = seg[1] ?? null
    rest = seg.slice(2)
  } else if (seg[0] === 'notes') rest = seg.slice(1)

  const isNew = seg[0] === 'notes' && seg[1] === 'new'
  const id = isNew ? null : (rest[0] ?? null)
  return { kind, tag, q, id, isNew }
}

export function listPath({ kind, tag, q }) {
  if (kind === 'archived') return '/archived'
  if (kind === 'tag') return tag ? `/tags/${encodeURIComponent(tag)}` : '/tags'
  if (kind === 'search') return q ? `/search?q=${encodeURIComponent(q)}` : '/search'
  return '/'
}

export function notePath(scope, id) {
  const [path, query] = listPath(scope).split('?')
  const base = path === '/' ? '' : path
  const prefix = scope.kind === 'tag' && !scope.tag ? '' : base
  return `${prefix || '/notes'}/${id}${query ? `?${query}` : ''}`
}
