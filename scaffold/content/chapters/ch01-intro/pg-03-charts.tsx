'use client'

import { Anim } from '@/components/anim'
import { Text } from '@/components/text'
import { Cardbox } from '@/components/cardbox'
import { SVG } from '@/components/svg'
import { Markdown } from '@/components/markdown'
import { BarChart, LineChart, Axis } from '@/components/graph'
import { useNarration } from '@/components/player/narration-context'
import { colors } from '@/components/theme'

const barData = [
  { label: 'SVM', value: 65 },
  { label: 'RF', value: 78 },
  { label: 'NN', value: 92 },
  { label: 'KNN', value: 55 },
  { label: 'XGB', value: 88 },
]

const lineData = [
  { label: 'Q1', value: 30 },
  { label: 'Q2', value: 55 },
  { label: 'Q3', value: 72 },
  { label: 'Q4', value: 88 },
]

const formula = `## 核心公式

在机器学习中，线性回归的损失函数定义为：

$$L(\\theta) = \\frac{1}{2m} \\sum_{i=1}^{m} (h_\\theta(x^{(i)}) - y^{(i)})^2$$

其中 $h_\\theta(x) = \\theta^T x$ 是假设函数。`

export default function Pg03Charts() {
  const { script } = useNarration()

  return (
    <>
      <Anim type="slide-left" delay={0} w={8} h={70} x={100} y={70}>
        <div style={{ width: '100%', height: '100%', background: colors.brand.secondary, borderRadius: 4 }} />
      </Anim>

      <Anim type="fade-in" delay={100} x={128} y={72} w={600} h={70}>
        <Text variant="h2" x={0} y={0}>数据可视化</Text>
      </Anim>

      <Anim type="fade-in" delay={200} x={128} y={140} w={600} h={30}>
        <Text variant="caption" x={0} y={0}>模型性能对比与核心公式展示</Text>
      </Anim>

      <Anim type="fade-in" delay={350} w={540} h={340} x={100} y={200}>
        <Cardbox variant="elevated" x={0} y={0} w={540} h={340}>
          <SVG x={20} y={16} w={16} h={16} viewBox="0 0 24 24">
            <path d="M3 3v18h18v-2H5V3H3zm4 12h2v-4H7v4zm4 0h2V7h-2v8zm4 0h2v-6h-2v6z" fill={colors.brand.secondary} />
          </SVG>
          <Text variant="caption" x={44} y={16} w={300}>准确率 (%)</Text>
          <BarChart data={barData} x={20} y={44} w={500} h={280} />
        </Cardbox>
      </Anim>

      <Anim type="fade-in" delay={450} w={540} h={340} x={680} y={200}>
        <Cardbox variant="elevated" x={0} y={0} w={540} h={340}>
          <SVG x={20} y={16} w={16} h={16} viewBox="0 0 24 24">
            <path d="M3 3v18h18v-2H5V3H3zm4 12h2v-4H7v4zm4 0h2V7h-2v8zm4 0h2v-6h-2v6z" fill={colors.brand.secondary} />
          </SVG>
          <Text variant="caption" x={44} y={16} w={300}>训练损失下降曲线</Text>
          <LineChart data={lineData} x={20} y={44} w={500} h={280} />
        </Cardbox>
      </Anim>

      <Anim type="fade-in" delay={550} w={1120} h={400} x={100} y={570}>
        <Cardbox variant="default" x={0} y={0} w={1120} h={400}>
          <SVG x={20} y={16} w={16} h={16} viewBox="0 0 24 24">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" fill={colors.brand.secondary} />
          </SVG>
          <Text variant="caption" x={44} y={16} w={300}>核心公式</Text>
          <Markdown content={formula} x={20} y={40} w={1080} h={340} />
        </Cardbox>
      </Anim>

      <Text variant="caption" x={320} y={1000} w={1280} style={{ textAlign: 'center' }}>{script}</Text>
    </>
  )
}
