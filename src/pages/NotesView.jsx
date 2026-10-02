import { useMemo, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useNotes } from '../context/NotesContext'
import { useToast } from '../context/ToastContext'
import { useIsDesktop } from '../hooks/useMedia'
import { listPath, notePath, useScope } from '../hooks/useScope'
import { EMPTY_COPY, scopeHint, scopeTitle } from '../lib/titles'
import Dialog from '../components/Dialog'
import Icon from '../components/Icon'
import NoteEditor from '../components/NoteEditor'
import NoteList from '../components/NoteList'
import SearchBox from '../components/SearchBox'
import plusIcon from '../assets/icons/icon-plus.svg'
import archiveIcon from '../assets/icons/icon-archive.svg'
import restoreIcon from '../assets/icons/icon-restore.svg'
import deleteIcon from '../assets/icons/icon-delete.svg'
import backIcon from '../assets/icons/icon-arrow-left.svg'

function filterNotes(notes, { kind, tag, q }) {
  const byDate = (a, b) => b.lastEdited.localeCompare(a.lastEdited)
  if (kind === 'archived') return notes.filter((n) => n.isArchived).sort(byDate)
  const active = notes.filter((n) => !n.isArchived)
  if (kind === 'tag') return active.filter((n) => n.tags.some((t) => t.toLowerCase() === tag?.toLowerCase())).sort(byDate)
  if (kind === 'search') {
    const needle = q.trim().toLowerCase()
    if (!needle) return []
    return active
      .filter((n) => [n.title, n.content, ...n.tags].some((s) => s.toLowerCase().includes(needle)))
      .sort(byDate)
  }
  return active.sort(byDate)
}

export default function NotesView() {
  const scope = useScope()
  const { notes, create, update, setArchived, remove } = useNotes()
  const toast = useToast()
  const navigate = useNavigate()
  const isDesktop = useIsDesktop()
  const [dialog, setDialog] = useState(null)

  const visible = useMemo(() => filterNotes(notes, scope), [notes, scope.kind, scope.tag, scope.q])

  // Mobile tag index lives at /tags; desktop uses the sidebar instead.
  if (scope.kind === 'tag' && !scope.tag) return <Navigate to={isDesktop ? '/' : '/tags'} replace />

  const requested = scope.id ? notes.find((n) => n.id === scope.id) : null
  if (scope.id && !requested) return <Navigate to={listPath(scope)} replace />

  const note = requested ?? (isDesktop && !scope.isNew ? visible[0] : null)
  const detailOpen = Boolean(requested || scope.isNew)
  const base = listPath(scope)

  function handleSave(values) {
    if (note) {
      update(note.id, values)
      toast('Note saved successfully!')
    } else {
      const created = create(values)
      toast('Note saved successfully!')
      navigate(notePath({ kind: 'all' }, created.id))
    }
  }

  function confirmArchive() {
    setArchived(note.id, true)
    setDialog(null)
    navigate(base)
    toast('Note archived.', { to: '/archived', label: 'Archived Notes' })
  }

  function restore() {
    setArchived(note.id, false)
    navigate(base)
    toast('Note restored to All Notes.', { to: '/', label: 'All Notes' })
  }

  function confirmDelete() {
    remove(note.id)
    setDialog(null)
    navigate(base)
    toast('Note permanently deleted.')
  }

  const hint = scopeHint(scope, visible.length)
  const showEmpty = visible.length === 0 && scope.kind !== 'search'

  return (
    <div className="notes-view" data-detail={detailOpen ? 'open' : 'closed'}>
      <section className="notes-view__list" aria-label="Notes">
        <div className="page-head">
          {scope.kind === 'tag' && (
            <Link to="/tags" className="back-link">
              <Icon src={backIcon} />
              Go Back
            </Link>
          )}
          <h1 className="page-head__title">{scope.kind === 'search' ? 'Search' : scopeTitle(scope)}</h1>
          {scope.kind === 'search' && <SearchBox className="search--page" />}
        </div>

        {scope.kind !== 'archived' && (
          <Link to="/notes/new" className="create-btn">
            <Icon src={plusIcon} />
            <span>Create New Note</span>
          </Link>
        )}

        {hint && <p className="hint">{hint}</p>}
        {showEmpty && <p className="empty">{scope.kind === 'archived' ? EMPTY_COPY.archived : EMPTY_COPY[scope.kind]}</p>}
        <NoteList notes={visible} selectedId={detailOpen || isDesktop ? note?.id : null} scope={scope} />
      </section>

      <section className="notes-view__editor" aria-label="Note">
        {note || scope.isNew ? (
          <NoteEditor
            key={note?.id ?? 'new'}
            note={scope.isNew ? null : note}
            onSave={handleSave}
            onCancel={() => scope.isNew && navigate(base)}
            onBack={() => navigate(base)}
            onArchive={() => setDialog('archive')}
            onRestore={restore}
            onDelete={() => setDialog('delete')}
          />
        ) : (
          <p className="empty empty--editor">Select a note to read it, or create a new one.</p>
        )}
      </section>

      {note && !scope.isNew && (
        <aside className="notes-view__actions" aria-label="Note actions">
          {note.isArchived ? (
            <button type="button" className="btn btn--outline" onClick={restore}>
              <Icon src={restoreIcon} />
              Restore Note
            </button>
          ) : (
            <button type="button" className="btn btn--outline" onClick={() => setDialog('archive')}>
              <Icon src={archiveIcon} />
              Archive Note
            </button>
          )}
          <button type="button" className="btn btn--outline" onClick={() => setDialog('delete')}>
            <Icon src={deleteIcon} />
            Delete Note
          </button>
        </aside>
      )}

      {dialog === 'archive' && (
        <Dialog
          icon={archiveIcon}
          title="Archive Note"
          confirmLabel="Archive Note"
          onConfirm={confirmArchive}
          onClose={() => setDialog(null)}
        >
          Are you sure you want to archive this note? You can find it in the Archived Notes section and restore it
          anytime.
        </Dialog>
      )}
      {dialog === 'delete' && (
        <Dialog
          icon={deleteIcon}
          title="Delete Note"
          confirmLabel="Delete Note"
          tone="danger"
          onConfirm={confirmDelete}
          onClose={() => setDialog(null)}
        >
          Are you sure you want to permanently delete this note? This action cannot be undone.
        </Dialog>
      )}
    </div>
  )
}
