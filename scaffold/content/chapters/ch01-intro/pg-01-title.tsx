'use client'

import { Anim } from '@/components/anim'
import { Text } from '@/components/text'
import { Cardbox } from '@/components/cardbox'
import { useNarration } from '@/components/player/narration-context'
import { canvas } from '@/config/canvas'

const cx = canvas.width / 2

export default function Pg01Title() {
  const { script } = useNarration()

  return (
    <>
      <Anim type="fade-in" delay={0} x={0} y={0} w={1920} h={1080}>
        <div style={{
          width: '100%', height: '100%',
          background: 'radial-gradient(ellipse at 50% 35%, rgba(99,102,241,0.15), transparent 65%)',
        }} />
      </Anim>

      <Anim type="fade-in" delay={200} x={cx - 40} y={340} w={80} h={32}>
        <Cardbox variant="bordered" x={0} y={0} w={80} h={32}>
          <Text variant="caption" x={0} y={7} w={80} style={{ textAlign: 'center' }}>Ch01</Text>
        </Cardbox>
      </Anim>

      <Anim type="scale-in" delay={300} w={640} h={4} x={cx - 320} y={388}>
        <div style={{ width: '100%', height: '100%', background: 'linear-gradient(90deg, transparent, #6366F1, transparent)', borderRadius: 2 }} />
      </Anim>

      <Anim type="slide-up" delay={400} x={cx - 600} y={420} w={1200} h={80}>
        <Text variant="h1" x={0} y={0} w={1200} style={{ textAlign: 'center' }}>
          机器学习入门
        </Text>
      </Anim>

      <Anim type="fade-in" delay={700} x={cx - 400} y={510} w={800} h={40}>
        <Text variant="h3" x={0} y={0} w={800} style={{ textAlign: 'center', color: '#9CA3AF' }}>
          Introduction to Machine Learning
        </Text>
      </Anim>

      <Text variant="caption" x={80} y={1020} w={800}>{script}</Text>
    </>
  )
}
