'use client'

import { Anim } from '@/components/anim'
import { Text } from '@/components/text'
import { Cardbox } from '@/components/cardbox'
import { SVG } from '@/components/svg'
import { MindMap, Axis } from '@/components/graph'
import { useNarration } from '@/components/player/narration-context'
import { colors } from '@/components/theme'

const mindmapData = {
  root: 'AI',
  nodes: [
    { id: 'ml', label: 'Machine Learning', parent: 'AI' },
    { id: 'nlp', label: 'NLP', parent: 'AI' },
    { id: 'cv', label: 'Computer Vision', parent: 'AI' },
    { id: 'supervised', label: 'Supervised', parent: 'ml' },
    { id: 'unsupervised', label: 'Unsupervised', parent: 'ml' },
    { id: 'rl', label: 'Reinforcement', parent: 'ml' },
  ],
}

export default function Pg04Showcase() {
  const { script } = useNarration()

  return (
    <>
      <Anim type="slide-left" delay={0} w={8} h={70} x={100} y={70}>
        <div style={{ width: '100%', height: '100%', background: colors.brand.accent, borderRadius: 4 }} />
      </Anim>

      <Anim type="fade-in" delay={100} x={128} y={72} w={600} h={70}>
        <Text variant="h2" x={0} y={0}>组件展示</Text>
      </Anim>

      <Anim type="fade-in" delay={200} x={128} y={140} w={600} h={30}>
        <Text variant="caption" x={0} y={0}>思维导图、图片与自定义 SVG</Text>
      </Anim>

      <Anim type="fade-in" delay={350} w={820} h={420} x={100} y={200}>
        <Cardbox variant="elevated" x={0} y={0} w={820} h={420}>
          <Text variant="h3" x={20} y={16} w={400}>AI 知识体系</Text>
          <MindMap root={mindmapData.root} nodes={mindmapData.nodes} x={10} y={60} w={800} h={340} />
        </Cardbox>
      </Anim>

      <Anim type="slide-right" delay={500} w={460} h={300} x={960} y={200}>
        <Cardbox variant="bordered" x={0} y={0} w={460} h={300}>
          <SVG x={20} y={20} w={24} h={24} viewBox="0 0 24 24">
            <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" fill={colors.brand.accent} />
          </SVG>
          <Text variant="h3" x={20} y={58} w={420}>自定义 SVG</Text>
          <SVG x={20} y={110} w={200} h={160} viewBox="0 0 200 160">
            <rect x="10" y="10" width="180" height="140" rx="12" fill="none" stroke={colors.brand.secondary} strokeWidth={2} />
            <circle cx="100" cy="50" r="25" fill={colors.brand.primary} opacity={0.6} />
            <rect x="60" y="90" width="80" height="40" rx="6" fill={colors.brand.secondary} opacity={0.4} />
            <text x="100" y="55" textAnchor="middle" fill={colors.base.white} fontSize={12}>AI</text>
            <text x="100" y="115" textAnchor="middle" fill={colors.base.white} fontSize={10}>Data</text>
          </SVG>
        </Cardbox>
      </Anim>

      <Anim type="fade-in" delay={650} w={460} h={180} x={960} y={540}>
        <Cardbox variant="default" x={0} y={0} w={460} h={180}>
          <Text variant="h3" x={20} y={16} w={420}>图表示例</Text>
          <Axis x={20} y={60} w={420} h={100} xLabel="X" yLabel="Y">
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: colors.text.dim, fontSize: 14 }}>
              坐标轴容器
            </div>
          </Axis>
        </Cardbox>
      </Anim>

      <Text variant="caption" x={320} y={1020} w={1280} style={{ textAlign: 'center' }}>{script}</Text>
    </>
  )
}
