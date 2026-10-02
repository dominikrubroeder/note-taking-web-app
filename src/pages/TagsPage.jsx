import { Link, Navigate } from 'react-router-dom'
import { useNotes } from '../context/NotesContext'
import { useIsDesktop } from '../hooks/useMedia'
import { allTags } from '../lib/tags'
import Icon from '../components/Icon'
import tagIcon from '../assets/icons/icon-tag.svg'

// Mobile/tablet only: on desktop tags live in the sidebar.
export default function TagsPage() {
  const { notes } = useNotes()
  const isDesktop = useIsDesktop()
  if (isDesktop) return <Navigate to="/" replace />
  const tags = allTags(notes)

  return (
    <div className="page">
      <h1 className="page-head__title">Tags</h1>
      {tags.length === 0 && <p className="empty">Tags you add to notes will show up here.</p>}
      <ul className="tag-index">
        {tags.map((t) => (
          <li key={t}>
            <Link to={`/tags/${encodeURIComponent(t)}`} className="tag-index__link">
              <Icon src={tagIcon} />
              {t}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
