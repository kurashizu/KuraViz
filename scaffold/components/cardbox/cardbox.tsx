'use client'

import { boxStyle } from '@/lib/utils'
import type { Box } from '@/lib/types'
import { colors } from '@/components/theme'
import { useOverflow } from '@/lib/use-overflow'

interface CardboxProps extends Box {
  children: React.ReactNode
  variant?: 'default' | 'elevated' | 'bordered'
}

const variantStyle: Record<string, React.CSSProperties> = {
  default: { background: colors.surface.card, border: `1px solid ${colors.surface.border}` },
  elevated: { background: colors.surface.card, border: `1px solid ${colors.surface.border}`, boxShadow: '0 8px 24px rgba(0,0,0,0.3)' },
  bordered: { background: 'transparent', border: `2px solid ${colors.brand.primary}` },
}

let _cardboxUid = 0

export function Cardbox({ children, variant = 'default', ...box }: CardboxProps) {
  const overflowRef = useOverflow([])

  return (
    <div
      ref={overflowRef}
      data-box-id={`cardbox-${variant}-${++_cardboxUid}`}
      style={{ ...boxStyle(box), borderRadius: 12, overflow: 'hidden', ...variantStyle[variant] }}
    >
      {children}
    </div>
  )
}
