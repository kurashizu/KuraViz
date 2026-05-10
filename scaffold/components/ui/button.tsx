'use client'

import { cn } from '@/lib/utils'
import type { Box } from '@/lib/types'
import { boxStyle } from '@/lib/utils'

interface ButtonProps extends Box {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'ghost'
  disabled?: boolean
}

export function Button({ children, onClick, variant = 'primary', disabled, ...box }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={boxStyle(box)}
      className={cn(
        'rounded-lg border px-4 py-2 text-sm font-medium transition-colors',
        variant === 'primary' && 'bg-brand-primary text-white border-brand-primary hover:opacity-90',
        variant === 'secondary' && 'bg-surface-card text-text-primary border-surface-border hover:bg-surface-border',
        variant === 'ghost' && 'bg-transparent text-text-secondary border-transparent hover:text-text-primary',
        disabled && 'opacity-40 cursor-not-allowed',
      )}
    >
      {children}
    </button>
  )
}
