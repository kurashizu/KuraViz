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
      await mermaid.default.run({ nodes: [el] }).catch(() => {})
      // force ALL text in rendered svg to match theme
      const svg = ref.current.querySelector('svg')
      if (svg) {
        svg.querySelectorAll('text, tspan, [class*="node"] > text, [class*="leaf"] > text, [class*="root"] > text').forEach(t => {
          t.setAttribute('font-size', String(typography.body.fontSize))
        })
        // root node text gets bigger
        svg.querySelectorAll('[class*="root"] text, [class*="section"] text').forEach(t => {
          t.setAttribute('font-size', String(typography.h2.fontSize))
          t.setAttribute('font-weight', '700')
        })
      }
    }
    render()
    return () => { cancelled = true }
  }, [chart])

  return <div ref={ref} style={{ ...boxStyle(box), display: 'flex', alignItems: 'center', justifyContent: 'center' }} />
}
