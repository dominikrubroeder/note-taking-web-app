import { useState } from 'react'
import { Link, NavLink, Navigate, useParams } from 'react-router-dom'
import { useSettings } from '../context/SettingsContext'
import { useToast } from '../context/ToastContext'
import { useIsDesktop } from '../hooks/useMedia'
import Icon from '../components/Icon'
import sunIcon from '../assets/icons/icon-sun.svg'
import moonIcon from '../assets/icons/icon-moon.svg'
import systemIcon from '../assets/icons/icon-system-theme.svg'
import sansIcon from '../assets/icons/icon-font-sans-serif.svg'
import serifIcon from '../assets/icons/icon-font-serif.svg'
import monoIcon from '../assets/icons/icon-font-monospace.svg'
import fontIcon from '../assets/icons/icon-font.svg'
import chevron from '../assets/icons/icon-chevron-right.svg'
import backIcon from '../assets/icons/icon-arrow-left.svg'

const SECTIONS = {
  color: {
    label: 'Color Theme',
    icon: sunIcon,
    field: 'color',
    legend: 'Choose your color theme:',
    options: [
      { value: 'light', icon: sunIcon, title: 'Light Mode', desc: 'Pick a clean and classic light theme' },
      { value: 'dark', icon: moonIcon, title: 'Dark Mode', desc: 'Select a sleek and modern dark theme' },
      { value: 'system', icon: systemIcon, title: 'System', desc: 'Adapts to your device’s theme' },
    ],
  },
  font: {
    label: 'Font Theme',
    icon: fontIcon,
    field: 'font',
    legend: 'Choose your font theme:',
    options: [
      { value: 'sans', icon: sansIcon, title: 'Sans-serif', desc: 'Clean and modern, easy to read.' },
      { value: 'serif', icon: serifIcon, title: 'Serif', desc: 'Classic and elegant for a timeless feel.' },
      { value: 'mono', icon: monoIcon, title: 'Monospace', desc: 'Code-like, great for a technical vibe.' },
    ],
  },
}

export default function SettingsPage() {
  const { section } = useParams()
  const isDesktop = useIsDesktop()

  if (!section && isDesktop) return <Navigate to="/settings/color" replace />
  if (section && !SECTIONS[section]) return <Navigate to="/settings" replace />

  return (
    <div className="settings" data-detail={section ? 'open' : 'closed'}>
      <div className="settings__nav">
        <h1 className="page-head__title">Settings</h1>
        <nav aria-label="Settings">
          <ul>
            {Object.entries(SECTIONS).map(([key, s]) => (
              <li key={key}>
                <NavLink to={`/settings/${key}`} className="settings__link">
                  <Icon src={s.icon} />
                  {s.label}
                  <Icon src={chevron} className="settings__chevron" />
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      {section && <SettingsForm key={section} section={SECTIONS[section]} />}
    </div>
  )
}

function SettingsForm({ section }) {
  const settings = useSettings()
  const toast = useToast()
  const [value, setValue] = useState(settings[section.field])

  function submit(e) {
    e.preventDefault()
    settings.apply({ [section.field]: value })
    toast('Settings updated successfully!')
  }

  return (
    <form className="settings__panel" onSubmit={submit}>
      <Link to="/settings" className="back-link">
        <Icon src={backIcon} />
        Settings
      </Link>
      <h2 className="settings__title">{section.label}</h2>
      <fieldset className="options">
        <legend>{section.legend}</legend>
        {section.options.map((o) => (
          <label key={o.value} className="option">
            <span className="option__icon">
              <Icon src={o.icon} />
            </span>
            <span className="option__text">
              <span className="option__title">{o.title}</span>
              <span className="option__desc">{o.desc}</span>
            </span>
            <input
              type="radio"
              name={section.field}
              value={o.value}
              checked={value === o.value}
              onChange={() => setValue(o.value)}
            />
          </label>
        ))}
      </fieldset>
      <button type="submit" className="btn btn--primary" disabled={value === settings[section.field]}>
        Apply Changes
      </button>
    </form>
  )
}
