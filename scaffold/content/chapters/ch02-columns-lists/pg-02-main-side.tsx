'use client'

import { Anim } from '@/components/anim'
import { Text } from '@/components/text'
import { Cardbox } from '@/components/cardbox'
import { colors } from '@/components/theme'
import { useNarration } from '@/components/player/narration-context'

export default function Pg02MainSide() {
  const { script } = useNarration()
  return (
    <>
      <Anim type="slide-left" delay={0} w={8} h={70} x={100} y={70}>
        <div style={{ width: '100%', height: '100%', background: colors.brand.secondary, borderRadius: 4 }} />
      </Anim>

      <Anim type="fade-in" delay={100} x={128} y={72} w={600} h={70}>
        <Text variant="h2" x={0} y={0}>Main & Side Panel</Text>
      </Anim>

      <Anim type="fade-in" delay={200} x={128} y={152} w={800} h={35}>
        <Text variant="caption" x={0} y={0}>Primary content with supplementary sidebar</Text>
      </Anim>

      <Anim type="fade-in" delay={350} x={160} y={210} w={1000} h={520}>
        <Cardbox variant="default" x={0} y={0} w={1000} h={520}>
          <Text variant="body" x={30} y={25} w={940} style={{ lineHeight: 1.8 }}>
            The main content area displays primary information with detailed explanations and examples.{'\n\n'}
            The side panel holds key points, summaries, or supporting data.{'\n\n'}
            Both columns start at the same y position and can be sized independently. This layout works well for content with supplementary insights or related data.
          </Text>
        </Cardbox>
      </Anim>

      <Anim type="fade-in" delay={450} x={1260} y={210} w={500} h={280}>
        <Cardbox variant="bordered" x={0} y={0} w={500} h={280}>
          <Text variant="body" x={20} y={20} w={460} style={{ color: colors.brand.secondary, fontWeight: 600 }}>
            Key Points
          </Text>
          <Text variant="caption" x={20} y={80} w={460}>• Main panel centered at x=160, w=1000</Text>
          <Text variant="caption" x={20} y={120} w={460}>• Side panel at x=1260, w=500</Text>
          <Text variant="caption" x={20} y={160} w={460}>• Total width 1600, symmetric layout</Text>
          <Text variant="caption" x={20} y={200} w={460}>• Side uses bordered variant</Text>
        </Cardbox>
      </Anim>

      <Text variant="caption" x={360} y={1027} w={1200} style={{ textAlign: 'center' }}>{script}</Text>
    </>
  )
}
