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

interface DebugOverlayProps {
  info: DebugInfo
  totalPages: number
  onNextPage?: () => void
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

export function DebugOverlay({ info, totalPages, onNextPage }: DebugOverlayProps) {
  const params = useSearchParams()
  const mode = params.get('debug')
  const debug = mode === '1' || mode === 'true'
  const auto = mode === 'auto'
  const [collisions, setCollisions] = useState<ReturnType<typeof scanOverlaps>>([])
  const [autoDone, setAutoDone] = useState(false)
  const [autoPage, setAutoPage] = useState(0)
  const scannedRef = useRef(false)
  const panelRef = useRef<HTMLDivElement>(null)

  // scan once after DOM stabilizes
  useEffect(() => {
    if (!debug && !auto) return
    const vp = document.getElementById('slide-viewport')
    if (!vp) return

    scannedRef.current = false
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
          scannedRef.current = true
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
  }, [debug, auto, info.chapterId, info.pageId])

  // auto mode: advance after scan completes (poll scannedRef)
  useEffect(() => {
    if (!auto || autoDone) return
    if (autoPage >= totalPages) {
      setAutoDone(true)
      fetch('/api/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scanComplete: true, total: totalPages, hasCollisions: collisions.length > 0 }),
      }).catch(() => {})
      return
    }
    const interval = setInterval(() => {
      if (scannedRef.current) {
        scannedRef.current = false
        clearInterval(interval)
        setAutoPage(p => p + 1)
        onNextPage?.()
      }
    }, 200)
    return () => clearInterval(interval)
  }, [auto, autoPage, totalPages, autoDone, onNextPage, collisions])

  // auto mode: clear log on mount
  useEffect(() => {
    if (!auto) return
    fetch('/api/log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clear: true }),
    }).catch(() => {})
  }, [auto])

  if (!debug && !auto) return null

  const autoSummary = autoDone ? (
    <Text variant="caption" style={{ color: '#22C55E', display: 'block', fontWeight: 700 }}>
      Auto-scan complete: {totalPages} pages checked
    </Text>
  ) : auto ? (
    <Text variant="caption" style={{ color: colors.base.white, display: 'block' }}>
      Auto-scan: {autoPage}/{totalPages}
    </Text>
  ) : null

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

      {autoDone && (
        <div
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0,
            background: 'rgba(34,197,94,0.85)',
            color: colors.base.white,
            padding: '8px 16px',
            zIndex: 999999,
            textAlign: 'center',
            boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
          }}
        >
          <Text variant="body" style={{ color: colors.base.white, fontWeight: 700 }}>
            Auto-scan complete — {totalPages} pages, all clean
          </Text>
        </div>
      )}

      {collisions.length > 0 || auto ? (
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
          {autoSummary}
          {!autoDone && (
            <>
              <Text variant="caption" style={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, opacity: 0.8, color: colors.base.white, marginBottom: 2, fontSize: 11 }}>
                {auto ? 'Auto Debug' : 'Debug Mode'}
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
            </>
          )}
        </div>
      ) : null}
    </>
  )
}
