'use client'

import { createContext, useContext } from 'react'
import type { NarrationEntry } from '@/lib/types'

const NarrationContext = createContext<NarrationEntry | null>(null)

export const NarrationProvider = NarrationContext.Provider

export function useNarration(): NarrationEntry {
  const ctx = useContext(NarrationContext)
  if (!ctx) return { script: '' }
  return ctx
}
