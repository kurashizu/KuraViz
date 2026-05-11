'use client'

import { Anim } from '@/components/anim'
import { Text } from '@/components/text'
import { Cardbox } from '@/components/cardbox'
import { colors } from '@/components/theme'
import { useNarration } from '@/components/player/narration-context'

const items = [
  { label: 'Project Planning', desc: 'Define goals and scope, create a detailed plan', icon: '01' },
  { label: 'Prototyping', desc: 'Build wireframes and interactive prototypes to validate', icon: '02' },
  { label: 'Development', desc: 'Parallel front-end and back-end development with CI', icon: '03' },
  { label: 'Testing & Deploy', desc: 'Automated testing, manual QA, and production deployment', icon: '04' },
]

export default function Pg04Checklist() {
  const { script } = useNarration()
  return (
    <>
      <Anim type="slide-left" delay={0} w={8} h={70} x={100} y={70}>
        <div style={{ width: '100%', height: '100%', background: colors.brand.secondary, borderRadius: 4 }} />
      </Anim>

      <Anim type="fade-in" delay={100} x={128} y={72} w={600} h={70}>
        <Text variant="h2" x={0} y={0}>Checklist</Text>
      </Anim>

      <Anim type="fade-in" delay={200} x={128} y={152} w={600} h={35}>
        <Text variant="caption" x={0} y={0}>Vertical card stack with icons and descriptions</Text>
      </Anim>

      {items.map((item, i) => (
        <Anim key={i} type="slide-left" delay={350 + i * 250} w={1400} h={130} x={260} y={200 + i * 160}>
          <Cardbox variant="default" x={0} y={0} w={1400} h={130}>
            <svg style={{ position: 'absolute', left: 36, top: 30, width: 52, height: 52 }} viewBox="0 0 52 52">
              <circle cx="26" cy="26" r="26" fill={`${colors.brand.secondary}26`} />
              <circle cx="26" cy="26" r="21" fill="none" stroke={colors.brand.secondary} strokeWidth={1.5} />
              <text x="26" y="31" textAnchor="middle" fill={colors.brand.secondary} fontSize={18} fontWeight={700}>{item.icon}</text>
            </svg>
            <Text variant="body" x={108} y={26} w={1250}>{item.label}</Text>
            <Text variant="caption" x={108} y={78} w={1250}>{item.desc}</Text>
          </Cardbox>
        </Anim>
      ))}

      <Text variant="caption" x={360} y={961} w={1200} style={{ textAlign: 'center' }}>{script}</Text>
    </>
  )
}
