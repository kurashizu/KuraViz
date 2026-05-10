'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
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
  const audioRef = useRef<HTMLAudioElement | null>(null)

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
        c = 0
        p = 0
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

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowRight') navigate(1)
      if (e.key === 'ArrowLeft') navigate(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [navigate])

  useEffect(() => {
    if (!narrationEntry?.audioSrc) return

    const audio = new Audio(narrationEntry.audioSrc)
    audioRef.current = audio
    audio.play().catch(() => {})
    audio.onended = () => navigate(1)

    return () => {
      audio.pause()
      audio.onended = null
      if (audioRef.current === audio) audioRef.current = null
    }
  }, [chapterIdx, pageIdx, narrationEntry])

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
      >
        {PageComponent && <PageComponent />}

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
