import { useId, useRef, useState } from 'react'
import Icon from './Icon'
import tagIcon from '../assets/icons/icon-tag.svg'
import clockIcon from '../assets/icons/icon-clock.svg'
import infoIcon from '../assets/icons/icon-info.svg'
import backIcon from '../assets/icons/icon-arrow-left.svg'
import archiveIcon from '../assets/icons/icon-archive.svg'
import restoreIcon from '../assets/icons/icon-restore.svg'
import deleteIcon from '../assets/icons/icon-delete.svg'
import { formatDate, parseTags } from '../lib/format'

export default function NoteEditor({ note, onSave, onCancel, onBack, onArchive, onRestore, onDelete }) {
  const uid = useId()
  const titleRef = useRef(null)
  const contentRef = useRef(null)
  const initial = {
    title: note?.title ?? '',
    tags: note?.tags.join(', ') ?? '',
    content: note?.content ?? '',
  }
  const [draft, setDraft] = useState(initial)
  const [errors, setErrors] = useState({})

  const set = (field) => (e) => {
    setDraft((d) => ({ ...d, [field]: e.target.value }))
    if (errors[field]) setErrors((er) => ({ ...er, [field]: undefined }))
  }

  function submit(e) {
    e.preventDefault()
    const next = {}
    if (!draft.title.trim()) next.title = 'Please enter a title.'
    if (!draft.content.trim()) next.content = 'Please enter some content.'
    setErrors(next)
    if (next.title) return titleRef.current.focus()
    if (next.content) return contentRef.current.focus()
    onSave({ title: draft.title.trim(), tags: parseTags(draft.tags), content: draft.content })
  }

  function cancel() {
    setDraft(initial)
    setErrors({})
    onCancel()
  }

  const isArchived = note?.isArchived

  return (
    <form className="editor" onSubmit={submit} noValidate aria-label={note ? 'Edit note' : 'New note'}>
      <div className="editor__toolbar">
        <button type="button" className="toolbar-btn toolbar-btn--back" onClick={onBack}>
          <Icon src={backIcon} />
          Go Back
        </button>
        <span className="editor__toolbar-spacer" />
        {note && (
          <>
            <button type="button" className="toolbar-btn toolbar-btn--icon" onClick={onDelete} aria-label="Delete note">
              <Icon src={deleteIcon} />
            </button>
            <button
              type="button"
              className="toolbar-btn toolbar-btn--icon"
              onClick={isArchived ? onRestore : onArchive}
              aria-label={isArchived ? 'Restore note' : 'Archive note'}
            >
              <Icon src={isArchived ? restoreIcon : archiveIcon} />
            </button>
          </>
        )}
        <button type="button" className="toolbar-btn" onClick={cancel}>
          Cancel
        </button>
        <button type="submit" className="toolbar-btn toolbar-btn--primary">
          Save Note
        </button>
      </div>

      <div className="editor__head">
        <label htmlFor={`${uid}-title`} className="sr-only">
          Title
        </label>
        <input
          ref={titleRef}
          id={`${uid}-title`}
          className="editor__title"
          value={draft.title}
          onChange={set('title')}
          placeholder="Enter a title…"
          aria-invalid={!!errors.title}
          aria-describedby={errors.title ? `${uid}-title-err` : undefined}
        />
        {errors.title && <FieldError id={`${uid}-title-err`}>{errors.title}</FieldError>}

        <dl className="meta">
          <div className="meta__row">
            <dt>
              <Icon src={tagIcon} />
              <label htmlFor={`${uid}-tags`}>Tags</label>
            </dt>
            <dd>
              <input
                id={`${uid}-tags`}
                value={draft.tags}
                onChange={set('tags')}
                placeholder="Add tags separated by commas (e.g. Work, Planning)"
              />
            </dd>
          </div>
          <div className="meta__row">
            <dt>
              <Icon src={clockIcon} />
              Last edited
            </dt>
            <dd>{note ? formatDate(note.lastEdited) : <span className="muted">Not yet saved</span>}</dd>
          </div>
        </dl>
      </div>

      <div className="editor__content">
        <label htmlFor={`${uid}-content`} className="sr-only">
          Note content
        </label>
        <textarea
          ref={contentRef}
          id={`${uid}-content`}
          value={draft.content}
          onChange={set('content')}
          placeholder="Start typing your note here…"
          aria-invalid={!!errors.content}
          aria-describedby={errors.content ? `${uid}-content-err` : undefined}
        />
        {errors.content && <FieldError id={`${uid}-content-err`}>{errors.content}</FieldError>}
      </div>

      <div className="editor__footer">
        <button type="submit" className="btn btn--primary">
          Save Note
        </button>
        <button type="button" className="btn btn--secondary" onClick={cancel}>
          Cancel
        </button>
      </div>
    </form>
  )
}

function FieldError({ id, children }) {
  return (
    <p id={id} className="field-error">
      <Icon src={infoIcon} />
      {children}
    </p>
  )
}
