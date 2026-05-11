'use client'

import { Anim } from '@/components/anim'
import { Text } from '@/components/text'
import { Cardbox } from '@/components/cardbox'
import { colors } from '@/components/theme'
import { useNarration } from '@/components/player/narration-context'

export default function Pg03EqualSplit() {
  const { script } = useNarration()
  return (
    <>
      <Anim type="slide-left" delay={0} w={8} h={70} x={100} y={70}>
        <div style={{ width: '100%', height: '100%', background: colors.brand.secondary, borderRadius: 4 }} />
      </Anim>

      <Anim type="fade-in" delay={100} x={128} y={72} w={600} h={70}>
        <Text variant="h2" x={0} y={0}>Comparison Layout</Text>
      </Anim>

      <Anim type="fade-in" delay={200} x={128} y={152} w={800} h={35}>
        <Text variant="caption" x={0} y={0}>Side-by-side equal columns for comparison</Text>
      </Anim>

      <Anim type="fade-in" delay={350} x={100} y={210} w={840} h={450}>
        <Cardbox variant="default" x={0} y={0} w={840} h={450}>
          <Text variant="body" x={25} y={20} w={790} style={{ fontWeight: 600, color: colors.brand.primary }}>
            Method A
          </Text>
          <Text variant="body" x={25} y={60} w={790} style={{ lineHeight: 1.7 }}>
            Traditional for loop with manual iteration. Verbose but performant.{'\n\n'}
            Suitable for large datasets where loop control is critical.
          </Text>
          <Text variant="caption" x={25} y={320} w={790} style={{ fontFamily: 'monospace' }}>
            for (let i = 0; i &lt; arr.length; i++) {'{'}
            {'\n'}  result.push(arr[i] * 2)
            {'\n'}{'}'}
          </Text>
        </Cardbox>
      </Anim>

      <Anim type="fade-in" delay={450} x={980} y={210} w={840} h={450}>
        <Cardbox variant="default" x={0} y={0} w={840} h={450}>
          <Text variant="body" x={25} y={20} w={790} style={{ fontWeight: 600, color: colors.brand.secondary }}>
            Method B
          </Text>
          <Text variant="body" x={25} y={60} w={790} style={{ lineHeight: 1.7 }}>
            Functional map approach. Concise and readable.{'\n\n'}
            Best for small to medium data where code clarity matters.
          </Text>
          <Text variant="caption" x={25} y={320} w={790} style={{ fontFamily: 'monospace' }}>
            const result = arr.map(x =&gt; x * 2);
          </Text>
        </Cardbox>
      </Anim>

      <Text variant="caption" x={360} y={1027} w={1200} style={{ textAlign: 'center' }}>{script}</Text>
    </>
  )
}
