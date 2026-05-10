'use client'

import { useEffect, useRef } from 'react'
import { boxStyle } from '@/lib/utils'
import type { Box } from '@/lib/types'
import { typography } from '@/components/theme'

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
          fontSize: `${typography.body.fontSize}px`,
        },
        mindmap: { padding: 16 },
      })
      const el = document.createElement('div')
      el.textContent = chart
      ref.current.append(el)
      mermaid.default.run({ nodes: [el] }).catch(() => {})
    }
    render()
    return () => { cancelled = true }
  }, [chart])

  return <div ref={ref} style={{ ...boxStyle(box), display: 'flex', alignItems: 'center', justifyContent: 'center' }} />
}
