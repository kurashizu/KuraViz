'use client'

import type { TextVariant } from '@/components/theme'
import { typography, fonts } from '@/components/theme'
import { boxStyle } from '@/lib/utils'
import type { Box } from '@/lib/types'

type HtmlTag = 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'code' | 'div'

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
  caption: 'div',
  citation: 'div',
  code: 'code',
  watermark: 'div',
}

let _textUid = 0

export function Text({ variant = 'body', children, style, as, ...box }: TextProps) {
  const t = typography[variant]
  const Tag = as ?? tagMap[variant]
  const label = typeof children === 'string' ? children.replace(/\s+/g, ' ').trim() : ''

  return (
    <Tag
      data-box-id={`text-${variant}${label ? '-' + label : ''}-${++_textUid}`}
      style={{
        ...boxStyle(box),
        fontSize: t.fontSize,
        fontWeight: t.fontWeight,
        lineHeight: t.lineHeight,
        color: t.color,
        fontFamily: variant === 'code' ? fonts.mono : fonts.sans,
        margin: 0,
        whiteSpace: 'pre-wrap',
        ...style,
      }}
    >
      {children}
    </Tag>
  )
}
