// Masks the SVG so it inherits `currentColor` — one asset works in light and dark themes.
export default function Icon({ src, className = '', size }) {
  return (
    <span
      aria-hidden="true"
      className={`icon ${className}`}
      style={{ '--icon': `url("${src}")`, ...(size && { width: size, height: size }) }}
    />
  )
}
