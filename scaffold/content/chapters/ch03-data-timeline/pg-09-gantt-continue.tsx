'use client'

import { Anim } from '@/components/anim'
import { Text } from '@/components/text'
import { Cardbox } from '@/components/cardbox'
import { Mermaid } from '@/components/markdown/mermaid'
import { colors } from '@/components/theme'
import { useNarration } from '@/components/player/narration-context'

export default function Pg09GanttContinue() {
  const { script } = useNarration()
  return (
    <>
      <Anim type="fade-in" delay={0} x={100} y={80} w={1720} h={400}>
        <Cardbox variant="default" x={0} y={0} w={1720} h={400}>
          <Mermaid x={20} y={20} w={1680} h={360} chart={`
gantt
  title Project Timeline
  dateFormat  YYYY-MM-DD
  section Planning
  Requirements      :done, a1, 2024-01-01, 14d
  Architecture      :done, a2, after a1, 10d
  section Development
  Frontend          :active, b1, after a2, 21d
  Backend           :b2, after a2, 21d
  Testing           :c1, after b1, 10d
  section Launch
  Staging           :d1, after c1, 5d
  Production        :d2, after d1, 3d
          `} />
        </Cardbox>
      </Anim>

      <Anim type="fade-in" delay={200} x={100} y={520} w={840} h={440}>
        <Cardbox variant="default" x={0} y={0} w={840} h={440}>
          <Text variant="body" x={20} y={20} w={800} style={{ fontWeight: 600, color: colors.brand.accent }}>
            Project Phases
          </Text>
          <Text variant="caption" x={20} y={70} w={800} style={{ lineHeight: 1.7 }}>
            <Text variant="body" as="span" style={{ fontWeight: 600 }}>Planning</Text>{'\n'}Requirements gathering and architecture design. These tasks must complete before development begins.{'\n\n'}
            <Text variant="body" as="span" style={{ fontWeight: 600 }}>Development</Text>{'\n'}Frontend and backend are built in parallel. Testing starts after the frontend is ready.{'\n\n'}
            <Text variant="body" as="span" style={{ fontWeight: 600 }}>Launch</Text>{'\n'}Staging deployment for UAT, followed by production rollout with monitoring.
          </Text>
        </Cardbox>
      </Anim>

      <Anim type="fade-in" delay={300} x={1000} y={520} w={820} h={440}>
        <Cardbox variant="default" x={0} y={0} w={820} h={440}>
          <Text variant="body" x={20} y={20} w={780} style={{ fontWeight: 600, color: colors.brand.accent }}>
            Task Status
          </Text>
          <Text variant="caption" x={20} y={70} w={780} style={{ lineHeight: 1.7 }}>
            <Text variant="body" as="span" style={{ fontWeight: 600, color: colors.semantic.success }}>done</Text>{'\n'}Completed task. The Requirements and Architecture tasks are marked done.{'\n\n'}
            <Text variant="body" as="span" style={{ fontWeight: 600, color: colors.semantic.info }}>active</Text>{'\n'}Currently in progress. The Frontend task is active.{'\n\n'}
            <Text variant="body" as="span" style={{ fontWeight: 600 }}>Dependencies</Text>{'\n'}Tasks with after a1 run sequentially. Parallel tasks like Frontend and Backend share the same start trigger.
          </Text>
        </Cardbox>
      </Anim>

      <Text variant="caption" x={360} y={1027} w={1200} style={{ textAlign: 'center' }}>{script}</Text>
    </>
  )
}
