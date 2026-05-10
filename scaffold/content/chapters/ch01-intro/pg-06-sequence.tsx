'use client'

import { Anim } from '@/components/anim'
import { Text } from '@/components/text'
import { Cardbox } from '@/components/cardbox'
import { Mermaid } from '@/components/markdown/mermaid'
import { useNarration } from '@/components/player/narration-context'
import { colors } from '@/components/theme'

export default function Pg06Sequence() {
  const { script } = useNarration()

  return (
    <>
      <Anim type="slide-left" delay={0} w={8} h={70} x={100} y={70}>
        <div style={{ width: '100%', height: '100%', background: colors.brand.accent, borderRadius: 4 }} />
      </Anim>

      <Anim type="fade-in" delay={100} x={128} y={72} w={600} h={70}>
        <Text variant="h2" x={0} y={0}>时序图</Text>
      </Anim>

      <Anim type="fade-in" delay={200} x={128} y={152} w={600} h={35}>
        <Text variant="caption" x={0} y={0}>Mermaid sequenceDiagram 展示交互流程</Text>
      </Anim>

      <Anim type="fade-in" delay={350} w={1720} h={760} x={100} y={210}>
        <Cardbox variant="elevated" x={0} y={0} w={1720} h={760}>
          <Mermaid chart={'sequenceDiagram\n  participant U as User\n  participant A as App\n  participant D as Database\n  U->>A: 提交请求\n  A->>D: 查询数据\n  D-->>A: 返回结果\n  A-->>U: 显示页面\n  alt 出错时\n    A-->>U: 显示错误信息\n  end'} x={20} y={20} w={1680} h={720} />
        </Cardbox>
      </Anim>

      <Text variant="caption" x={320} y={1000} w={1280} style={{ textAlign: 'center' }}>{script}</Text>
    </>
  )
}
