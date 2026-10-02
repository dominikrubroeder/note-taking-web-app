import { NavLink, useLocation } from 'react-router-dom'
import Icon from './Icon'
import homeIcon from '../assets/icons/icon-home.svg'
import searchIcon from '../assets/icons/icon-search.svg'
import archiveIcon from '../assets/icons/icon-archive.svg'
import tagIcon from '../assets/icons/icon-tag.svg'
import settingsIcon from '../assets/icons/icon-settings.svg'

const ITEMS = [
  { to: '/', label: 'Home', icon: homeIcon, match: (p) => p === '/' || p.startsWith('/notes') },
  { to: '/search', label: 'Search', icon: searchIcon },
  { to: '/archived', label: 'Archived', icon: archiveIcon },
  { to: '/tags', label: 'Tags', icon: tagIcon },
  { to: '/settings', label: 'Settings', icon: settingsIcon },
]

export default function BottomNav() {
  const { pathname } = useLocation()
  return (
    <nav className="bottom-nav" aria-label="Main">
      <ul>
        {ITEMS.map(({ to, label, icon, match }) => (
          <li key={to}>
            <NavLink
              to={to}
              className={({ isActive }) => `bottom-nav__link${(match ? match(pathname) : isActive) ? ' active' : ''}`}
            >
              <Icon src={icon} />
              <span>{label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
