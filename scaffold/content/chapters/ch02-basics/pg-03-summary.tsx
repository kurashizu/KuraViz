'use client'

import { Anim } from '@/components/anim'
import { Text } from '@/components/text'
import { Cardbox } from '@/components/cardbox'
import { SVG } from '@/components/svg'
import { useNarration } from '@/components/player/narration-context'
import { colors } from '@/components/theme'

const points = [
  '机器学习是 AI 的核心分支',
  '三大范式：监督、无监督、强化学习',
  '模型选择取决于数据规模与任务类型',
  '实践出真知 — 动手 coding 是关键',
]

export default function Pg03Summary() {
  const { script } = useNarration()

  return (
    <>
      <Anim type="slide-left" delay={0} w={8} h={56} x={120} y={80}>
        <div style={{ width: '100%', height: '100%', background: colors.brand.accent, borderRadius: 4 }} />
      </Anim>

      <Anim type="fade-in" delay={100} x={148} y={84} w={600} h={44}>
        <Text variant="h2" x={0} y={0}>本章小结</Text>
      </Anim>

      <Anim type="fade-in" delay={200} x={148} y={126} w={600} h={24}>
        <Text variant="caption" x={0} y={0}>回顾本章核心知识点</Text>
      </Anim>

      <div style={{ position: 'absolute', left: 160, top: 190 }}>
        {points.map((p, i) => (
          <Anim key={i} type="slide-left" delay={350 + i * 250} w={760} h={76} x={0} y={i * 88}>
            <Cardbox variant="default" x={0} y={0} w={760} h={76}>
              <SVG x={24} y={22} w={32} h={32} viewBox="0 0 32 32">
                <circle cx="16" cy="16" r="16" fill={colors.brand.accent} fillOpacity={0.15} />
                <circle cx="16" cy="16" r="10" fill="none" stroke={colors.brand.accent} strokeWidth={1.5} />
                <path d="M11 16l3 3 7-7" fill="none" stroke={colors.brand.accent} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              </SVG>
              <Text variant="body" x={72} y={22} w={660}>{p}</Text>
            </Cardbox>
          </Anim>
        ))}
      </div>

      <Text variant="caption" x={80} y={1020} w={800}>{script}</Text>
    </>
  )
}
