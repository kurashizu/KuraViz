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
    primary: colors.brand.primary,
    primaryLight: colors.mermaid.nodeBorder,
    section: colors.mermaid.section,
    leaf: colors.mermaid.leaf,
    leafBorder: colors.mermaid.leafBorder,
    text: colors.base.white,
    textMuted: colors.mermaid.leafText,
  }

  const handlers: Record<ChartType, () => void> = {
    mindmap() {
      svgEl.querySelectorAll('.root rect, .root ellipse, .root path, .root circle').forEach(el => {
        (el as SVGElement).style.fill = theme.primary
        ;(el as SVGElement).style.stroke = theme.primaryLight
      })
      svgEl.querySelectorAll('.section rect, .section ellipse, .section path, .section circle').forEach(el => {
        (el as SVGElement).style.fill = theme.section
        ;(el as SVGElement).style.stroke = theme.primary
      })
      svgEl.querySelectorAll('.node:not(.root):not(.section) rect, .node:not(.root):not(.section) circle').forEach(el => {
        (el as SVGElement).style.fill = theme.leaf
        ;(el as SVGElement).style.stroke = theme.leafBorder
      })
      svgEl.querySelectorAll('.mindmap-edge, .mindmap-arrow').forEach(el => {
        (el as SVGElement).style.stroke = theme.primary
      })
    },

    flowchart() {
      svgEl.querySelectorAll('.node rect, .node circle, .node polygon').forEach(el => {
        (el as SVGElement).style.fill = theme.section
        ;(el as SVGElement).style.stroke = theme.primary
      })
      svgEl.querySelectorAll('.node .label').forEach(el => {
        (el as HTMLElement).style.color = theme.text
      })
      svgEl.querySelectorAll('.edgePath path').forEach(el => {
        (el as SVGElement).style.stroke = theme.primary
        ;(el as SVGElement).style.strokeWidth = '2'
      })
      svgEl.querySelectorAll('.arrowheadPath').forEach(el => {
        (el as SVGElement).style.fill = theme.primary
      })
      svgEl.querySelectorAll('.edgeLabel').forEach(el => {
        (el as HTMLElement).style.background = theme.leaf
        ;(el as HTMLElement).style.color = theme.textMuted
      })
    },

    sequence() {
      svgEl.querySelectorAll('rect.actor').forEach(el => {
        (el as SVGElement).style.fill = theme.section
        ;(el as SVGElement).style.stroke = theme.primary
      })
      svgEl.querySelectorAll('text.actor').forEach(el => {
        (el as SVGElement).style.fill = theme.text
      })
      svgEl.querySelectorAll('.actor-line').forEach(el => {
        (el as SVGElement).style.stroke = theme.leafBorder
      })
      svgEl.querySelectorAll('.messageLine0, .messageLine1').forEach(el => {
        (el as SVGElement).style.stroke = theme.primary
      })
      svgEl.querySelectorAll('rect.rect').forEach(el => {
        (el as SVGElement).style.fill = `${theme.section}80`
        ;(el as SVGElement).style.stroke = theme.leafBorder
      })
      svgEl.querySelectorAll('.labelText').forEach(el => {
        (el as SVGElement).style.fill = theme.text
        ;(el as SVGElement).style.stroke = 'none'
      })
      svgEl.querySelectorAll('.labelBox').forEach(el => {
        (el as SVGElement).style.fill = theme.section
        ;(el as SVGElement).style.stroke = theme.primary
      })
      svgEl.querySelectorAll('.loopText, .loopText tspan').forEach(el => {
        (el as SVGElement).style.fill = theme.text
      })
      svgEl.querySelectorAll('.messageText').forEach(el => {
        (el as SVGElement).style.fill = theme.text
      })
      svgEl.querySelectorAll('marker path').forEach(el => {
        (el as SVGElement).style.fill = theme.primary
        ;(el as SVGElement).style.stroke = theme.primary
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
        (el as SVGElement).style.stroke = theme.leafBorder
      })
    },

    class() {
      svgEl.querySelectorAll('.classBox .outer').forEach(el => {
        (el as SVGElement).style.fill = theme.section
        ;(el as SVGElement).style.stroke = theme.primary
      })
      svgEl.querySelectorAll('.relation').forEach(el => {
        (el as SVGElement).style.stroke = theme.primary
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

      const type = detectType(chart)

      mermaid.default.initialize({
        startOnLoad: false,
        theme: 'dark',
        fontFamily: 'system-ui, sans-serif',
        fontSize: 20,
        sequence: {
          actorFontSize: 20,
          noteFontSize: 18,
          messageFontSize: 18,
          actorFontWeight: 600,
          boxTextMargin: 10,
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

        const origW = parseFloat(svgEl.getAttribute('width') || '800')
        const origH = parseFloat(svgEl.getAttribute('height') || '600')

        if (!svgEl.getAttribute('viewBox')) {
          svgEl.setAttribute('viewBox', `0 0 ${origW} ${origH}`)
        }

        svgEl.setAttribute('width', '100%')
        svgEl.setAttribute('height', '100%')
        svgEl.style.width = '100%'
        svgEl.style.height = '100%'
        svgEl.style.maxWidth = 'none'

        applyTheme(svgEl, type)
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
