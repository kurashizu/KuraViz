'use client'

import { boxStyle } from '@/lib/utils'
import type { Box } from '@/lib/types'

interface SVGProps extends Box {
  children: React.ReactNode
  viewBox?: string
}

export function SVG({ children, viewBox, ...box }: SVGProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={viewBox ?? `0 0 ${box.w ?? 100} ${box.h ?? 100}`}
      style={{
        ...boxStyle(box),
        position: 'absolute',
      }}
    >
      {children}
    </svg>
  )
}
