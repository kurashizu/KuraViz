'use client'

import { Anim } from '@/components/anim'
import { Text } from '@/components/text'
import { Cardbox } from '@/components/cardbox'
import { Mermaid } from '@/components/markdown/mermaid'
import { colors } from '@/components/theme'
import { useNarration } from '@/components/player/narration-context'

export default function Pg05Mermaid() {
  const { script } = useNarration()
  return (
    <>
      <Anim type="slide-left" delay={0} w={8} h={70} x={100} y={70}>
        <div style={{ width: '100%', height: '100%', background: colors.brand.accent, borderRadius: 4 }} />
      </Anim>

      <Anim type="fade-in" delay={100} x={128} y={72} w={600} h={70}>
        <Text variant="h2" x={0} y={0}>Mermaid Diagram</Text>
      </Anim>

      <Anim type="fade-in" delay={200} x={128} y={152} w={800} h={35}>
        <Text variant="caption" x={0} y={0}>Flowchart with conditions and branches</Text>
      </Anim>

      <Anim type="fade-in" delay={350} x={100} y={210} w={1720} h={680}>
        <Cardbox variant="default" x={0} y={0} w={1720} h={680}>
          <Mermaid x={20} y={20} w={1680} h={640} chart={`
flowchart LR
    A([Start]) --> B{Check input}
    B -->|Valid| C[Process data]
    B -->|Invalid| D[Show error]
    C --> E{Retry?}
    E -->|Yes| B
    E -->|No| F[Save result]
    D --> F
    F --> G([End])
          `} />
        </Cardbox>
      </Anim>

      <Text variant="caption" x={360} y={1027} w={1200} style={{ textAlign: 'center' }}>{script}</Text>
    </>
  )
}
