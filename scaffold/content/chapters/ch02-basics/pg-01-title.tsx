'use client'

import { Anim } from '@/components/anim'
import { Text } from '@/components/text'
import { useNarration } from '@/components/player/narration-context'

export default function Pg01Title() {
  const { script } = useNarration()

  return (
    <>
      <Anim type="fade-in" delay={0} x={0} y={0} w={1920} h={1080}>
        <div style={{
          width: '100%', height: '100%',
          background: 'radial-gradient(ellipse at 50% 40%, rgba(6,182,212,0.12), transparent 70%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        }}>
          <Anim type="slide-up" delay={200} w={1000} h={80} x={460} y={360}>
            <Text variant="h1" x={0} y={0} w={1000} style={{ textAlign: 'center' }}>
              第二章 · 核心概念
            </Text>
          </Anim>

          <Anim type="fade-in" delay={600} w={700} h={40} x={610} y={460}>
            <Text variant="h3" x={0} y={0} w={700} style={{ textAlign: 'center' }}>
              Core Concepts
            </Text>
          </Anim>
        </div>
      </Anim>

      <Text variant="caption" x={80} y={1020} w={800}>{script}</Text>
    </>
  )
}
