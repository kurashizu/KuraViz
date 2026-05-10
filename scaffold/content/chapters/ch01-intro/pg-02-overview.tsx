'use client'

import { Anim } from '@/components/anim'
import { Text } from '@/components/text'
import { Cardbox } from '@/components/cardbox'
import { useNarration } from '@/components/player/narration-context'

export default function Pg02Overview() {
  const { script } = useNarration()

  const items = [
    '什么是机器学习？',
    '监督学习 vs 无监督学习',
    '常见算法概览',
    '本课程的学习路径',
  ]

  return (
    <>
      <Anim type="fade-in" delay={0} x={120} y={80} w={800} h={60}>
        <Text variant="h2" x={0} y={0} w={800}>课程概览</Text>
      </Anim>

      {items.map((item, i) => (
        <Anim key={i} type="slide-right" delay={300 + i * 300} w={700} h={60} x={120} y={180 + i * 72}>
          <Cardbox variant="default" x={0} y={0} w={700} h={60}>
            <Text variant="body" x={20} y={14} w={660}>{i + 1}. {item}</Text>
          </Cardbox>
        </Anim>
      ))}

      <Text variant="caption" x={80} y={1020} w={800}>{script}</Text>
    </>
  )
}
