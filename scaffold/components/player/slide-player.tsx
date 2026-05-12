'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { chapters } from '@/content/chapters/index'
import type { NarrationMap } from '@/lib/types'
import { canvas } from '@/components/theme'
import { NarrationProvider } from './narration-context'
import { DebugOverlay } from './debug-overlay'
import { Text } from '@/components/text'
import { colors } from '@/components/theme'

export function SlidePlayer() {
  const [chapterIdx, setChapterIdx] = useState(0)
  const [pageIdx, setPageIdx] = useState(0)
  const [narration, setNarration] = useState<NarrationMap | null>(null)
  const [started, setStarted] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const params = useSearchParams()
  const record = params.get('record') === '1' || params.get('record') === 'true'

  // record mode: auto-start after narration loads (3s delay for PA/FFmpeg setup)
  useEffect(() => {
    if (record && narration) {
      setStarted(true)
      setTimeout(() => audioRef.current?.play().catch(() => {}), 3000)
    }
  }, [record, narration])

  const chapter = chapters[chapterIdx]
  const pageDef = chapter?.pages[pageIdx]
  const PageComponent = pageDef?.component

  const narrationEntry = narration
    ? (narration[chapter.id]?.[pageDef?.id ?? ''] ?? null)
    : null

  useEffect(() => {
    fetch('/narration.json')
      .then(r => r.json())
      .then(setNarration)
      .catch(() => setNarration({}))
  }, [])

  const navigate = useCallback((dir: 1 | -1) => {
    if (!chapter) return

    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }

    let c = chapterIdx
    let p = pageIdx

    if (dir === 1) {
      if (p + 1 < chapter.pages.length) {
        p++
      } else if (c + 1 < chapters.length) {
        c++
        p = 0
      } else {
        return // last page — stop, don't wrap
      }
    } else {
      if (p - 1 >= 0) {
        p--
      } else if (c - 1 >= 0) {
        c--
        p = chapters[c].pages.length - 1
      } else {
        c = chapters.length - 1
        p = chapters[c].pages.length - 1
      }
    }

    setChapterIdx(c)
    setPageIdx(p)
  }, [chapterIdx, pageIdx, chapter])

  // Log current slide in record mode
  useEffect(() => {
    if (!record || !narration) return
    console.log(`[record] ${chapter.id}/${pageDef?.id}`)
  }, [chapterIdx, pageIdx, record, narration])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowRight') navigate(1)
      if (e.key === 'ArrowLeft') navigate(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [navigate])

  // Audio lifecycle — create + onended for current page
  useEffect(() => {
    if (!narrationEntry?.audioSrc) return

    const audio = new Audio(narrationEntry.audioSrc)
    audioRef.current = audio

    audio.onended = () => {
      setTimeout(() => {
        const isLast = chapterIdx === chapters.length - 1 && pageIdx === chapter.pages.length - 1
        if (isLast) {
          if (record) console.log('[record] done')
          return
        }
        navigate(1)
      }, 500)
    }

    return () => {
      audio.pause()
      audio.onended = null
      if (audioRef.current === audio) audioRef.current = null
    }
  }, [chapterIdx, pageIdx, narrationEntry])

  // Playback — 500ms delay after page transition (once started)
  useEffect(() => {
    if (!started || !narrationEntry?.audioSrc) return
    const t = setTimeout(() => audioRef.current?.play().catch(() => {}), 500)
    return () => clearTimeout(t)
  }, [chapterIdx, pageIdx])

  if (!chapter || !pageDef) {
    return <div style={{ padding: 40 }}><Text variant="body" style={{ color: colors.semantic.error }}>No chapters loaded.</Text></div>
  }

  const totalPages = chapters.reduce((s, c) => s + c.pages.length, 0)
  const globalPageIdx = chapters
    .slice(0, chapterIdx)
    .reduce((s, c) => s + c.pages.length, 0) + pageIdx

  return (
    <NarrationProvider value={narrationEntry ?? { script: '' }}>
      <div
        style={{
          position: 'relative',
          width: canvas.width,
          height: canvas.height,
          transformOrigin: 'top left',
          overflow: 'hidden',
          background: colors.surface.bg,
        }}
        id="slide-viewport"
        onClick={() => {
          if (started) return
          setStarted(true)
          if (audioRef.current) audioRef.current.play().catch(() => {})
        }}
      >
        {PageComponent && <PageComponent />}

        {!started && !record && (
          <div
            style={{
              position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
              zIndex: 99999, cursor: 'pointer', background: 'rgba(0,0,0,0.6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column',
            }}
          >
            <div style={{ fontSize: 48, marginBottom: 16 }}>▶</div>
            <Text variant="h3" x={0} y={0} style={{ color: '#fff' }}>Click to start</Text>
          </div>
        )}

        <DebugOverlay
          info={{
            chapterId: chapter.id,
            pageId: pageDef.id,
            script: narrationEntry?.script ?? '',
            audioSrc: narrationEntry?.audioSrc ?? null,
          }}
          totalPages={totalPages}
          onNextPage={() => navigate(1)}
        />
        <ProgressBar current={globalPageIdx + 1} total={totalPages} />
        <Text variant="watermark" x={canvas.width - 280} y={canvas.height - 48} w={260} h={40} style={{ opacity: 0.25, textAlign: 'right' }}>
          kurashizu
        </Text>
      </div>

      <style>{`
        html, body {
          margin: 0;
          padding: 0;
          width: 100vw;
          height: 100vh;
          overflow: hidden;
        }
        * {
          user-select: none;
        }
      `}</style>

      <SlideResizer />
    </NarrationProvider>
  )
}

function ProgressBar({ current, total }: { current: number; total: number }) {
  const pct = total > 0 ? (current / total) * 100 : 0
  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        width: '100%',
        height: 3,
        background: colors.surface.border,
        zIndex: 9999,
      }}
    >
      <div
        style={{
          height: '100%',
          width: `${pct}%`,
          background: `linear-gradient(90deg, ${colors.brand.primary}, ${colors.brand.secondary})`,
          transition: 'width 0.3s ease',
        }}
      />
    </div>
  )
}

function SlideResizer() {
  useEffect(() => {
    function resize() {
      const el = document.getElementById('slide-viewport')
      if (!el) return
      const sw = 1920
      const sh = 1080
      const s = Math.min(window.innerWidth / sw, window.innerHeight / sh)
      const ox = (window.innerWidth - sw * s) / 2
      const oy = (window.innerHeight - sh * s) / 2
      el.style.transform = `translate(${ox}px, ${oy}px) scale(${s})`
    }
    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [])
  return null
}
