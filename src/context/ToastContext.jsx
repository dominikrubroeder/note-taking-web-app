import { createContext, useCallback, useContext, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../components/Icon'
import checkIcon from '../assets/icons/icon-checkmark.svg'
import crossIcon from '../assets/icons/icon-cross.svg'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null)
  const timer = useRef()

  const dismiss = useCallback(() => setToast(null), [])
  const show = useCallback((message, link) => {
    clearTimeout(timer.current)
    setToast({ message, link, id: Date.now() })
    timer.current = setTimeout(() => setToast(null), 5000)
  }, [])

  return (
    <ToastContext.Provider value={show}>
      {children}
      {/* live region stays mounted so screen readers pick up the injected message */}
      <div className="toast-region" role="status" aria-live="polite">
        {toast && (
          <div className="toast" key={toast.id}>
            <Icon src={checkIcon} className="toast__icon" />
            <span>{toast.message}</span>
            {toast.link && (
              <Link to={toast.link.to} className="toast__link" onClick={dismiss}>
                {toast.link.label}
              </Link>
            )}
            <button type="button" className="toast__close" onClick={dismiss} aria-label="Dismiss notification">
              <Icon src={crossIcon} />
            </button>
          </div>
        )}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  return useContext(ToastContext)
}
