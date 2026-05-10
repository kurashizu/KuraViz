'use client'

import { Anim } from '@/components/anim'
import { Text } from '@/components/text'
import { Cardbox } from '@/components/cardbox'
import { useNarration } from '@/components/player/narration-context'
import { colors } from '@/components/theme'

const cardVariants = [
  { variant: 'default' as const, label: 'Default Card', desc: 'subtle background with border' },
  { variant: 'elevated' as const, label: 'Elevated Card', desc: 'with shadow for emphasis' },
  { variant: 'bordered' as const, label: 'Bordered Card', desc: 'transparent with brand border' },
]

export default function Pg02Components() {
  const { script } = useNarration()

  return (
    <>
      <Anim type="slide-left" delay={0} w={8} h={70} x={100} y={70}>
        <div style={{ width: '100%', height: '100%', background: colors.brand.secondary, borderRadius: 4 }} />
      </Anim>

      <Anim type="fade-in" delay={100} x={128} y={72} w={600} h={70}>
        <Text variant="h2" x={0} y={0}>组件展示</Text>
      </Anim>

      <Anim type="fade-in" delay={200} x={128} y={152} w={600} h={35}>
        <Text variant="caption" x={0} y={0}>Cardbox 三种变体与文字层级</Text>
      </Anim>

      {cardVariants.map((cv, i) => (
        <Anim key={i} type="slide-right" delay={350 + i * 200} w={500} h={160} x={100 + i * 540} y={200}>
          <Cardbox variant={cv.variant} x={0} y={0} w={500} h={160}>
            <Text variant="h3" x={20} y={16} w={460}>{cv.label}</Text>
            <Text variant="body" x={20} y={78} w={460}>{cv.desc}</Text>
          </Cardbox>
        </Anim>
      ))}

      <Anim type="fade-in" delay={1000} w={1120} h={420} x={100} y={400}>
        <Cardbox variant="default" x={0} y={0} w={1120} h={420}>
          <Text variant="h3" x={20} y={16} w={400}>文字层级展示</Text>

          <Text variant="h1" x={20} y={80} w={1080}>h1 标题 72px</Text>
          <Text variant="h2" x={20} y={180} w={1080}>h2 标题 54px</Text>
          <Text variant="h3" x={20} y={260} w={1080}>h3 标题 42px</Text>
          <Text variant="body" x={20} y={330} w={1080}>
            Body 正文 30px — 用于段落文本内容，适合阅读的长文本展示。
          </Text>
          <Text variant="caption" x={20} y={380} w={1080}>
            Caption 标注 22px — 用于辅助说明、页码、脚注等次要信息。
          </Text>
        </Cardbox>
      </Anim>

      <Text variant="caption" x={320} y={1000} w={1280} style={{ textAlign: 'center' }}>{script}</Text>
    </>
  )
}
