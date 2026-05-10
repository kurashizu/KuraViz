'use client'

import { Anim } from '@/components/anim'
import { Text } from '@/components/text'
import { Cardbox } from '@/components/cardbox'
import { BarChart } from '@/components/graph'
import { useNarration } from '@/components/player/narration-context'

export default function Pg02CoreConcept() {
  const { script } = useNarration()

  const chartData = [
    { label: 'SVM', value: 65 },
    { label: 'Random Forest', value: 78 },
    { label: 'Neural Net', value: 92 },
    { label: 'KNN', value: 55 },
    { label: 'XGBoost', value: 88 },
  ]

  return (
    <>
      <Anim type="fade-in" delay={0} x={80} y={60} w={700} h={50}>
        <Text variant="h2" x={0} y={0} w={600}>算法性能对比</Text>
      </Anim>

      <Anim type="fade-in" delay={150} x={80} y={120} w={700} h={40}>
        <Text variant="body" x={0} y={0} w={700}>不同模型在标准测试集上的准确率对比</Text>
      </Anim>

      <Anim type="fade-in" delay={300} w={700} h={400} x={80} y={200}>
        <Cardbox variant="elevated" x={0} y={0} w={700} h={400}>
          <BarChart data={chartData} x={24} y={24} w={652} h={352} />
        </Cardbox>
      </Anim>

      <Anim type="slide-right" delay={500} w={440} h={220} x={860} y={200}>
        <Cardbox variant="bordered" x={0} y={0} w={440} h={220}>
          <Text variant="h3" x={24} y={20} w={392}>关键发现</Text>
          <Text variant="body" x={24} y={70} w={392}>
            神经网络在大多数任务上表现最优，但训练成本也最高。
          </Text>
        </Cardbox>
      </Anim>

      <Text variant="caption" x={80} y={1020} w={800}>{script}</Text>
    </>
  )
}
