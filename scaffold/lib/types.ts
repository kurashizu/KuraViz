import type { ComponentType } from 'react'

export interface Box {
  x: number
  y: number
  w?: number
  h?: number
  z?: number
}

export interface NarrationEntry {
  script: string
  audioSrc?: string
}

export interface NarrationMap {
  [chapterId: string]: {
    [pageId: string]: NarrationEntry
  }
}

export interface PageDef {
  id: string
  component: ComponentType
}

export interface ChapterDef {
  id: string
  title: string
  pages: PageDef[]
}

export interface PlayerState {
  chapterIndex: number
  pageIndex: number
  isPlaying: boolean
}
