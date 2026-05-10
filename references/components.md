# Components Reference

All components use explicit Box positioning (`x`, `y`, `w`, `h`) within the 1920×1080 canvas. **No flex/grid at page level**. All colors must come from `@/components/theme` `colors.*` — no hardcoded hex values anywhere.

## Text — `@/components/text`

```tsx
import { Text } from '@/components/text'

<Text variant="h1"      x={120} y={100} w={1200} h={120}>Title</Text>
<Text variant="h2"      x={120} y={250} w={900}  h={80}>Section</Text>
<Text variant="h3"      x={120} y={350} w={800}  h={60}>Subsection</Text>
<Text variant="body"    x={120} y={420} w={1000} h={50}>Paragraph...</Text>
<Text variant="caption" x={120} y={490} w={800}  h={35}>Footer note</Text>
<Text variant="code"    x={120} y={530} w={600}  h={45}>inline code</Text>
```

| Prop | Type | Default |
|---|---|---|
| variant | `h1 \| h2 \| h3 \| body \| caption \| code \| watermark` | `body` |
| x, y, w, h, z | number (px) | — |
| className | string | — |
| style | React.CSSProperties | merged after variant defaults |
| as | HTML tag override | inferred from variant |
| children | ReactNode | required |

**Font metrics** (in `components/theme.ts` `typography`):

| Variant | fontSize | lineHeight | line box (px) |
|---|---|---|---|
| h1 | 72 | 1.2 | **86** |
| h2 | 54 | 1.3 | **70** |
| h3 | 42 | 1.4 | **59** |
| body | 30 | 1.6 | **48** |
| caption | 22 | 1.5 | **33** |
| code | 28 | 1.5 | **42** (mono font) |
| watermark | 28 | 1.5 | **42** |

**Always set `h` ≥ line box × line count.** Examples:
- 1-line caption: `h ≥ 33` → use `h={35}`
- 1-line h2: `h ≥ 70` → use `h={70}` or `h={80}`
- 2-line body: `h ≥ 96` → use `h={100}`

## Anim — `@/components/anim`

```tsx
import { Anim } from '@/components/anim'

<Anim type="fade-in" delay={0} x={100} y={100} w={1200} h={120}>
  <Text variant="h1" x={0} y={0} w={1200}>Title appears immediately</Text>
</Anim>

<Anim type="slide-up" delay={500} x={100} y={250} w={800} h={70}>
  <Text variant="h3" x={0} y={0}>Slides up 500ms later</Text>
</Anim>
```

| Prop | Type | Default |
|---|---|---|
| type | `fade-in \| slide-left \| slide-right \| slide-up \| slide-down \| scale-in` | `fade-in` |
| delay | number (ms) | 0 |
| duration | number (seconds) | 0.5 |
| x, y, w, h, z | number (px) | — |

Anim wraps its children with framer-motion. The wrapper itself is `position: absolute` at the given Box, children should use `x={0} y={0}` to fill the wrapper.

## Cardbox — `@/components/cardbox`

```tsx
<Cardbox variant="default"  x={120} y={200} w={400} h={300}>...</Cardbox>
<Cardbox variant="elevated" x={120} y={200} w={400} h={300}>...</Cardbox>
<Cardbox variant="bordered" x={120} y={200} w={400} h={300}>...</Cardbox>
```

| variant | bg | border |
|---|---|---|
| default | `surface.card` | 1px `surface.border` |
| elevated | `surface.card` | 1px + drop shadow |
| bordered | transparent | 2px `brand.primary` |

`box-sizing: border-box` is global. Inner positioned children measure from the **padding edge** (after border). For `bordered` (2px), subtract 4px from `h` to get effective content height.

Example: badge text in `bordered` Cardbox:
- `h=44, border=2px → content area = 40px`
- `Text y=8, lineHeight=33 → bottom at 41 → fits with 1px margin`

## Markdown — `@/components/markdown`

```tsx
<Markdown x={120} y={200} w={1280} h={500} content={`
## Heading

| Col1 | Col2 |
|------|------|
| A    | B    |

$$ E = mc^2 $$

\`\`\`js
const x = 1
\`\`\`
`} />
```

Supports: GFM tables, LaTeX (KaTeX), strikethrough, task lists, code blocks. **Mermaid diagrams are a separate component, not embedded in Markdown.**

`overflow: hidden` is forced — content that exceeds `h` is clipped, never scrolled. Make `h` large enough.

## Mermaid — `@/components/markdown/mermaid`

Renders Mermaid diagrams (mindmap, flowchart, sequence, gantt, class). Diagram type auto-detected from chart string.

```tsx
import { Mermaid } from '@/components/markdown/mermaid'

<Mermaid x={100} y={200} w={1720} h={760} chart={`
mindmap
  AI
    Machine Learning
      Supervised
      Unsupervised
    NLP
    Computer Vision
`} />

<Mermaid x={100} y={200} w={1720} h={760} chart={`
flowchart TB
  A[Start] --> B{Check}
  B -->|Yes| C[OK]
  B -->|No| D[Fix]
  D --> B
`} />

<Mermaid x={100} y={200} w={1720} h={760} chart={`
sequenceDiagram
  participant U as User
  participant A as App
  U->>A: request
  A-->>U: response
`} />
```

**Hard requirement**: `w ≥ 540` AND `h ≥ 540`. Below this, text labels become unreadable. Recommended: one diagram per page at `w=1720, h=760` for legibility.

Font sizes are configured at `mermaid.initialize()` so layout is computed correctly. **Do not** override `text.fontSize` post-render — it breaks the layout that Mermaid already computed.

## Graph — `@/components/graph`

### BarChart / LineChart (recharts wrappers)

```tsx
import { BarChart, LineChart } from '@/components/graph'

<BarChart  data={[{ label: 'A', value: 45 }]} x={120} y={200} w={700} h={400} />
<LineChart data={[{ label: 'Jan', value: 30 }]} x={120} y={200} w={700} h={400} />
```

`color` defaults to `colors.brand.primary` / `colors.brand.secondary`.

### Axis (standalone coordinate frame)

```tsx
<Axis x={100} y={200} w={800} h={500} xLabel="X" yLabel="Y" />
```

## Inline SVG (for small icons inside cards)

There is **no SVG wrapper component**. Use raw `<svg>` with absolute positioning:

```tsx
<svg
  style={{ position: 'absolute', left: 24, top: 22, width: 48, height: 48 }}
  viewBox="0 0 48 48"
>
  <circle cx="24" cy="24" r="24" fill={colors.brand.primary} />
  <text x="24" y="29" textAnchor="middle" fill={colors.base.white} fontSize={typography.caption.fontSize} fontWeight={700}>01</text>
</svg>
```

Use this for small decorative icons (numbered badges, checkmarks, glyphs). For diagrams, use `<Mermaid>`.

## Player components

Internal — agents should not edit these directly:

- `components/player/slide-player.tsx` — keyboard navigation, audio playback, page state
- `components/player/narration-context.tsx` — `useNarration()` hook returns `{ script, audioSrc }` for the current page
- `components/player/debug-overlay.tsx` — `?debug=1` and `?debug=auto` overlays
