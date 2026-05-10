'use client'

import { Anim } from '@/components/anim'
import { Text } from '@/components/text'
import { Cardbox } from '@/components/cardbox'
import { SVG } from '@/components/svg'
import { canvas } from '@/config/canvas'
import { useNarration } from '@/components/player/narration-context'

const cx = canvas.width / 2

export default function Pg01Title() {
  const { script } = useNarration()

  return (
    <>
      <Anim type="fade-in" delay={0} x={0} y={0} w={1920} h={1080}>
        <div style={{
          width: '100%', height: '100%',
          background: 'radial-gradient(ellipse at 50% 35%, rgba(6,182,212,0.12), transparent 65%)',
        }} />
      </Anim>

      <Anim type="fade-in" delay={200} x={cx - 48} y={340} w={96} h={32}>
        <Cardbox variant="bordered" x={0} y={0} w={96} h={32}>
          <Text variant="caption" x={0} y={7} w={96} style={{ textAlign: 'center' }}>Ch02</Text>
        </Cardbox>
      </Anim>

      <Anim type="scale-in" delay={300} w={480} h={4} x={cx - 240} y={380}>
        <div style={{ width: '100%', height: '100%', background: 'linear-gradient(90deg, transparent, #06B6D4, transparent)', borderRadius: 2 }} />
      </Anim>

      <Anim type="slide-up" delay={400} x={cx - 500} y={410} w={1000} h={80}>
        <Text variant="h1" x={0} y={0} w={1000} style={{ textAlign: 'center' }}>
          第二章 · 核心概念
        </Text>
      </Anim>

      <Anim type="fade-in" delay={700} x={cx - 350} y={500} w={700} h={40}>
        <Text variant="h3" x={0} y={0} w={700} style={{ textAlign: 'center', color: '#9CA3AF' }}>
          Core Concepts
        </Text>
      </Anim>

      <Anim type="scale-in" delay={1100} x={cx - 200} y={580} w={400} h={56}>
        <Cardbox variant="elevated" x={0} y={0} w={400} h={56}>
          <SVG x={160} y={18} w={20} h={20} viewBox="0 0 24 24">
            <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" fill="#06B6D4" />
          </SVG>
          <Text variant="caption" x={0} y={18} w={400} style={{ textAlign: 'center' }}>
            按 → 键继续
          </Text>
        </Cardbox>
      </Anim>

      <Text variant="caption" x={80} y={1020} w={800}>{script}</Text>
    </>
  )
}
