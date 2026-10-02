import { NavLink, useLocation } from 'react-router-dom'
import { useNotes } from '../context/NotesContext'
import { allTags } from '../lib/tags'
import Icon from './Icon'
import Logo from './Logo'
import homeIcon from '../assets/icons/icon-home.svg'
import archiveIcon from '../assets/icons/icon-archive.svg'
import tagIcon from '../assets/icons/icon-tag.svg'
import chevron from '../assets/icons/icon-chevron-right.svg'

export default function Sidebar() {
  const { notes } = useNotes()
  const tags = allTags(notes)
  const { pathname } = useLocation()

  // /notes/:id and /search belong to "All Notes", so match on path prefixes by hand.
  const allActive = pathname === '/' || pathname.startsWith('/notes') || pathname.startsWith('/search')

  return (
    <aside className="sidebar">
      <NavLink to="/" className="sidebar__logo" aria-label="Notes home">
        <Logo />
      </NavLink>
      <nav aria-label="Main">
        <ul className="nav-list">
          <li>
            <NavLink to="/" className={`nav-link${allActive ? ' active' : ''}`}>
              <Icon src={homeIcon} />
              All Notes
              <Icon src={chevron} className="nav-link__chevron" />
            </NavLink>
          </li>
          <li>
            <NavLink to="/archived" className="nav-link">
              <Icon src={archiveIcon} />
              Archived Notes
              <Icon src={chevron} className="nav-link__chevron" />
            </NavLink>
          </li>
        </ul>
        <h2 className="sidebar__heading">Tags</h2>
        <ul className="nav-list">
          {tags.map((t) => (
            <li key={t}>
              <NavLink to={`/tags/${encodeURIComponent(t)}`} className="nav-link">
                <Icon src={tagIcon} />
                {t}
                <Icon src={chevron} className="nav-link__chevron" />
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}
