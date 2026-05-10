'use client'

import { boxStyle } from '@/lib/utils'
import type { Box } from '@/lib/types'

interface AxisProps extends Box {
  xLabel?: string
  yLabel?: string
  xMin?: number
  xMax?: number
  yMin?: number
  yMax?: number
  children?: React.ReactNode
}

export function Axis({ xLabel, yLabel, children, ...box }: AxisProps) {
  return (
    <div style={{ ...boxStyle(box), position: 'relative' }}>
      <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0 }}>
        <line x1="40" y1="90%" x2="95%" y2="90%" stroke="#2E3144" strokeWidth={1} />
        <line x1="40" y1="10%" x2="40" y2="90%" stroke="#2E3144" strokeWidth={1} />
        {xLabel && (
          <text x="50%" y="98%" textAnchor="middle" fill="#6B7280" fontSize={12}>{xLabel}</text>
        )}
        {yLabel && (
          <text x="2%" y="50%" textAnchor="middle" fill="#6B7280" fontSize={12} transform="rotate(-90, 20, 50%)">{yLabel}</text>
        )}
      </svg>
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
        {children}
      </div>
    </div>
  )
}
