'use client'

import { Anim } from '@/components/anim'
import { Text } from '@/components/text'
import { Cardbox } from '@/components/cardbox'
import { Mermaid } from '@/components/markdown/mermaid'
import { useNarration } from '@/components/player/narration-context'
import { colors } from '@/components/theme'

export default function Pg04Showcase() {
  const { script } = useNarration()

  return (
    <>
      <Anim type="slide-left" delay={0} w={8} h={70} x={100} y={70}>
        <div style={{ width: '100%', height: '100%', background: colors.brand.accent, borderRadius: 4 }} />
      </Anim>

      <Anim type="fade-in" delay={100} x={128} y={72} w={600} h={70}>
        <Text variant="h2" x={0} y={0}>Mermaid 图表展示</Text>
      </Anim>

      <Anim type="fade-in" delay={200} x={128} y={152} w={600} h={35}>
        <Text variant="caption" x={0} y={0}>思维导图、流程图、时序图</Text>
      </Anim>

      <Anim type="fade-in" delay={350} w={560} h={420} x={100} y={200}>
        <Cardbox variant="elevated" x={0} y={0} w={560} h={420}>
          <Text variant="h3" x={20} y={16} w={520}>思维导图</Text>
          <Mermaid chart={'mindmap\n  AI\n    Machine Learning\n      Supervised\n      Unsupervised\n      Reinforcement\n    NLP\n    Computer Vision'} x={20} y={55} w={520} h={345} />
        </Cardbox>
      </Anim>

      <Anim type="slide-right" delay={500} w={560} h={420} x={700} y={200}>
        <Cardbox variant="elevated" x={0} y={0} w={560} h={420}>
          <Text variant="h3" x={20} y={16} w={520}>流程图</Text>
          <Mermaid chart={'flowchart LR\n  A[Start] --> B{Check}\n  B -->|Yes| C[OK]\n  B -->|No| D[Fix]\n  D --> B'} x={20} y={55} w={520} h={345} />
        </Cardbox>
      </Anim>

      <Anim type="fade-in" delay={650} w={560} h={280} x={100} y={660}>
        <Cardbox variant="default" x={0} y={0} w={560} h={280}>
          <Text variant="h3" x={20} y={16} w={520}>时序图</Text>
          <Mermaid chart={'sequenceDiagram\n  User->>App: Request\n  App->>DB: Query\n  DB-->>App: Data\n  App-->>User: Response'} x={20} y={55} w={520} h={205} />
        </Cardbox>
      </Anim>

      <Anim type="fade-in" delay={800} w={560} h={280} x={700} y={660}>
        <Cardbox variant="default" x={0} y={0} w={560} h={280}>
          <Text variant="h3" x={20} y={16} w={520}>甘特图</Text>
          <Mermaid chart={'gantt\n  title Project\n  dateFormat YYYY-MM-DD\n  section Phase1\n  Task1 :a1, 2024-01-01, 30d\n  Task2 :after a1, 20d'} x={20} y={55} w={520} h={205} />
        </Cardbox>
      </Anim>

      <Text variant="caption" x={320} y={1000} w={1280} style={{ textAlign: 'center' }}>{script}</Text>
    </>
  )
}
