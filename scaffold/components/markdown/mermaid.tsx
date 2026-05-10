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
        },
        mindmap: { padding: 16 },
      })
      const el = document.createElement('div')
      el.textContent = chart
      ref.current.append(el)
      await mermaid.default.run({ nodes: [el] }).catch(() => {})

      const svg = ref.current.querySelector('svg')
      if (!svg) return

      // force SVG to fill container
      svg.setAttribute('width', '100%')
      svg.setAttribute('height', '100%')
      svg.style.width = '100%'
      svg.style.height = '100%'
      svg.style.maxWidth = '100%'
      svg.style.maxHeight = '100%'

      // create viewBox from original dimensions if missing
      if (!svg.getAttribute('viewBox')) {
        const w = parseFloat(svg.getAttribute('width') || '800')
        const h = parseFloat(svg.getAttribute('height') || '600')
        svg.setAttribute('viewBox', `0 0 ${w} ${h}`)
        svg.removeAttribute('width')
        svg.removeAttribute('height')
      }

      // override inline font-size on all text elements
      svg.querySelectorAll('text').forEach(t => {
        (t as SVGTextElement).style.fontSize = `${typography.body.fontSize}px`
      })
      svg.querySelectorAll('.root text').forEach(t => {
        (t as SVGTextElement).style.fontSize = `${typography.h2.fontSize}px`
        ;(t as SVGTextElement).style.fontWeight = '700'
      })
      svg.querySelectorAll('.section text').forEach(t => {
        (t as SVGTextElement).style.fontSize = `${typography.h3.fontSize}px`
      })
    }
    render()
    return () => { cancelled = true }
  }, [chart])

  return (
    <div
      ref={ref}
      style={{ ...boxStyle(box), display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}
    />
  )
}
