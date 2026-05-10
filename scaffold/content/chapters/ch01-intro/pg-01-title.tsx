'use client'

import { Anim } from '@/components/anim'
import { Text } from '@/components/text'
import { Cardbox } from '@/components/cardbox'
import { useNarration } from '@/components/player/narration-context'
import { canvas, colors } from '@/components/theme'

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

      <Anim type="fade-in" delay={200} x={cx - 40} y={260} w={80} h={36}>
        <Cardbox variant="bordered" x={0} y={0} w={80} h={36}>
          <Text variant="caption" x={0} y={7} w={80} style={{ textAlign: 'center' }}>Ch01</Text>
        </Cardbox>
      </Anim>

      <Anim type="scale-in" delay={300} w={640} h={4} x={cx - 320} y={312}>
        <div style={{
          width: '100%', height: '100%',
          background: `linear-gradient(90deg, transparent, ${colors.brand.primary}, transparent)`,
          borderRadius: 2,
        }} />
      </Anim>

      <Anim type="slide-up" delay={400} x={cx - 600} y={350} w={1200} h={100}>
        <Text variant="h1" x={0} y={0} w={1200} style={{ textAlign: 'center' }}>
          机器学习入门
        </Text>
      </Anim>

      <Anim type="fade-in" delay={700} x={cx - 400} y={500} w={800} h={60}>
        <Text variant="h3" x={0} y={0} w={800} style={{ textAlign: 'center', color: colors.text.secondary }}>
          Introduction to Machine Learning
        </Text>
      </Anim>

      <Text variant="caption" x={80} y={1020} w={800}>{script}</Text>
    </>
  )
}
