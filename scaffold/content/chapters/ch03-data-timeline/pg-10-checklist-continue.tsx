'use client'

import { Anim } from '@/components/anim'
import { Text } from '@/components/text'
import { Cardbox } from '@/components/cardbox'
import { Markdown } from '@/components/markdown'
import { colors } from '@/components/theme'
import { useNarration } from '@/components/player/narration-context'

const md = `## Checklist

- [x] Requirements gathered
- [x] Architecture designed
- [ ] Implementation started
- [ ] Testing

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)`

export default function Pg10ChecklistContinue() {
  const { script } = useNarration()
  return (
    <>
      <Anim type="fade-in" delay={0} x={100} y={80} w={1720} h={920}>
        <Cardbox variant="default" x={0} y={0} w={1720} h={920}>
          <Markdown x={30} y={20} w={1660} h={840} content={md} />
          <Text variant="citation" x={1420} y={880} w={280} h={33} style={{ textAlign: 'right', opacity: 0.6 }}>
            Source: course materials
          </Text>
        </Cardbox>
      </Anim>

      <Text variant="caption" x={360} y={1027} w={1200} style={{ textAlign: 'center' }}>{script}</Text>
    </>
  )
}
