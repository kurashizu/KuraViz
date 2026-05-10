'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState, useRef } from 'react'
import { Text } from '@/components/text'
import { colors } from '@/components/theme'
import { scanOverlaps } from '@/lib/bbox'

interface DebugInfo {
  chapterId: string
  pageId: string
  script: string
  audioSrc: string | null
}

function logToFile(collisions: ReturnType<typeof scanOverlaps>, info: DebugInfo) {
  const lines = [
    `Page: ${info.chapterId}/${info.pageId}`,
    ...collisions.map(c => `  ${c.a}  vs  ${c.b}`),
  ]
  fetch('/api/log', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ lines }),
  }).catch(() => {})
}

export function DebugOverlay({ info }: { info: DebugInfo }) {
  const params = useSearchParams()
  const debug = params.get('debug') === '1'
  const [collisions, setCollisions] = useState<ReturnType<typeof scanOverlaps>>([])
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!debug) return
    const vp = document.getElementById('slide-viewport')
    if (!vp) return

    let raf: number
    let prev = ''
    let stable = 0

    function poll() {
      const snapshot = Array.from(vp!.children)
        .filter(el => getComputedStyle(el).position === 'absolute')
        .map(el => {
          const r = el.getBoundingClientRect()
          return `${r.left},${r.top},${r.width},${r.height}`
        }).join('|')

      if (snapshot === prev) {
        stable++
        if (stable >= 3) {
          const result = scanOverlaps(vp!)
          setCollisions(result)
          if (result.length > 0) logToFile(result, info)
          return
        }
      } else {
        stable = 0
        prev = snapshot
      }
      raf = requestAnimationFrame(poll)
    }

    raf = requestAnimationFrame(poll)
    return () => cancelAnimationFrame(raf)
  }, [debug, info.chapterId, info.pageId])

  if (!debug) return null

  return (
    <>
      {collisions.length > 0 && (
        <div
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0,
            background: 'rgba(239,68,68,0.85)',
            color: colors.base.white,
            padding: '8px 16px',
            zIndex: 999999,
            textAlign: 'center',
            boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
            borderBottom: '3px solid #FFD700',
          }}
        >
          <Text variant="body" style={{ color: '#FFD700', fontWeight: 700 }}>
            COLLISION DETECTED: {collisions.length} overlap{collisions.length > 1 ? 's' : ''}
          </Text>
        </div>
      )}

      <div
        ref={panelRef}
        style={{
          position: 'fixed',
          top: 12,
          right: 12,
          background: 'rgba(239,68,68,0.55)',
          color: colors.base.white,
          padding: '10px 14px',
          borderRadius: 8,
          zIndex: 99999,
          maxWidth: 420,
          boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
        }}
      >
        <Text variant="caption" style={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, opacity: 0.8, color: colors.base.white, marginBottom: 2, fontSize: 11 }}>
          Debug Mode
        </Text>
        <Text variant="caption" style={{ color: colors.base.white, display: 'block' }}>Chapter: {info.chapterId}</Text>
        <Text variant="caption" style={{ color: colors.base.white, display: 'block' }}>Page: {info.pageId}</Text>
        {info.audioSrc && (
          <Text variant="caption" style={{ color: colors.base.white, display: 'block' }}>Audio: {info.audioSrc}</Text>
        )}
        <div style={{ marginTop: 4, borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: 4 }}>
          <Text variant="caption" style={{ color: colors.base.white, display: 'block' }}>
            Script: {info.script || '(none)'}
          </Text>
        </div>
        {collisions.length > 0 && (
          <div style={{ marginTop: 4, borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: 4 }}>
            <Text variant="caption" style={{ color: '#FFD700', display: 'block', fontWeight: 700, fontSize: 11 }}>
              Collisions:
            </Text>
            {collisions.map((c, i) => (
              <Text key={i} variant="caption" style={{ color: '#FFD700', display: 'block', fontSize: 10 }}>
                {c.a}  vs  {c.b}
              </Text>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
