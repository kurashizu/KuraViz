'use client'

import { useEffect, useRef } from 'react'
import mermaid from 'mermaid'

mermaid.initialize({
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
  sequence: { showSequenceNumbers: true },
  mindmap: { padding: 16 },
})

interface MermaidProps {
  chart: string
}

export function Mermaid({ chart }: MermaidProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return
    const el = ref.current
    el.innerHTML = ''
    const id = 'mermaid-' + Math.random().toString(36).slice(2, 8)
    el.innerHTML = `<div class="${id}">${chart}</div>`
    mermaid.run({ nodes: [{ id, node: el.querySelector(`.${id}`) }] as any[] }).catch(() => {})
  }, [chart])

  return <div ref={ref} style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }} />
}
