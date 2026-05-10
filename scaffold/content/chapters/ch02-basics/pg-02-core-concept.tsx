'use client'

import { Anim } from '@/components/anim'
import { Text } from '@/components/text'
import { Cardbox } from '@/components/cardbox'
import { SVG } from '@/components/svg'
import { BarChart } from '@/components/graph'
import { useNarration } from '@/components/player/narration-context'
import { colors } from '@/components/theme'

const chartData = [
  { label: 'SVM', value: 65 },
  { label: 'RF', value: 78 },
  { label: 'NN', value: 92 },
  { label: 'KNN', value: 55 },
  { label: 'XGB', value: 88 },
]

export default function Pg02CoreConcept() {
  const { script } = useNarration()

  return (
    <>
      <Anim type="slide-left" delay={0} w={8} h={70} x={100} y={60}>
        <div style={{ width: '100%', height: '100%', background: colors.brand.secondary, borderRadius: 4 }} />
      </Anim>

      <Anim type="fade-in" delay={100} x={128} y={62} w={500} h={70}>
        <Text variant="h2" x={0} y={0}>算法性能对比</Text>
      </Anim>

      <Anim type="fade-in" delay={200} x={128} y={128} w={600} h={30}>
        <Text variant="caption" x={0} y={0}>不同模型在标准测试集上的准确率对比</Text>
      </Anim>

      <Anim type="fade-in" delay={350} w={760} h={420} x={100} y={190}>
        <Cardbox variant="elevated" x={0} y={0} w={760} h={420}>
          <SVG x={24} y={16} w={16} h={16} viewBox="0 0 24 24">
            <path d="M3 3v18h18v-2H5V3H3zm4 12h2v-4H7v4zm4 0h2V7h-2v8zm4 0h2v-6h-2v6z" fill={colors.brand.secondary} />
          </SVG>
          <Text variant="caption" x={48} y={16} w={300}>准确率 (%)</Text>
          <BarChart data={chartData} x={40} y={48} w={680} h={340} />
        </Cardbox>
      </Anim>

      <Anim type="slide-right" delay={500} w={380} h={260} x={940} y={220}>
        <Cardbox variant="bordered" x={0} y={0} w={380} h={260}>
          <SVG x={24} y={24} w={24} h={24} viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill={colors.semantic.success} />
          </SVG>
          <Text variant="h3" x={24} y={62} w={332}>关键发现</Text>
          <Text variant="body" x={24} y={112} w={332}>
            神经网络以 92% 的准确率领先。XGBoost 其次，适合结构化数据。
          </Text>
          <Text variant="caption" x={24} y={190} w={332}>
            * 基于相同测试集，超参数已调优
          </Text>
        </Cardbox>
      </Anim>

      <Text variant="caption" x={80} y={1020} w={800}>{script}</Text>
    </>
  )
}
