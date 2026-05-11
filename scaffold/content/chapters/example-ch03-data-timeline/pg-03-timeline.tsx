'use client'

import { Anim } from '@/components/anim'
import { Text } from '@/components/text'
import { Cardbox } from '@/components/cardbox'
import { colors } from '@/components/theme'
import { useNarration } from '@/components/player/narration-context'

const steps = [
  { num: '01', title: 'Requirements', desc: 'Gather requirements from stakeholders and define scope' },
  { num: '02', title: 'Design', desc: 'System architecture, database design, API definitions' },
  { num: '03', title: 'Development', desc: 'Agile development with bi-weekly sprints and CI' },
]

export default function Pg03Timeline() {
  const { script } = useNarration()
  return (
    <>
      <Anim type="slide-left" delay={0} w={8} h={70} x={100} y={70}>
        <div style={{ width: '100%', height: '100%', background: colors.brand.accent, borderRadius: 4 }} />
      </Anim>

      <Anim type="fade-in" delay={100} x={128} y={72} w={600} h={70}>
        <Text variant="h2" x={0} y={0}>Process Timeline</Text>
      </Anim>

      <Anim type="fade-in" delay={200} x={128} y={152} w={800} h={35}>
        <Text variant="caption" x={0} y={0}>Horizontal step cards evenly distributed</Text>
      </Anim>

      {steps.map((step, i) => {
        const x = 160 + i * 540
        return (
          <Anim key={i} type="fade-in" delay={350 + i * 200} x={x} y={240} w={440} h={240}>
            <Cardbox variant="default" x={0} y={0} w={440} h={240}>
              <Cardbox variant="bordered" x={20} y={18} w={90} h={44}>
                <Text variant="caption" x={0} y={7} w={80} style={{ textAlign: 'center', color: colors.brand.accent }}>
                  {step.num}
                </Text>
              </Cardbox>
              <Text variant="body" x={24} y={76} w={392}>{step.title}</Text>
              <Text variant="caption" x={24} y={136} w={392} style={{ lineHeight: 1.6 }}>{step.desc}</Text>
            </Cardbox>
          </Anim>
        )
      })}

      <Text variant="caption" x={360} y={994} w={1200} style={{ textAlign: 'center' }}>{script}</Text>
    </>
  )
}
