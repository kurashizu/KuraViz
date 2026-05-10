'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import { boxStyle } from '@/lib/utils'
import type { Box } from '@/lib/types'

interface MarkdownProps extends Box {
  content: string
}

export function Markdown({ content, ...box }: MarkdownProps) {
  return (
    <div
      style={{
        ...boxStyle(box),
        overflow: 'auto',
        fontSize: 18,
        lineHeight: 1.7,
        color: '#F1F3F9',
      }}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          h1: ({ children }) => <h1 style={{ fontSize: 36, fontWeight: 700, margin: '16px 0 8px', color: '#F1F3F9' }}>{children}</h1>,
          h2: ({ children }) => <h2 style={{ fontSize: 28, fontWeight: 600, margin: '14px 0 6px', color: '#F1F3F9' }}>{children}</h2>,
          h3: ({ children }) => <h3 style={{ fontSize: 22, fontWeight: 600, margin: '12px 0 4px', color: '#F1F3F9' }}>{children}</h3>,
          p: ({ children }) => <p style={{ margin: '8px 0', color: '#9CA3AF' }}>{children}</p>,
          code: ({ children }) => (
            <code style={{ background: '#1A1D2B', padding: '2px 6px', borderRadius: 4, fontSize: 16, color: '#06B6D4' }}>
              {children}
            </code>
          ),
          pre: ({ children }) => (
            <pre style={{ background: '#1A1D2B', padding: 16, borderRadius: 8, overflow: 'auto', fontSize: 16, lineHeight: 1.5 }}>
              {children}
            </pre>
          ),
          table: ({ children }) => (
            <div style={{ overflow: 'auto' }}>
              <table style={{ borderCollapse: 'collapse', width: '100%' }}>{children}</table>
            </div>
          ),
          th: ({ children }) => <th style={{ border: '1px solid #2E3144', padding: '8px 12px', textAlign: 'left', background: '#1A1D2B', color: '#F1F3F9' }}>{children}</th>,
          td: ({ children }) => <td style={{ border: '1px solid #2E3144', padding: '8px 12px', color: '#9CA3AF' }}>{children}</td>,
          ul: ({ children }) => <ul style={{ paddingLeft: 24, margin: '8px 0' }}>{children}</ul>,
          ol: ({ children }) => <ol style={{ paddingLeft: 24, margin: '8px 0' }}>{children}</ol>,
          li: ({ children }) => <li style={{ margin: '4px 0', color: '#9CA3AF' }}>{children}</li>,
          a: ({ href, children }) => <a href={href} style={{ color: '#6366F1' }}>{children}</a>,
          blockquote: ({ children }) => (
            <blockquote style={{ borderLeft: '4px solid #6366F1', paddingLeft: 16, margin: '12px 0', color: '#9CA3AF', fontStyle: 'italic' }}>
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
