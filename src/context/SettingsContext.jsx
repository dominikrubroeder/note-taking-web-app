import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { load, save } from '../lib/storage'

// v2: v1 auto-saved the old 'light' default, which would pin existing users to light.
const KEY = 'notes-app:settings:v2'
const SettingsContext = createContext(null)

function useSystemDark() {
  const [dark, setDark] = useState(() => matchMedia('(prefers-color-scheme: dark)').matches)
  useEffect(() => {
    const mq = matchMedia('(prefers-color-scheme: dark)')
    const onChange = (e) => setDark(e.matches)
    // Re-read on focus too: some browsers skip `change` while the tab is in the background.
    const resync = () => setDark(mq.matches)
    mq.addEventListener('change', onChange)
    window.addEventListener('focus', resync)
    document.addEventListener('visibilitychange', resync)
    return () => {
      mq.removeEventListener('change', onChange)
      window.removeEventListener('focus', resync)
      document.removeEventListener('visibilitychange', resync)
    }
  }, [])
  return dark
}

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(() => ({ color: 'system', font: 'sans', ...load(KEY, {}) }))
  const systemDark = useSystemDark()

  useEffect(() => {
    const dark = settings.color === 'dark' || (settings.color === 'system' && systemDark)
    document.documentElement.dataset.theme = dark ? 'dark' : 'light'
    document.documentElement.dataset.font = settings.font
    document.querySelector('meta[name=theme-color]')?.setAttribute('content', dark ? '#191b25' : '#f3f5f8')
  }, [settings, systemDark])

  const value = useMemo(
    () => ({ ...settings, apply: (changes) =>
        setSettings((s) => {
          const next = { ...s, ...changes }
          save(KEY, next) // persist only explicit choices so 'system' stays the default
          return next
        }) }),
    [settings],
  )
  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
}

export function useSettings() {
  return useContext(SettingsContext)
}
