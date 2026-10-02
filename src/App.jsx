import { Route, Routes } from 'react-router-dom'
import { NotesProvider } from './context/NotesContext'
import { SettingsProvider } from './context/SettingsContext'
import { ToastProvider } from './context/ToastContext'
import Shell from './components/Shell'
import NotesView from './pages/NotesView'
import SettingsPage from './pages/SettingsPage'
import TagsPage from './pages/TagsPage'

export default function App() {
  return (
    <SettingsProvider>
      <NotesProvider>
        <ToastProvider>
          <Shell>
            <Routes>
              <Route path="/settings/:section?" element={<SettingsPage />} />
              <Route path="/tags" element={<TagsPage />} />
              <Route path="*" element={<NotesView />} />
            </Routes>
          </Shell>
        </ToastProvider>
      </NotesProvider>
    </SettingsProvider>
  )
}
