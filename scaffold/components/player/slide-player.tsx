'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { chapters } from '@/content/chapters/index'
import type { NarrationMap } from '@/lib/types'
import { canvas } from '@/config/canvas'
import { NarrationProvider } from './narration-context'
import { DebugOverlay } from './debug-overlay'
import { ProgressBar } from './progress-bar'
import { NavIndicator } from './nav-indicator'

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
    return <div style={{ padding: 40, color: '#EF4444' }}>No chapters loaded.</div>
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
          background: '#0F1117',
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
        />
        <ProgressBar current={globalPageIdx + 1} total={totalPages} />
        <NavIndicator
          chapterTitle={chapter.title}
          chapterIndex={chapterIdx}
          pageIndex={pageIdx}
          totalPages={chapter.pages.length}
        />
      </div>

      <style>{`
        html, body {
          margin: 0;
          padding: 0;
          width: 100vw;
          height: 100vh;
          background: #000;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        #slide-viewport {
          transform: scale(var(--slide-scale, 1));
        }
      `}</style>

      <SlideResizer />
    </NarrationProvider>
  )
}

function SlideResizer() {
  useEffect(() => {
    function resize() {
      const el = document.getElementById('slide-viewport')
      if (!el) return
      const sw = 1920
      const sh = 1080
      const sx = window.innerWidth / sw
      const sy = window.innerHeight / sh
      const s = Math.min(sx, sy)
      el.style.setProperty('--slide-scale', String(s))
    }
    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [])
  return null
}
