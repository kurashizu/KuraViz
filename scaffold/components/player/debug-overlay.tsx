'use client'

import { useSearchParams } from 'next/navigation'

interface DebugInfo {
  chapterId: string
  pageId: string
  script: string
  audioSrc: string | null
}

export function DebugOverlay({ info }: { info: DebugInfo }) {
  const params = useSearchParams()
  const debug = params.get('debug') === '1'

  if (!debug) return null

  return (
    <div
      style={{
        position: 'fixed',
        top: 12,
        right: 12,
        background: 'rgba(239,68,68,0.9)',
        color: '#fff',
        padding: '12px 16px',
        borderRadius: 8,
        fontSize: 12,
        fontFamily: 'monospace',
        lineHeight: 1.6,
        zIndex: 99999,
        maxWidth: 420,
        boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
      }}
    >
      <div style={{ fontWeight: 700, marginBottom: 4, fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, opacity: 0.8 }}>
        Debug Mode
      </div>
      <div>Chapter: {info.chapterId}</div>
      <div>Page: {info.pageId}</div>
      {info.audioSrc && <div>Audio: {info.audioSrc}</div>}
      <div style={{ marginTop: 4, borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: 4 }}>
        Script: {info.script || '(none)'}
      </div>
    </div>
  )
}
