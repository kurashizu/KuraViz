'use client'

import { boxStyle } from '@/lib/utils'
import type { Box } from '@/lib/types'
import { Text } from '@/components/text'

interface MindMapProps extends Box {
  root: string
  nodes: { id: string; label: string; parent: string | null }[]
}

export function MindMap({ root, nodes, ...box }: MindMapProps) {
  const children = nodes.filter(n => n.parent === root)
  const level2 = children.flatMap(c => nodes.filter(n => n.parent === c.id))

  return (
    <div style={{ ...boxStyle(box), display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
      <div style={{ background: '#6366F1', borderRadius: 12, padding: '12px 24px' }}>
        <Text variant="body" style={{ color: '#fff', fontWeight: 700 }}>{root}</Text>
      </div>
      <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', justifyContent: 'center' }}>
        {children.map(c => (
          <div key={c.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <div style={{ background: '#1A1D2B', border: '1px solid #2E3144', borderRadius: 8, padding: '8px 16px' }}>
              <Text variant="body">{c.label}</Text>
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
              {nodes.filter(n => n.parent === c.id).map(gc => (
                <div key={gc.id} style={{ background: '#0F1117', border: '1px solid #2E3144', borderRadius: 6, padding: '6px 12px' }}>
                  <Text variant="caption">{gc.label}</Text>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
