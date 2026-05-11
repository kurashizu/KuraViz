'use client'

import { Anim } from '@/components/anim'
import { Text } from '@/components/text'
import { colors } from '@/components/theme'

export default function Pg02CanvasOverflow() {
  return (
    <>
      <Anim type="fade-in" delay={0} w={8} h={70} x={100} y={70}>
        <div style={{ width: '100%', height: '100%', background: colors.semantic.error, borderRadius: 4 }} />
      </Anim>

      <Anim type="fade-in" delay={100} x={128} y={72} w={600} h={70}>
        <Text variant="h2" x={0} y={0}>Canvas Exceed</Text>
      </Anim>

      <Anim type="fade-in" delay={200} x={128} y={152} w={1100} h={35}>
        <Text variant="caption" x={0} y={0}>Expected: 2x EXCEED — right=1980&gt;1920, bottom=1120&gt;1080</Text>
      </Anim>

      <div
        data-box-id="overflow-right"
        style={{
          position: 'absolute', left: 1780, top: 220, width: 200, height: 100,
          background: `${colors.semantic.error}40`, border: `2px solid ${colors.semantic.error}`,
          borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        <Text variant="caption" x={0} y={0} w={200} h={100} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', color: colors.base.white }}>
          right=1980 &gt; 1920
        </Text>
      </div>

      <div
        data-box-id="overflow-bottom"
        style={{
          position: 'absolute', left: 200, top: 1020, width: 200, height: 100,
          background: `${colors.brand.accent}40`, border: `2px solid ${colors.brand.accent}`,
          borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        <Text variant="caption" x={0} y={0} w={200} h={100} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', color: colors.base.white }}>
          bottom=1120 &gt; 1080
        </Text>
      </div>

      <Text variant="caption" x={360} y={1027} w={1200} style={{ textAlign: 'center' }}>This page tests canvas EXCEED detection.</Text>
    </>
  )
}
