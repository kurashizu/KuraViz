'use client'

import { Anim } from '@/components/anim'
import { Text } from '@/components/text'
import { Cardbox } from '@/components/cardbox'
import { colors } from '@/components/theme'
import { useNarration } from '@/components/player/narration-context'

export default function Pg02Section() {
  const { script } = useNarration()
  return (
    <>
      <Anim type="slide-left" delay={0} w={8} h={70} x={100} y={70}>
        <div style={{ width: '100%', height: '100%', background: colors.brand.primary, borderRadius: 4 }} />
      </Anim>

      <Anim type="fade-in" delay={100} x={128} y={72} w={600} h={70}>
        <Text variant="h2" x={0} y={0}>Section Page</Text>
      </Anim>

      <Anim type="fade-in" delay={200} x={128} y={152} w={600} h={35}>
        <Text variant="caption" x={0} y={0}>Standard layout with accent bar, title, and content</Text>
      </Anim>

      <Anim type="fade-in" delay={350} x={100} y={210} w={1720} h={400}>
        <Cardbox variant="default" x={0} y={0} w={1720} h={400}>
          <Text variant="body" x={40} y={30} w={1640} style={{ lineHeight: 1.8 }}>
            The accent bar on the left uses the chapter's brand color. Its height of 70px matches the h2 line box (54 x 1.3 = 70).{'\n\n'}
            The title uses Text variant h2. The subtitle uses variant caption with a 12px gap to prevent sub-pixel overlap.{'\n\n'}
            The full-width card (1720px) spans most of the canvas and is suitable for large text blocks, code samples, or large images.
          </Text>
        </Cardbox>
      </Anim>

      <Text variant="caption" x={360} y={1027} w={1200} style={{ textAlign: 'center' }}>{script}</Text>
    </>
  )
}
