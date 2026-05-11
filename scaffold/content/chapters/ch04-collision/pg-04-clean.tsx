'use client'

import { Anim } from '@/components/anim'
import { Text } from '@/components/text'
import { colors } from '@/components/theme'

export default function Pg04Clean() {
  return (
    <>
      <Anim type="fade-in" delay={0} w={8} h={70} x={100} y={70}>
        <div style={{ width: '100%', height: '100%', background: colors.semantic.success, borderRadius: 4 }} />
      </Anim>

      <Anim type="fade-in" delay={100} x={128} y={72} w={600} h={70}>
        <Text variant="h2" x={0} y={0}>Clean Page</Text>
      </Anim>

      <Anim type="fade-in" delay={200} x={128} y={152} w={800} h={35}>
        <Text variant="caption" x={0} y={0}>Expected: 0 collisions — all elements within canvas, no overlaps, no overflows</Text>
      </Anim>

      <Anim type="fade-in" delay={350} x={200} y={220} w={400} h={120}>
        <div
          data-box-id="box-a-clean"
          style={{
            width: '100%', height: '100%',
            background: `${colors.semantic.success}26`, border: `2px solid ${colors.semantic.success}`,
            borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: colors.semantic.success, fontSize: 20,
          }}
        >
          Box A — within canvas
        </div>
      </Anim>

      <Anim type="fade-in" delay={450} x={660} y={220} w={400} h={120}>
        <div
          data-box-id="box-b-clean"
          style={{
            width: '100%', height: '100%',
            background: `${colors.semantic.success}26`, border: `2px solid ${colors.semantic.success}`,
            borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: colors.semantic.success, fontSize: 20,
          }}
        >
          Box B — within canvas, no overlap
        </div>
      </Anim>

      <Text variant="caption" x={360} y={1027} w={1200} style={{ textAlign: 'center' }}>This is the clean control page — zero collisions expected.</Text>
    </>
  )
}
