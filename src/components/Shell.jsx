import { Link, useLocation } from 'react-router-dom'
import { useScope } from '../hooks/useScope'
import { scopeTitle } from '../lib/titles'
import BottomNav from './BottomNav'
import Icon from './Icon'
import Logo from './Logo'
import SearchBox from './SearchBox'
import Sidebar from './Sidebar'
import settingsIcon from '../assets/icons/icon-settings.svg'

export default function Shell({ children }) {
  const scope = useScope()
  const { pathname } = useLocation()
  const onSettings = pathname.startsWith('/settings')
  const title = onSettings ? 'Settings' : scopeTitle(scope)

  return (
    <div className="app">
      <Sidebar />
      <div className="app__main">
        <header className="topbar">
          <Link to="/" className="topbar__logo" aria-label="Notes home">
            <Logo />
          </Link>
          <p className="topbar__title" aria-hidden="true">
            {title}
          </p>
          <SearchBox className="search--topbar" />
          <Link to="/settings" className="icon-btn" aria-label="Settings">
            <Icon src={settingsIcon} />
          </Link>
        </header>
        <main className="app__content">{children}</main>
        <BottomNav />
      </div>
    </div>
  )
}
