'use client'

import { useMemo } from 'react'
import { boxStyle } from '@/lib/utils'
import type { Box } from '@/lib/types'
import { Text } from '@/components/text'
import { colors } from '@/components/theme'

interface MindMapProps extends Box {
  root: string
  nodes: { id: string; label: string; parent: string | null }[]
}

const NODE_RADIUS = 12
const CHILD_Y = 140
const GRAND_Y = 260

export function MindMap({ root, nodes, ...box }: MindMapProps) {
  const children = useMemo(() => nodes.filter(n => n.parent === root), [nodes, root])
  const cw = box.w ?? 800

  const childSpacing = cw / (children.length + 1)
  const grandChildren = useMemo(
    () => children.map(c => ({ parent: c, items: nodes.filter(n => n.parent === c.id) })),
    [children, nodes],
  )

  return (
    <div style={{ ...boxStyle(box), position: 'relative', overflow: 'hidden' }}>
      <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0, zIndex: 0 }}>
        {children.map((c, i) => {
          const cx = childSpacing * (i + 1)
          return (
            <g key={c.id}>
              <line x1={cw / 2} y1={NODE_RADIUS + 10} x2={cx} y2={CHILD_Y - 10} stroke={colors.surface.border} strokeWidth={1.5} />
              {grandChildren[i].items.map((gc, j) => {
                const gcSpacing = childSpacing / (grandChildren[i].items.length + 1)
                const gcx = cx - childSpacing / 2 + gcSpacing * (j + 1)
                return (
                  <line key={gc.id} x1={cx} y1={CHILD_Y + 10} x2={gcx} y2={GRAND_Y - 10} stroke={colors.surface.border} strokeWidth={1} />
                )
              })}
            </g>
          )
        })}
      </svg>

      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1 }}>
        <div style={{ background: colors.brand.primary, borderRadius: NODE_RADIUS, padding: '10px 28px' }}>
          <Text variant="body" style={{ color: colors.base.white, fontWeight: 700 }}>{root}</Text>
        </div>

        <div style={{ position: 'relative', width: '100%', marginTop: 60 }}>
          {children.map((c, i) => {
            const left = childSpacing * (i + 1)
            return (
              <div key={c.id} style={{ position: 'absolute', left: left - 80, top: CHILD_Y - 80, width: 160, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ background: colors.surface.card, border: `1px solid ${colors.surface.border}`, borderRadius: 8, padding: '8px 16px' }}>
                  <Text variant="body">{c.label}</Text>
                </div>

                <div style={{ display: 'flex', gap: 8, marginTop: 60 }}>
                  {grandChildren[i].items.map(gc => (
                    <div key={gc.id} style={{ background: colors.surface.bg, border: `1px solid ${colors.surface.border}`, borderRadius: 6, padding: '6px 12px', whiteSpace: 'nowrap' }}>
                      <Text variant="caption">{gc.label}</Text>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
