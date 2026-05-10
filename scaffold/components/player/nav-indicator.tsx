'use client'

interface NavIndicatorProps {
  chapterTitle: string
  chapterIndex: number
  pageIndex: number
  totalPages: number
}

export function NavIndicator({ chapterTitle, chapterIndex, pageIndex, totalPages }: NavIndicatorProps) {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: 16,
        right: 24,
        fontSize: 13,
        color: '#6B7280',
        fontFamily: 'monospace',
        zIndex: 9998,
      }}
    >
      Ch{String(chapterIndex + 1).padStart(2, '0')} · {pageIndex + 1}/{totalPages}
    </div>
  )
}
