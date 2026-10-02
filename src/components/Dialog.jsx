import { useEffect, useId, useRef } from 'react'
import Icon from './Icon'

// Native <dialog>: gives focus trapping, Esc to close, and inert background for free.
export default function Dialog({ icon, title, children, confirmLabel, tone = 'primary', onConfirm, onClose }) {
  const ref = useRef(null)
  const titleId = useId()

  useEffect(() => {
    const el = ref.current
    el.showModal()
    return () => el.close()
  }, [])

  return (
    <dialog
      ref={ref}
      className="dialog"
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
    >
      <div className="dialog__body">
        <span className="dialog__icon">
          <Icon src={icon} />
        </span>
        <div>
          <h2 id={titleId} className="dialog__title">
            {title}
          </h2>
          <p className="dialog__text">{children}</p>
        </div>
      </div>
      <div className="dialog__footer">
        <button type="button" className="btn btn--secondary" onClick={onClose} autoFocus>
          Cancel
        </button>
        <button type="button" className={`btn btn--${tone}`} onClick={onConfirm}>
          {confirmLabel}
        </button>
      </div>
    </dialog>
  )
}
