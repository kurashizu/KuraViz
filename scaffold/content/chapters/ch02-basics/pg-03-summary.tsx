'use client'

import { Anim } from '@/components/anim'
import { Text } from '@/components/text'
import { SVG } from '@/components/svg'
import { useNarration } from '@/components/player/narration-context'

export default function Pg03Summary() {
  const { script } = useNarration()

  const points = [
    '机器学习是 AI 的核心分支',
    '三大范式：监督、无监督、强化学习',
    '模型选择取决于数据规模与任务类型',
    '实践出真知 — 动手 coding 是关键',
  ]

  return (
    <>
      <Anim type="slide-left" delay={0} x={160} y={80} w={800} h={60}>
        <Text variant="h2" x={0} y={0} w={800}>本章小结</Text>
      </Anim>

      {points.map((p, i) => (
        <Anim key={i} type="slide-left" delay={300 + i * 250} w={760} h={56} x={160} y={180 + i * 72}>
          <SVG x={0} y={12} w={32} h={32} viewBox="0 0 32 32">
            <circle cx="16" cy="16" r="16" fill="#6366F1" />
            <text x="16" y="21" textAnchor="middle" fill="#fff" fontSize={14} fontWeight={700}>{i + 1}</text>
          </SVG>
          <Text variant="body" x={48} y={10} w={700}>{p}</Text>
        </Anim>
      ))}

      <Text variant="caption" x={80} y={1020} w={800}>{script}</Text>
    </>
  )
}
