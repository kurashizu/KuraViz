'use client'

import { useSearchParams } from 'next/navigation'
import { Text } from '@/components/text'

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
        zIndex: 99999,
        maxWidth: 420,
        boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
      }}
    >
      <Text variant="caption" style={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, opacity: 0.8, color: '#fff', marginBottom: 4, fontSize: 11 }}>
        Debug Mode
      </Text>
      <Text variant="caption" style={{ color: '#fff', display: 'block' }}>Chapter: {info.chapterId}</Text>
      <Text variant="caption" style={{ color: '#fff', display: 'block' }}>Page: {info.pageId}</Text>
      {info.audioSrc && (
        <Text variant="caption" style={{ color: '#fff', display: 'block' }}>Audio: {info.audioSrc}</Text>
      )}
      <div style={{ marginTop: 4, borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: 4 }}>
        <Text variant="caption" style={{ color: '#fff', display: 'block' }}>
          Script: {info.script || '(none)'}
        </Text>
      </div>
    </div>
  )
}
