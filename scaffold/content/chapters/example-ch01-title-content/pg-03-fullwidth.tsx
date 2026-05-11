'use client'

import { Anim } from '@/components/anim'
import { Text } from '@/components/text'
import { Cardbox } from '@/components/cardbox'
import { Markdown } from '@/components/markdown'
import { colors } from '@/components/theme'
import { useNarration } from '@/components/player/narration-context'

const code = `\`\`\`ts
function fibonacci(n: number): number {
  if (n <= 1) return n
  const dp = [0, 1]
  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2]
  }
  return dp[n]
}

// O(n) time, O(n) space
console.log(fibonacci(10)) // 55
\`\`\``

export default function Pg03Fullwidth() {
  const { script } = useNarration()
  return (
    <>
      <Anim type="slide-left" delay={0} w={8} h={70} x={100} y={70}>
        <div style={{ width: '100%', height: '100%', background: colors.brand.primary, borderRadius: 4 }} />
      </Anim>

      <Anim type="fade-in" delay={100} x={128} y={72} w={600} h={70}>
        <Text variant="h2" x={0} y={0}>Code Showcase</Text>
      </Anim>

      <Anim type="fade-in" delay={200} x={128} y={152} w={600} h={70}>
        <Text variant="caption" x={0} y={0}>Full-width card for code and long-form content</Text>
      </Anim>

      <Anim type="fade-in" delay={350} x={100} y={230} w={1720} h={700}>
        <Cardbox variant="default" x={0} y={0} w={1720} h={700}>
          <Markdown x={30} y={20} w={1660} h={660} content={code} />
        </Cardbox>
      </Anim>

      <Text variant="caption" x={360} y={1027} w={1200} style={{ textAlign: 'center' }}>{script}</Text>
    </>
  )
}
