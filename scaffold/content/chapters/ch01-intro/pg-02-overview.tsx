'use client'

import { Anim } from '@/components/anim'
import { Text } from '@/components/text'
import { Cardbox } from '@/components/cardbox'
import { SVG } from '@/components/svg'
import { useNarration } from '@/components/player/narration-context'
import { colors } from '@/components/theme'

const items = [
  { num: '01', label: '什么是机器学习？', desc: '定义、历史与应用场景' },
  { num: '02', label: '监督学习 vs 无监督学习', desc: '两者的核心区别与典型算法' },
  { num: '03', label: '常见算法概览', desc: '回归、分类、聚类、降维' },
  { num: '04', label: '本课程的学习路径', desc: '从入门到实践的路线图' },
]

export default function Pg02Overview() {
  const { script } = useNarration()

  return (
    <>
      <Anim type="slide-left" delay={0} w={8} h={70} x={100} y={80}>
        <div style={{ width: '100%', height: '100%', background: colors.brand.primary, borderRadius: 4 }} />
      </Anim>

      <Anim type="fade-in" delay={100} x={128} y={80} w={600} h={70}>
        <Text variant="h2" x={0} y={0}>课程概览</Text>
      </Anim>

      <Anim type="fade-in" delay={200} x={128} y={150} w={600} h={30}>
        <Text variant="caption" x={0} y={0}>本章将介绍以下核心内容</Text>
      </Anim>

      <div style={{ position: 'absolute', left: 160, top: 220 }}>
        {items.map((item, i) => (
          <Anim key={i} type="slide-right" delay={400 + i * 260} w={760} h={120} x={0} y={i * 136}>
            <Cardbox variant="default" x={0} y={0} w={760} h={120}>
              <SVG x={24} y={24} w={48} h={48} viewBox="0 0 48 48">
                <circle cx="24" cy="24" r="24" fill={colors.surface.card} />
                <circle cx="24" cy="24" r="20" fill="none" stroke={colors.brand.primary} strokeWidth={1} />
                <text x="24" y="29" textAnchor="middle" fill={colors.brand.primary} fontSize={16} fontWeight={700}>{item.num}</text>
              </SVG>
              <Text variant="body" x={88} y={20} w={640}>{item.label}</Text>
              <Text variant="caption" x={88} y={72} w={640}>{item.desc}</Text>
            </Cardbox>
          </Anim>
        ))}
      </div>

      <Text variant="caption" x={80} y={1030} w={800}>{script}</Text>
    </>
  )
}
