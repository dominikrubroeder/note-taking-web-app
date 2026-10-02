import { Link } from 'react-router-dom'
import { formatDate } from '../lib/format'
import { notePath } from '../hooks/useScope'
import TagChips from './TagChips'

export default function NoteList({ notes, selectedId, scope }) {
  return (
    <ul className="note-list">
      {notes.map((note) => (
        <li key={note.id}>
          <Link
            to={notePath(scope, note.id)}
            className="note-item"
            aria-current={note.id === selectedId ? 'true' : undefined}
          >
            <span className="note-item__title">{note.title}</span>
            <TagChips tags={note.tags} />
            <span className="note-item__date">{formatDate(note.lastEdited)}</span>
          </Link>
        </li>
      ))}
    </ul>
  )
}
