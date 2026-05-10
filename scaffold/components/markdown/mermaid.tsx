'use client'

import { useEffect, useRef } from 'react'
import { boxStyle } from '@/lib/utils'
import type { Box } from '@/lib/types'
import { colors, typography } from '@/components/theme'

interface MermaidProps extends Box {
  chart: string
}

type ChartType = 'mindmap' | 'flowchart' | 'sequence' | 'gantt' | 'class'

function detectType(chart: string): ChartType {
  const s = chart.trimStart()
  if (s.startsWith('mindmap')) return 'mindmap'
  if (s.startsWith('sequenceDiagram')) return 'sequence'
  if (s.startsWith('gantt')) return 'gantt'
  if (s.startsWith('classDiagram')) return 'class'
  return 'flowchart'
}

function applyTheme(svgEl: SVGSVGElement, type: ChartType) {
  const theme = {
    primary: colors.mermaid.node,
    primaryLight: colors.mermaid.nodeBorder,
    nodeBg: colors.mermaid.section,
    nodeBgDeep: colors.mermaid.leaf,
    border: colors.mermaid.sectionBorder,
    text: colors.base.white,
    textMuted: colors.mermaid.leafText,
    line: colors.brand.primary,
  }

  // all types: force font size on text elements
  svgEl.querySelectorAll('text').forEach(t => {
    (t as SVGTextElement).style.fontSize = `${typography.body.fontSize}px`
  })

  const handlers: Record<ChartType, () => void> = {
    mindmap() {
      svgEl.querySelectorAll('.root text').forEach(t => {
        (t as SVGTextElement).style.fontSize = `${typography.h2.fontSize}px`
        ;(t as SVGTextElement).style.fontWeight = '700'
      })
      svgEl.querySelectorAll('.section text').forEach(t => {
        (t as SVGTextElement).style.fontSize = `${typography.h3.fontSize}px`
      })
      svgEl.querySelectorAll('rect, path').forEach(el => {
        const e = el as SVGElement
        const c = (el.className?.toString() || '') + ' ' + (el.closest?.('.root') ? 'root' : '') + ' ' + (el.closest?.('.section') ? 'section' : '')
        if (c.includes('root')) { e.style.fill = theme.primary; e.style.stroke = theme.primaryLight }
        else if (c.includes('section')) { e.style.fill = theme.nodeBg; e.style.stroke = theme.border }
        else { e.style.fill = theme.nodeBgDeep; e.style.stroke = theme.border }
      })
      svgEl.querySelectorAll('path:not([class*="node"])').forEach(el => {
        const d = (el as SVGElement).getAttribute('d') || ''
        if (d.match(/[QCLM]/)) { (el as SVGElement).style.stroke = theme.line; (el as SVGElement).style.strokeWidth = '2' }
      })
    },

    flowchart() {
      svgEl.querySelectorAll('.node rect, .node circle, .node polygon').forEach(el => {
        (el as SVGElement).style.fill = theme.nodeBg
        ;(el as SVGElement).style.stroke = theme.primary
      })
      svgEl.querySelectorAll('.node .label').forEach(el => {
        (el as HTMLElement).style.color = theme.text
      })
      svgEl.querySelectorAll('.edgePath path').forEach(el => {
        (el as SVGElement).style.stroke = theme.line
        ;(el as SVGElement).style.strokeWidth = '2'
      })
      svgEl.querySelectorAll('.arrowheadPath').forEach(el => {
        (el as SVGElement).style.fill = theme.line
      })
      svgEl.querySelectorAll('.edgeLabel').forEach(el => {
        (el as HTMLElement).style.background = theme.nodeBgDeep
        ;(el as HTMLElement).style.color = theme.textMuted
      })
    },

    sequence() {
      svgEl.querySelectorAll('.actor').forEach(el => {
        (el as SVGElement).style.fill = theme.nodeBg
        ;(el as SVGElement).style.stroke = theme.primary
      })
      svgEl.querySelectorAll('.messageLine0, .messageLine1').forEach(el => {
        (el as SVGElement).style.stroke = theme.line
      })
      svgEl.querySelectorAll('.labelBox').forEach(el => {
        (el as SVGElement).style.fill = theme.nodeBgDeep
        ;(el as SVGElement).style.stroke = theme.border
      })
      svgEl.querySelectorAll('.loopLine').forEach(el => {
        (el as SVGElement).style.stroke = theme.border
      })
    },

    gantt() {
      svgEl.querySelectorAll('.task').forEach(el => {
        (el as SVGElement).style.fill = theme.primary
        ;(el as SVGElement).style.stroke = theme.primaryLight
      })
      svgEl.querySelectorAll('.taskText, .taskTextOutsideRight, .taskTextOutsideLeft').forEach(el => {
        (el as SVGElement).style.fill = theme.text
      })
      svgEl.querySelectorAll('.grid .tick line').forEach(el => {
        (el as SVGElement).style.stroke = theme.border
      })
    },

    class() {
      svgEl.querySelectorAll('.classBox .outer').forEach(el => {
        (el as SVGElement).style.fill = theme.nodeBg
        ;(el as SVGElement).style.stroke = theme.primary
      })
      svgEl.querySelectorAll('.relation').forEach(el => {
        (el as SVGElement).style.stroke = theme.line
      })
    },
  }

  handlers[type]()
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
          primaryColor: colors.mermaid.node,
          primaryTextColor: colors.base.white,
          primaryBorderColor: colors.mermaid.nodeBorder,
          secondaryColor: colors.mermaid.section,
          secondaryTextColor: colors.text.primary,
          secondaryBorderColor: colors.mermaid.sectionBorder,
          tertiaryColor: colors.mermaid.leaf,
          tertiaryTextColor: colors.mermaid.leafText,
          tertiaryBorderColor: colors.mermaid.leafBorder,
          lineColor: colors.brand.primary,
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

        applyTheme(svgEl, detectType(chart))
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
