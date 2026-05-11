'use client'

import { Anim } from '@/components/anim'
import { Text } from '@/components/text'
import { Cardbox } from '@/components/cardbox'
import { canvas, colors } from '@/components/theme'
import { useNarration } from '@/components/player/narration-context'

const cx = canvas.width / 2

export default function Pg01Title() {
  const { script } = useNarration()
  return (
    <>
      <Anim type="fade-in" delay={0} x={0} y={0} w={1920} h={1080}>
        <div style={{
          width: '100%', height: '100%',
          background: `radial-gradient(ellipse at 50% 35%, ${colors.brand.primary}26, transparent 65%)`,
        }} />
      </Anim>

      <Anim type="fade-in" delay={200} x={cx - 100} y={320} w={200} h={48}>
        <Cardbox variant="bordered" x={0} y={0} w={200} h={48}>
          <Text variant="caption" x={0} y={7} w={190} style={{ textAlign: 'center' }}>Chapter 01</Text>
        </Cardbox>
      </Anim>

      <Anim type="scale-in" delay={300} w={600} h={4} x={cx - 300} y={376}>
        <div style={{
          width: '100%', height: '100%',
          background: `linear-gradient(90deg, transparent, ${colors.brand.primary}, transparent)`,
          borderRadius: 2,
        }} />
      </Anim>

      <Anim type="slide-up" delay={400} x={cx - 500} y={420} w={1000} h={86}>
        <Text variant="h1" x={0} y={0} w={1000} style={{ textAlign: 'center' }}>Layout Basics</Text>
      </Anim>

      <Anim type="fade-in" delay={700} x={cx - 400} y={620} w={800} h={59}>
        <Text variant="h3" x={0} y={0} w={800} style={{ textAlign: 'center', color: colors.text.secondary }}>
          Title & Content Pages
        </Text>
      </Anim>

      <Text variant="caption" x={360} y={1027} w={1200} style={{ textAlign: 'center' }}>{script}</Text>
    </>
  )
}
