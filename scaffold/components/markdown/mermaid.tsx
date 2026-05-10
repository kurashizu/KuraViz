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
        startOnLoad: false,
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

      const id = `mermaid-${Math.random().toString(36).slice(2, 10)}`

      try {
        const { svg } = await mermaid.default.render(id, chart)
        if (cancelled || !ref.current) return

        ref.current.innerHTML = svg

        const svgEl = ref.current.querySelector('svg')
        if (!svgEl) return

        svgEl.setAttribute('width', '100%')
        svgEl.setAttribute('height', '100%')
        svgEl.style.width = '100%'
        svgEl.style.height = '100%'

        if (!svgEl.getAttribute('viewBox')) {
          const w = parseFloat(svgEl.getAttribute('width') || '800')
          const h = parseFloat(svgEl.getAttribute('height') || '600')
          svgEl.setAttribute('viewBox', `0 0 ${w} ${h}`)
        }

        svgEl.querySelectorAll('text').forEach(t => {
          (t as SVGTextElement).style.fontSize = `${typography.body.fontSize}px`
        })
        svgEl.querySelectorAll('.root text').forEach(t => {
          (t as SVGTextElement).style.fontSize = `${typography.h2.fontSize}px`
          ;(t as SVGTextElement).style.fontWeight = '700'
        })
        svgEl.querySelectorAll('.section text').forEach(t => {
          (t as SVGTextElement).style.fontSize = `${typography.h3.fontSize}px`
        })
      } catch (e) {
        console.error('Mermaid render failed:', e)
      }
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
