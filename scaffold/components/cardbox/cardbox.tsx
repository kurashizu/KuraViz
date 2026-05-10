'use client'

import { boxStyle, cn } from '@/lib/utils'
import type { Box } from '@/lib/types'

interface CardboxProps extends Box {
  children: React.ReactNode
  variant?: 'default' | 'elevated' | 'bordered'
  className?: string
}

export function Cardbox({ children, variant = 'default', className, ...box }: CardboxProps) {
  return (
    <div
      style={boxStyle(box)}
      className={cn(
        'rounded-xl overflow-hidden',
        variant === 'default' && 'bg-surface-card border border-surface-border',
        variant === 'elevated' && 'bg-surface-card border border-surface-border shadow-lg shadow-black/30',
        variant === 'bordered' && 'bg-transparent border-2 border-brand-primary',
        className,
      )}
    >
      {children}
    </div>
  )
}
