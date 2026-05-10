'use client'

import { Anim } from '@/components/anim'
import { Text } from '@/components/text'
import { Cardbox } from '@/components/cardbox'
import { Mermaid } from '@/components/markdown/mermaid'
import { useNarration } from '@/components/player/narration-context'
import { colors } from '@/components/theme'

export default function Pg05Flowchart() {
  const { script } = useNarration()

  return (
    <>
      <Anim type="slide-left" delay={0} w={8} h={70} x={100} y={70}>
        <div style={{ width: '100%', height: '100%', background: colors.brand.accent, borderRadius: 4 }} />
      </Anim>

      <Anim type="fade-in" delay={100} x={128} y={72} w={600} h={70}>
        <Text variant="h2" x={0} y={0}>流程图</Text>
      </Anim>

      <Anim type="fade-in" delay={200} x={128} y={152} w={600} h={35}>
        <Text variant="caption" x={0} y={0}>Mermaid flowchart 展示流程分支</Text>
      </Anim>

      <Anim type="fade-in" delay={350} w={1720} h={760} x={100} y={210}>
        <Cardbox variant="elevated" x={0} y={0} w={1720} h={760}>
          <Mermaid chart={'flowchart TB\n  Start([开始]) --> Process[处理数据]\n  Process --> Condition{验证通过?}\n  Condition -->|Yes| Success([完成])\n  Condition -->|No| Fix[修正错误]\n  Fix --> Process'} x={20} y={20} w={1680} h={720} />
        </Cardbox>
      </Anim>

      <Text variant="caption" x={320} y={1000} w={1280} style={{ textAlign: 'center' }}>{script}</Text>
    </>
  )
}
