'use client'

import { Anim } from '@/components/anim'
import { Text } from '@/components/text'
import { colors } from '@/components/theme'

export default function Pg03ParentOverflow() {
  return (
    <>
      <Anim type="fade-in" delay={0} w={8} h={70} x={100} y={70}>
        <div style={{ width: '100%', height: '100%', background: colors.semantic.error, borderRadius: 4 }} />
      </Anim>

      <Anim type="fade-in" delay={100} x={128} y={72} w={600} h={70}>
        <Text variant="h2" x={0} y={0}>Parent Overflow</Text>
      </Anim>

      <Anim type="fade-in" delay={200} x={128} y={152} w={1100} h={35}>
        <Text variant="caption" x={0} y={0}>Expected: OVERFLOW — child-overflow[460,360 120x100] exceeds parent-blue[200,220 300x200]</Text>
      </Anim>

      <div
        data-box-id="parent-blue"
        style={{
          position: 'absolute', left: 200, top: 220, width: 300, height: 200,
          border: `2px solid ${colors.brand.primary}`, borderRadius: 8,
          background: `${colors.brand.primary}15`,
          color: colors.brand.primary, padding: 8, fontSize: 18,
        }}
      >
        Parent (200,220 300x200)

        <div
          data-box-id="child-overflow"
          style={{
            position: 'absolute', left: 260, top: 140, width: 120, height: 100,
            background: `${colors.semantic.error}40`, border: `2px solid ${colors.semantic.error}`,
            borderRadius: 8, color: colors.base.white, fontSize: 14,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          overflow
        </div>
      </div>

      <Text variant="caption" x={360} y={1027} w={1200} style={{ textAlign: 'center' }}>This page tests parent OVERFLOW detection.</Text>
    </>
  )
}
