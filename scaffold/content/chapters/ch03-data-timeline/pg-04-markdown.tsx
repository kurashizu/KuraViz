'use client'

import { Anim } from '@/components/anim'
import { Text } from '@/components/text'
import { Cardbox } from '@/components/cardbox'
import { Markdown } from '@/components/markdown'
import { colors } from '@/components/theme'
import { useNarration } from '@/components/player/narration-context'

const md = [
  '## LaTeX Example',
  '',
  'Inline math: $E = mc^2$',
  '',
  'Display math: $$x = \\frac{-b \\pm \\sqrt{b^{2} - 4ac}}{2a}$$',
  '',
  '## GFM Table',
  '',
  '| Feature | Status | Priority |',
  '|---|---|---|',
  '| User auth | Done | High |',
  '| Dashboard | In progress | High |',
  '| Reports | Planned | Medium |',
].join('\n')

export default function Pg04Markdown() {
  const { script } = useNarration()
  return (
    <>
      <Anim type="slide-left" delay={0} w={8} h={70} x={100} y={70}>
        <div style={{ width: '100%', height: '100%', background: colors.brand.accent, borderRadius: 4 }} />
      </Anim>

      <Anim type="fade-in" delay={100} x={128} y={72} w={600} h={70}>
        <Text variant="h2" x={0} y={0}>Markdown Content</Text>
      </Anim>

      <Anim type="fade-in" delay={200} x={128} y={152} w={800} h={35}>
        <Text variant="caption" x={0} y={0}>LaTeX, GFM tables, and checklists</Text>
      </Anim>

      <Anim type="fade-in" delay={350} x={100} y={210} w={1720} h={750}>
        <Cardbox variant="default" x={0} y={0} w={1720} h={750}>
          <Markdown x={30} y={20} w={1660} h={710} content={md} />
        </Cardbox>
      </Anim>

      <Text variant="caption" x={360} y={1027} w={1200} style={{ textAlign: 'center' }}>{script}</Text>
    </>
  )
}
