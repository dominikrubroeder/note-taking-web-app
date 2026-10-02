import { createContext, useContext, useEffect, useMemo, useReducer } from 'react'
import seed from '../data/seed.json'
import { load, save } from '../lib/storage'

const KEY = 'notes-app:notes'

const seedNotes = seed.notes.map((n, i) => ({ ...n, id: `seed-${i + 1}` }))

function reducer(state, action) {
  switch (action.type) {
    case 'add':
      return [action.note, ...state]
    case 'update':
      return state.map((n) => (n.id === action.id ? { ...n, ...action.changes } : n))
    case 'remove':
      return state.filter((n) => n.id !== action.id)
    default:
      return state
  }
}

const NotesContext = createContext(null)

export function NotesProvider({ children }) {
  const [notes, dispatch] = useReducer(reducer, null, () => load(KEY, seedNotes))

  useEffect(() => save(KEY, notes), [notes])

  const api = useMemo(
    () => ({
      notes,
      create: ({ title, tags, content }) => {
        const note = {
          id: crypto.randomUUID(),
          title,
          tags,
          content,
          lastEdited: new Date().toISOString(),
          isArchived: false,
        }
        dispatch({ type: 'add', note })
        return note
      },
      update: (id, changes) =>
        dispatch({ type: 'update', id, changes: { ...changes, lastEdited: new Date().toISOString() } }),
      setArchived: (id, isArchived) =>
        dispatch({ type: 'update', id, changes: { isArchived, lastEdited: new Date().toISOString() } }),
      remove: (id) => dispatch({ type: 'remove', id }),
    }),
    [notes],
  )

  return <NotesContext.Provider value={api}>{children}</NotesContext.Provider>
}

export function useNotes() {
  const ctx = useContext(NotesContext)
  if (!ctx) throw new Error('useNotes must be used within NotesProvider')
  return ctx
}
