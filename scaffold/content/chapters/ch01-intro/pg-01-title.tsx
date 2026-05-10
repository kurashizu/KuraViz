'use client'

import { Anim } from '@/components/anim'
import { Text } from '@/components/text'
import { Cardbox } from '@/components/cardbox'
import { useNarration } from '@/components/player/narration-context'

export default function Pg01Title() {
  const { script } = useNarration()

  return (
    <>
      <Anim type="fade-in" delay={0} x={0} y={0} w={1920} h={1080}>
        <div style={{
          width: '100%', height: '100%',
          background: 'radial-gradient(ellipse at 50% 40%, rgba(99,102,241,0.15), transparent 70%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        }}>
          <Anim type="slide-up" delay={200} w={1200} h={80} x={360} y={360}>
            <Text variant="h1" x={0} y={0} w={1200} style={{ textAlign: 'center' }}>
              机器学习入门
            </Text>
          </Anim>

          <Anim type="fade-in" delay={600} w={800} h={40} x={560} y={480}>
            <Text variant="h3" x={0} y={0} w={800} style={{ textAlign: 'center' }}>
              Introduction to Machine Learning
            </Text>
          </Anim>

          <Anim type="scale-in" delay={1000} w={600} h={60} x={660} y={580}>
            <Cardbox variant="elevated" x={0} y={0} w={600} h={60}>
              <div style={{ padding: '8px 24px', textAlign: 'center' }}>
                <Text variant="caption" x={0} y={0} w={600}>
                  按 → 键开始
                </Text>
              </div>
            </Cardbox>
          </Anim>
        </div>
      </Anim>

      <Text variant="caption" x={80} y={1020} w={800}>{script}</Text>
    </>
  )
}
