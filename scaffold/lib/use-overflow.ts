'use client'

import { useEffect, useRef } from 'react'

export function useOverflow(deps: unknown[] = []) {
  const ref = useRef<HTMLDivElement>(null)
  const label = useRef('')

  useEffect(() => {
    const el = ref.current
    if (!el) return

    label.current = el.getAttribute('data-box-id') || 'cardbox'

    const check = () => {
      if (el.scrollHeight > el.clientHeight) {
        const overflow = el.scrollHeight - el.clientHeight
        console.warn(
          `[OVERFLOW] ${label.current}: content exceeds container by ${overflow}px (scroll=${el.scrollHeight}, client=${el.clientHeight})`
        )
      }
    }

    check()
    const mo = new MutationObserver(check)
    mo.observe(el, { childList: true, subtree: true, characterData: true })
    return () => mo.disconnect()
  }, deps)

  return ref
}
