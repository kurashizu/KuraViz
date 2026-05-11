'use client'

import { Anim } from '@/components/anim'
import { Text } from '@/components/text'
import { Cardbox } from '@/components/cardbox'
import { colors } from '@/components/theme'
import { useNarration } from '@/components/player/narration-context'

const items = [
  { label: 'Code Review', desc: 'Peer review for code quality and best practices', icon: '05' },
  { label: 'Staging Deploy', desc: 'Deploy to staging environment for UAT', icon: '06' },
  { label: 'Performance Tuning', desc: 'Profile and optimize bottlenecks', icon: '07' },
  { label: 'Production Launch', desc: 'Roll out to production with monitoring', icon: '08' },
]

export default function Pg05ChecklistContinue() {
  const { script } = useNarration()
  return (
    <>
      {/* Continue page: no accent bar, no title — content continues from previous page */}

      {items.map((item, i) => (
        <Anim key={i} type="slide-left" delay={350 + i * 250} w={1400} h={130} x={260} y={80 + i * 160}>
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

      <Text variant="caption" x={360} y={1027} w={1200} style={{ textAlign: 'center' }}>{script}</Text>
    </>
  )
}
