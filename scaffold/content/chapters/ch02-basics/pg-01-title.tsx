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
          background: `radial-gradient(ellipse at 50% 35%, ${colors.brand.secondary}1f, transparent 65%)`,
        }} />
      </Anim>

      <Anim type="fade-in" delay={200} x={cx - 70} y={260} w={140} h={44}>
        <Cardbox variant="bordered" x={0} y={0} w={140} h={44}>
          <Text variant="caption" x={4} y={8} w={128} style={{ textAlign: 'center' }}>Chapter 2</Text>
        </Cardbox>
      </Anim>

      <Anim type="scale-in" delay={300} w={480} h={4} x={cx - 240} y={312}>
        <div style={{
          width: '100%', height: '100%',
          background: `linear-gradient(90deg, transparent, ${colors.brand.secondary}, transparent)`,
          borderRadius: 2,
        }} />
      </Anim>

      <Anim type="slide-up" delay={400} x={cx - 500} y={350} w={1000} h={100}>
        <Text variant="h1" x={0} y={0} w={1000} style={{ textAlign: 'center' }}>
          第二章 · 核心概念
        </Text>
      </Anim>

      <Anim type="fade-in" delay={700} x={cx - 350} y={510} w={700} h={65}>
        <Text variant="h3" x={0} y={0} w={700} style={{ textAlign: 'center', color: colors.text.secondary }}>
          Core Concepts
        </Text>
      </Anim>

      <Text variant="caption" x={320} y={1000} w={1280} style={{ textAlign: 'center' }}>{script}</Text>
    </>
  )
}
