import { useSyncExternalStore } from 'react'

export function useMedia(query) {
  return useSyncExternalStore(
    (cb) => {
      const mq = matchMedia(query)
      mq.addEventListener('change', cb)
      return () => mq.removeEventListener('change', cb)
    },
    () => matchMedia(query).matches,
  )
}

export const useIsDesktop = () => useMedia('(min-width: 1024px)')
