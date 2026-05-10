'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import { boxStyle } from '@/lib/utils'
import type { Box } from '@/lib/types'
import { colors, typography } from '@/components/theme'

interface MarkdownProps extends Box {
  content: string
}

export function Markdown({ content, ...box }: MarkdownProps) {
  return (
    <div
      style={{
        ...boxStyle(box),
        overflow: 'hidden',
        fontSize: typography.body.fontSize,
        lineHeight: typography.body.lineHeight,
        color: colors.text.secondary,
      }}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          h1: ({ children }) => (
            <h1 style={{ fontSize: typography.h1.fontSize, fontWeight: typography.h1.fontWeight, margin: '16px 0 8px', color: colors.text.primary }}>
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 style={{ fontSize: typography.h2.fontSize, fontWeight: typography.h2.fontWeight, margin: '14px 0 6px', color: colors.text.primary }}>
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 style={{ fontSize: typography.h3.fontSize, fontWeight: typography.h3.fontWeight, margin: '12px 0 4px', color: colors.text.primary }}>
              {children}
            </h3>
          ),
          p: ({ children }) => <p style={{ margin: '8px 0', color: colors.text.secondary }}>{children}</p>,
          code: ({ children }) => (
            <code style={{ background: colors.surface.card, padding: '2px 6px', borderRadius: 4, fontSize: typography.code.fontSize, color: colors.brand.secondary }}>
              {children}
            </code>
          ),
          pre: ({ children }) => (
            <pre style={{ background: colors.surface.card, padding: 16, borderRadius: 8, overflow: 'auto', fontSize: typography.code.fontSize, lineHeight: typography.code.lineHeight }}>
              {children}
            </pre>
          ),
          table: ({ children }) => (
            <div style={{ overflow: 'auto' }}>
              <table style={{ borderCollapse: 'collapse', width: '100%' }}>{children}</table>
            </div>
          ),
          th: ({ children }) => (
            <th style={{ border: `1px solid ${colors.surface.border}`, padding: '8px 12px', textAlign: 'left', background: colors.surface.card, color: colors.text.primary }}>
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td style={{ border: `1px solid ${colors.surface.border}`, padding: '8px 12px', color: colors.text.secondary }}>
              {children}
            </td>
          ),
          ul: ({ children }) => <ul style={{ paddingLeft: 24, margin: '8px 0' }}>{children}</ul>,
          ol: ({ children }) => <ol style={{ paddingLeft: 24, margin: '8px 0' }}>{children}</ol>,
          li: ({ children }) => <li style={{ margin: '4px 0', color: colors.text.secondary }}>{children}</li>,
          a: ({ href, children }) => <a href={href} style={{ color: colors.brand.primary }}>{children}</a>,
          blockquote: ({ children }) => (
            <blockquote style={{ borderLeft: `4px solid ${colors.brand.primary}`, paddingLeft: 16, margin: '12px 0', color: colors.text.secondary, fontStyle: 'italic' }}>
              {children}
            </blockquote>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
