'use client'

import { Anim } from '@/components/anim'
import { Text } from '@/components/text'
import { Cardbox } from '@/components/cardbox'
import { Markdown } from '@/components/markdown'
import { colors } from '@/components/theme'
import { useNarration } from '@/components/player/narration-context'

const code = `\`\`\`python
def quicksort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quicksort(left) + middle + quicksort(right)
\`\`\`

| Algorithm | Best | Average | Worst |
|---|---|---|---|
| Quick sort | O(n log n) | O(n log n) | O(n²) |
| Merge sort | O(n log n) | O(n log n) | O(n log n) |
| Bubble sort | O(n) | O(n²) | O(n²) |

> "Premature optimization is the root of all evil." — Donald Knuth`

export default function Pg05MarkdownContinue() {
  const { script } = useNarration()
  return (
    <>
      <Anim type="fade-in" delay={0} x={100} y={80} w={1720} h={920}>
        <Cardbox variant="default" x={0} y={0} w={1720} h={920}>
          <Markdown x={30} y={20} w={1660} h={880} content={code} />
        </Cardbox>
      </Anim>

      <Text variant="caption" x={360} y={1027} w={1200} style={{ textAlign: 'center' }}>{script}</Text>
    </>
  )
}
