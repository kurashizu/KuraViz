'use client'

import type { TextVariant } from '@/components/theme'
import { typography } from '@/components/theme'
import { boxStyle } from '@/lib/utils'
import type { Box } from '@/lib/types'

type HtmlTag = 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'code'

interface TextProps extends Box {
  variant?: TextVariant
  children: React.ReactNode
  style?: React.CSSProperties
  as?: HtmlTag
}

const tagMap: Record<TextVariant, HtmlTag> = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  body: 'p',
  caption: 'span',
  code: 'code',
}

export function Text({ variant = 'body', children, style, as, ...box }: TextProps) {
  const t = typography[variant]
  const Tag = as ?? tagMap[variant]

  return (
    <Tag
      style={{
        ...boxStyle(box),
        fontSize: t.fontSize,
        fontWeight: t.fontWeight,
        lineHeight: t.lineHeight,
        color: t.color,
        fontFamily: 'fontFamily' in t ? t.fontFamily : undefined,
        margin: 0,
        whiteSpace: 'pre-wrap',
        ...style,
      }}
    >
      {children}
    </Tag>
  )
}
