'use client'

import { useEffect, useRef } from 'react'
import { boxStyle } from '@/lib/utils'
import type { Box } from '@/lib/types'

interface MermaidProps extends Box {
  chart: string
}

export function Mermaid({ chart, ...box }: MermaidProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let cancelled = false
    async function render() {
      const mermaid = await import('mermaid')
      if (cancelled || !ref.current) return
      mermaid.default.initialize({
        theme: 'dark',
        themeVariables: {
          primaryColor: '#6366F1',
          primaryTextColor: '#F1F3F9',
          primaryBorderColor: '#2E3144',
          lineColor: '#2E3144',
          secondaryColor: '#1A1D2B',
          tertiaryColor: '#0F1117',
          fontSize: '16px',
        },
        mindmap: { padding: 16 },
      })
      const id = 'mermaid-' + Math.random().toString(36).slice(2, 8)
      if (ref.current) {
        ref.current.innerHTML = `<div class="${id}">${chart}</div>`
        mermaid.default.run({ nodes: [{ id, node: ref.current.querySelector(`.${id}`) }] as any[] }).catch(() => {})
      }
    }
    render()
    return () => { cancelled = true }
  }, [chart])

  return <div ref={ref} style={{ ...boxStyle(box), display: 'flex', alignItems: 'center', justifyContent: 'center' }} />
}
