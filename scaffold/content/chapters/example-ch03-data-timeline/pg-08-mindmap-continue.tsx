'use client'

import { Anim } from '@/components/anim'
import { Text } from '@/components/text'
import { Cardbox } from '@/components/cardbox'
import { Mermaid } from '@/components/markdown/mermaid'
import { colors } from '@/components/theme'
import { useNarration } from '@/components/player/narration-context'

export default function Pg08MindmapContinue() {
  const { script } = useNarration()
  return (
    <>
      <Anim type="fade-in" delay={0} x={100} y={80} w={1720} h={920}>
        <Cardbox variant="default" x={0} y={0} w={1720} h={920}>
          <Mermaid x={20} y={20} w={1680} h={880} chart={`
mindmap
  Web Development
    Frontend
      React
      TypeScript
      CSS / Tailwind
    Backend
      Node.js
      Python / Django
      Database
    DevOps
      Docker
      CI / CD
      Cloud (AWS)
          `} />
        </Cardbox>
      </Anim>

      <Text variant="caption" x={360} y={1027} w={1200} style={{ textAlign: 'center' }}>{script}</Text>
    </>
  )
}
