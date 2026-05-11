'use client'

import { Anim } from '@/components/anim'
import { Text } from '@/components/text'
import { colors } from '@/components/theme'

export default function Pg01Overlap() {
  return (
    <>
      <Anim type="fade-in" delay={0} w={8} h={70} x={100} y={70}>
        <div style={{ width: '100%', height: '100%', background: colors.semantic.error, borderRadius: 4 }} />
      </Anim>

      <Anim type="fade-in" delay={100} x={128} y={72} w={600} h={70}>
        <Text variant="h2" x={0} y={0}>Sibling Overlap</Text>
      </Anim>

      <Anim type="fade-in" delay={200} x={128} y={152} w={1000} h={35}>
        <Text variant="caption" x={0} y={0}>Expected: OVERLAP — box-a[200,220 360x200] vs box-b[380,320 360x200]</Text>
      </Anim>

      <div
        data-box-id="box-a"
        style={{
          position: 'absolute', left: 200, top: 220, width: 360, height: 200,
          background: `${colors.brand.primary}40`, border: `2px solid ${colors.brand.primary}`,
          borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        <Text variant="body" x={0} y={0} w={360} h={200} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', color: colors.base.white }}>
          Box A{"\n"}200,220 360x200
        </Text>
      </div>

      <div
        data-box-id="box-b"
        style={{
          position: 'absolute', left: 380, top: 320, width: 360, height: 200,
          background: `${colors.semantic.error}40`, border: `2px solid ${colors.semantic.error}`,
          borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        <Text variant="body" x={0} y={0} w={360} h={200} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', color: colors.base.white }}>
          Box B{"\n"}380,320 360x200
        </Text>
      </div>

      <Text variant="caption" x={360} y={1027} w={1200} style={{ textAlign: 'center' }}>This page tests sibling OVERLAP detection.</Text>
    </>
  )
}
