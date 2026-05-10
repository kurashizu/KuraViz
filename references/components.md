# Components Reference

All components must be used with explicit Box positioning (`x`, `y`, `w`, `h`) within the 1920×1080 canvas. No flex/grid layout on the page level.

## Text — `@/components/text`

```tsx
import { Text } from '@/components/text'

<Text variant="h1" x={120} y={100} w={900}>Title</Text>
<Text variant="h2" x={120} y={200} w={600}>Section</Text>
<Text variant="h3" x={120} y={300} w={500}>Subsection</Text>
<Text variant="body" x={120} y={400} w={700}>Paragraph content...</Text>
<Text variant="caption" x={80} y={1020} w={800}>Footer note</Text>
<Text variant="code" x={120} y={500} w={600}>inline code</Text>
```

| Prop | Type | Default |
|---|---|---|
| variant | `h1\|h2\|h3\|body\|caption\|code` | `body` |
| x, y, w, h, z | number (px) | — |
| className | string | — |
| style | React.CSSProperties | — |
| children | ReactNode | required |

Visual specs:
- h1: 48px/700/1.2
- h2: 36px/600/1.3
- h3: 28px/600/1.4
- body: 20px/400/1.6
- caption: 14px/400/1.5
- code: 18px/mono

## Anim — `@/components/anim`

```tsx
import { Anim } from '@/components/anim'

<Anim type="fade-in" delay={0}>
  <Text variant="h1" x={100} y={100}>Delayed content</Text>
</Anim>

<Anim type="slide-left" delay={500} x={100} y={200} w={400} h={50}>
  <Text variant="body">Slides in from right</Text>
</Anim>
```

| Prop | Type | Default |
|---|---|---|
| type | `fade-in\|slide-left\|slide-right\|slide-up\|slide-down\|scale-in` | `fade-in` |
| delay | number (ms) | 0 |
| duration | number (seconds) | 0.5 |
| x, y, w, h, z | number (px) | — |
| children | ReactNode | required |

## Markdown — `@/components/markdown`

```tsx
import { Markdown } from '@/components/markdown'

<Markdown x={120} y={200} w={800} h={600} content={`
## Section Title

- Bullet point
- Another point

| Col1 | Col2 |
|------|------|
| A    | B    |

$$ E = mc^2 $$
`} />
```

| Prop | Type | Default |
|---|---|---|
| content | string (markdown) | required |
| x, y, w, h, z | number (px) | — |

Supports: GFM tables, LaTeX (via KaTeX), strikethrough, task lists, code blocks, Mermaid diagrams (via ```mermaid code blocks).

## Graph — `@/components/graph`

### BarChart

```tsx
import { BarChart } from '@/components/graph'

<BarChart
  data={[{ label: 'A', value: 45 }, { label: 'B', value: 78 }]}
  color="#6366F1"
  x={120} y={200} w={700} h={400}
/>
```

### LineChart

```tsx
import { LineChart } from '@/components/graph'

<LineChart
  data={[{ label: 'Jan', value: 30 }, { label: 'Feb', value: 55 }]}
  color="#06B6D4"
  x={120} y={200} w={700} h={400}
/>
```

### Mermaid (via Markdown)

Mind maps, flowcharts, sequence diagrams via ```` ```mermaid ```` code blocks inside `<Markdown>`:

```tsx
import { Markdown } from '@/components/markdown'

<Markdown content={`
\`\`\`mermaid
mindmap
  AI
    Machine Learning
    NLP
    Computer Vision
\`\`\`
`} x={100} y={100} w={800} h={400} />
```

### Axis

```tsx
import { Axis } from '@/components/graph'

<Axis x={100} y={200} w={800} h={500} xLabel="X Axis" yLabel="Y Axis">
  {/* custom chart content */}
</Axis>
```

## Cardbox — `@/components/cardbox`

```tsx
import { Cardbox } from '@/components/cardbox'

<Cardbox variant="default" x={120} y={200} w={400} h={300}>
  <Text variant="body">Content inside card</Text>
</Cardbox>
```

| Prop | Type | Default |
|---|---|---|
| variant | `default\|elevated\|bordered` | `default` |
| className | string | — |
| x, y, w, h, z | number (px) | — |

- default: subtle background + border
- elevated: background + border + shadow
- bordered: transparent background + colored border

## Image — `@/components/image`

```tsx
import { Image } from '@/components/image'

<Image
  src="/path/to/image.png"
  alt="description"
  effect="shadow-3d"
  x={800} y={150} w={400} h={300}
/>
```

| Prop | Type | Default |
|---|---|---|
| src | string | required |
| alt | string | `''` |
| effect | `none\|shadow-3d\|mask-circle\|mask-rounded\|glow` | `none` |
| objectFit | `cover\|contain\|fill` | `cover` |
| x, y, w, h, z | number (px) | — |

## SVG — `@/components/svg`

```tsx
import { SVG } from '@/components/svg'

<SVG x={100} y={100} w={200} h={200} viewBox="0 0 100 100">
  <circle cx="50" cy="50" r="40" fill="#6366F1" />
  <rect x="30" y="30" width="40" height="40" fill="#06B6D4" />
</SVG>
```

| Prop | Type | Default |
|---|---|---|
| viewBox | string | `0 0 {w} {h}` |
| className | string | — |
| x, y, w, h, z | number (px) | — |
| children | SVG elements | required |

## Button — `@/components/ui`

```tsx
import { Button } from '@/components/ui/button'

<Button variant="primary" x={800} y={600} w={160} h={44} onClick={() => {}}>
  Click Me
</Button>
```
