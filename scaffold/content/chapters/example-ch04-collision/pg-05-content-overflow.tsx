'use client'

import { Anim } from '@/components/anim'
import { Text } from '@/components/text'
import { Cardbox } from '@/components/cardbox'
import { Markdown } from '@/components/markdown'
import { colors } from '@/components/theme'
import { useNarration } from '@/components/player/narration-context'

const longMd = [
  '# Overflow Test',
  '',
  'This cardbox is deliberately too small for its content.',
  'Expected: `CONTENT_OVERFLOW` warning in console + debug overlay.',
  '',
  '## Lots of text',
  '',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
  'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum.',
  'Excepteur sint occaecat cupidatat non proident, sunt in culpa.',
  '',
  '## More content',
  '',
  '1. First item that takes up space',
  '2. Second item that takes up more space',
  '3. Third item that keeps going and going',
  '4. Fourth item that pushes past the boundary',
  '5. Fifth item that definitely overflows',
  '',
  '| A | B | C | D | E |',
  '|---|---|---|---|---|',
  '| 1 | 2 | 3 | 4 | 5 |',
  '| 6 | 7 | 8 | 9 | 0 |',
  '| a | b | c | d | e |',
  '| f | g | h | i | j |',
].join('\n')

export default function Pg05ContentOverflow() {
  const { script } = useNarration()
  return (
    <>
      <Anim type="fade-in" delay={0} w={8} h={70} x={100} y={70}>
        <div style={{ width: '100%', height: '100%', background: colors.semantic.error, borderRadius: 4 }} />
      </Anim>

      <Anim type="fade-in" delay={100} x={128} y={72} w={600} h={70}>
        <Text variant="h2" x={0} y={0}>Content Overflow Test</Text>
      </Anim>

      <Anim type="fade-in" delay={200} x={128} y={152} w={800} h={35}>
        <Text variant="caption" x={0} y={0}>Expected: CONTENT_OVERFLOW detected on cardbox</Text>
      </Anim>

      <Anim type="fade-in" delay={350} x={100} y={210} w={600} h={200}>
        <Cardbox variant="bordered" x={0} y={0} w={600} h={200}>
          <Markdown x={16} y={12} w={568} h={176} content={longMd} />
        </Cardbox>
      </Anim>

      <Anim type="fade-in" delay={500} x={800} y={210} w={600} h={500}>
        <Cardbox variant="default" x={0} y={0} w={600} h={500}>
          <Markdown x={16} y={12} w={568} h={476} content={longMd} />
        </Cardbox>
      </Anim>

      <Text variant="caption" x={360} y={1027} w={1200} style={{ textAlign: 'center' }}>{script}</Text>
    </>
  )
}
