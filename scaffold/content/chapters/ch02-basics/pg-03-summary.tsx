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
      <Anim type="slide-left" delay={0} w={8} h={70} x={120} y={72}>
        <div style={{ width: '100%', height: '100%', background: colors.brand.accent, borderRadius: 4 }} />
      </Anim>

      <Anim type="fade-in" delay={100} x={148} y={72} w={600} h={70}>
        <Text variant="h2" x={0} y={0}>本章小结</Text>
      </Anim>

      <Anim type="fade-in" delay={200} x={148} y={140} w={600} h={30}>
        <Text variant="caption" x={0} y={0}>回顾本章核心知识点</Text>
      </Anim>

      <div style={{ position: 'absolute', left: 160, top: 210 }}>
        {points.map((p, i) => (
          <Anim key={i} type="slide-left" delay={350 + i * 260} w={760} h={96} x={0} y={i * 112}>
            <Cardbox variant="default" x={0} y={0} w={760} h={96}>
              <SVG x={24} y={28} w={36} h={36} viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="18" fill={colors.brand.accent} fillOpacity={0.15} />
                <circle cx="18" cy="18" r="11" fill="none" stroke={colors.brand.accent} strokeWidth={1.5} />
                <path d="M12 18l4 4 8-8" fill="none" stroke={colors.brand.accent} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              </SVG>
              <Text variant="body" x={76} y={26} w={660}>{p}</Text>
            </Cardbox>
          </Anim>
        ))}
      </div>

      <Text variant="caption" x={660} y={1020} w={600} style={{ textAlign: "center" }}>{script}</Text>
    </>
  )
}
