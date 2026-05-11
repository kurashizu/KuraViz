'use client'

import { Anim } from '@/components/anim'
import { Text } from '@/components/text'
import { Cardbox } from '@/components/cardbox'
import { colors } from '@/components/theme'
import { useNarration } from '@/components/player/narration-context'

export default function Pg02Chart() {
  const { script } = useNarration()
  return (
    <>
      <Anim type="slide-left" delay={0} w={8} h={70} x={100} y={70}>
        <div style={{ width: '100%', height: '100%', background: colors.brand.accent, borderRadius: 4 }} />
      </Anim>

      <Anim type="fade-in" delay={100} x={128} y={72} w={600} h={70}>
        <Text variant="h2" x={0} y={0}>Charts & Insights</Text>
      </Anim>

      <Anim type="fade-in" delay={200} x={128} y={152} w={800} h={35}>
        <Text variant="caption" x={0} y={0}>Chart on the left, insight card on the right</Text>
      </Anim>

      <Anim type="fade-in" delay={350} x={140} y={210} w={1100} h={460}>
        <Cardbox variant="elevated" x={0} y={0} w={1100} h={460}>
          <Text variant="body" x={30} y={25} w={1040} style={{ fontWeight: 600, color: colors.brand.accent }}>
            Model Accuracy Comparison
          </Text>
          <svg style={{ position: 'absolute', left: 40, top: 80, width: 1020, height: 350 }} viewBox="0 0 1020 350">
            <text x="0" y="22" fill={colors.text.dim} fontSize={22}>100%</text>
            <line x1="0" y1="28" x2="1020" y2="28" stroke={colors.surface.border} strokeWidth={1} />
            <text x="0" y="98" fill={colors.text.dim} fontSize={22}>75%</text>
            <line x1="0" y1="104" x2="1020" y2="104" stroke={colors.surface.border} strokeWidth={1} />
            <text x="0" y="174" fill={colors.text.dim} fontSize={22}>50%</text>
            <line x1="0" y1="180" x2="1020" y2="180" stroke={colors.surface.border} strokeWidth={1} />
            <text x="0" y="250" fill={colors.text.dim} fontSize={22}>25%</text>
            <line x1="0" y1="256" x2="1020" y2="256" stroke={colors.surface.border} strokeWidth={1} />
            {[
              { label: 'Decision Tree', val: 60, color: colors.brand.primary },
              { label: 'Random Forest', val: 85, color: colors.brand.secondary },
              { label: 'SVM', val: 72, color: colors.brand.accent },
              { label: 'KNN', val: 55, color: '#22C55E' },
              { label: 'MLP', val: 90, color: '#EC4899' },
            ].map((m, i) => {
              const x = 80 + i * 180
              const h = (m.val / 100) * 220
              return (
                <g key={i}>
                  <rect x={x} y={256 - h} width={110} height={h} rx={4} fill={m.color} opacity={0.8} />
                  <text x={x + 55} y={296} textAnchor="middle" fill={colors.text.dim} fontSize={22}>{m.label}</text>
                  <text x={x + 55} y={256 - h - 10} textAnchor="middle" fill={colors.text.primary} fontSize={22} fontWeight={700}>{m.val}%</text>
                </g>
              )
            })}
          </svg>
        </Cardbox>
      </Anim>

      <Anim type="fade-in" delay={450} x={1300} y={210} w={480} h={400}>
        <Cardbox variant="bordered" x={0} y={0} w={480} h={400}>
          <svg style={{ position: 'absolute', left: 20, top: 20, width: 28, height: 28 }} viewBox="0 0 28 28">
            <circle cx="14" cy="14" r="14" fill={`${colors.brand.accent}26`} />
            <path d="M8 14l3 3 7-7" fill="none" stroke={colors.brand.accent} strokeWidth={2} strokeLinecap="round" />
          </svg>
          <Text variant="body" x={20} y={58} w={440} style={{ fontWeight: 600 }}>
            Key Findings
          </Text>
          <Text variant="caption" x={20} y={110} w={440}>
            MLP achieves the highest accuracy at 90%, followed by Random Forest at 85%. Traditional models like KNN and Decision Tree underperform.
          </Text>
          <Text variant="caption" x={20} y={290} w={440}>
            Recommendation: prioritize MLP or Random Forest for production deployment.
          </Text>
        </Cardbox>
      </Anim>

      <Text variant="caption" x={360} y={1027} w={1200} style={{ textAlign: 'center' }}>{script}</Text>
    </>
  )
}
