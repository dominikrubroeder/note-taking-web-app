import { useId } from 'react'
import { useNavigate } from 'react-router-dom'
import Icon from './Icon'
import searchIcon from '../assets/icons/icon-search.svg'
import { useScope } from '../hooks/useScope'
import { useIsDesktop } from '../hooks/useMedia'

export default function SearchBox({ className = '' }) {
  const id = useId()
  const navigate = useNavigate()
  const { kind, q } = useScope()
  const isDesktop = useIsDesktop()
  const value = kind === 'search' ? q : ''

  function onChange(e) {
    const next = e.target.value
    if (next) navigate(`/search?q=${encodeURIComponent(next)}`, { replace: true })
    else navigate(isDesktop ? '/' : '/search', { replace: true })
  }

  return (
    <div className={`search ${className}`} role="search">
      <label htmlFor={id} className="sr-only">
        Search notes by title, content, or tags
      </label>
      <Icon src={searchIcon} className="search__icon" />
      <input
        id={id}
        type="search"
        value={value}
        onChange={onChange}
        placeholder="Search by title, content, or tags…"
        autoComplete="off"
      />
    </div>
  )
}
