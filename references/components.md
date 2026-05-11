# Components Reference

All components use explicit Box positioning (`x`, `y`, `w`, `h`) within the 1920×1080 canvas. **No flex/grid at page level**. All colors must come from `@/components/theme` `colors.*` — no hardcoded hex values anywhere. Raw `<div>` must not be used for layout — always use Box-based components.

---

## Text — `@/components/text`

Single-variant text element. For mixed-styled content (bold heading + body + italic) inside a Cardbox, use `<Markdown>` instead — it avoids manual y-position collisions.

```tsx
import { Text } from '@/components/text'

<Text variant="h1"      x={120} y={100} w={1200} h={120}>Title</Text>
<Text variant="h2"      x={120} y={250} w={900}  h={80}>Section</Text>
<Text variant="h3"      x={120} y={350} w={800}  h={60}>Subsection</Text>
<Text variant="body"    x={120} y={420} w={1000} h={50}>Paragraph...</Text>
<Text variant="caption" x={120} y={490} w={800}  h={35}>Footer note</Text>
<Text variant="code"    x={120} y={530} w={600}  h={45}>inline code</Text>
<Text variant="citation" x={120} y={570} w={600} h={35}>Source credit</Text>
```

### Props

| Prop | Type | Default |
|---|---|---|
| variant | `h1 \| h2 \| h3 \| body \| caption \| citation \| code \| watermark` | `body` |
| x, y, w, h, z | number (px) | — |
| style | React.CSSProperties | merged after variant defaults |
| as | HTML tag override | inferred from variant |
| children | ReactNode | required |

### HTML tag mapping

| variant | renders as |
|---|---|
| `h1` | `<h1>` |
| `h2` | `<h2>` |
| `h3` | `<h3>` |
| `body` | `<p>` |
| `caption` | `<div>` |
| `citation` | `<div>` |
| `code` | `<code>` |
| `watermark` | `<div>` |

When `x`/`y` are provided, `boxStyle` adds `position: absolute`.

### Font metrics

| Variant | fontSize | lineHeight | line box (px) |
|---|---|---|---|
| h1 | 72 | 1.2 | **86** |
| h2 | 54 | 1.3 | **70** |
| h3 | 42 | 1.4 | **59** |
| body | 30 | 1.6 | **48** |
| caption | 22 | 1.5 | **33** |
| citation | 22 | 1.5 | **33** |
| code | 28 | 1.5 | **42** (mono font) |
| watermark | 28 | 1.5 | **42** |

**Rule**: `h ≥ line box × line count`. Examples:
- 1-line caption: `h ≥ 33` → use `h={35}`
- 2-line body: `h ≥ 96` → use `h={100}`
- 1-line h2: `h ≥ 70` → use `h={75}`

### data-box-id

Auto-generated as `text-{variant}-{textSnippet}-{counter}` for collision debug.

### Citation

`<Text variant="citation">` for source attribution inside cardboxes. Place at the cardbox's bottom-right corner (`x={cardbox_w - text_w - 20}`, `y={cardbox_h - 40}`). Same size as caption but semantically distinct.

---

## Anim — `@/components/anim`

Positioning wrapper with entry animation. The wrapper has `position: absolute` at the given Box; children should use `x={0} y={0}` to fill the wrapper.

```tsx
import { Anim } from '@/components/anim'

<Anim type="fade-in" delay={0} x={100} y={100} w={1200} h={120}>
  <Text variant="h1" x={0} y={0} w={1200}>Title appears immediately</Text>
</Anim>

<Anim type="slide-up" delay={500} x={100} y={250} w={800} h={70}>
  <Text variant="h3" x={0} y={0}>Slides up 500ms later</Text>
</Anim>
```

### Props

| Prop | Type | Default |
|---|---|---|
| type | `fade-in \| slide-left \| slide-right \| slide-up \| slide-down \| scale-in` | `fade-in` |
| delay | number (ms) | 0 |
| duration | number (seconds) | 0.5 |
| x, y, w, h, z | number (px) | — |

### data-box-id

Auto-generated as `wrapper-{counter}` for collision debug (prefix `wrapper-`, not `anim-`, to avoid confusion with animation issues).

---

## Cardbox — `@/components/cardbox`

Card container with three visual variants.

```tsx
<Cardbox variant="default"  x={120} y={200} w={400} h={300}>...</Cardbox>
<Cardbox variant="elevated" x={120} y={200} w={400} h={300}>...</Cardbox>
<Cardbox variant="bordered" x={120} y={200} w={400} h={300}>...</Cardbox>
```

### Variants

| variant | bg | border |
|---|---|---|
| default | `surface.card` | 1px `surface.border` |
| elevated | `surface.card` | 1px + drop shadow |
| bordered | transparent | 2px `brand.primary` |

### Border sizing

`box-sizing: border-box` is global. The content area shrinks by border width each side:

| Variant | Border | Content area (h=100) |
|---|---|---|
| default / elevated | 1px | 98px |
| bordered | 2px | 96px |

For bordered cardboxes, any Text child must have `w ≤ cardbox_w - 4` and `y + lineHeight ≤ h - 4` to avoid OVERFLOW.

### data-box-id

Auto-generated as `cardbox-{variant}-{counter}` for collision debug.

---

## Markdown — `@/components/markdown`

Rich text renderer for mixed-styled content inside a Cardbox. **Prefer Markdown over multiple Text components when you need bold headings, body text, lists, and captions in the same box** — it handles vertical spacing automatically and avoids y-position collisions.

```tsx
import { Markdown } from '@/components/markdown'

<Cardbox variant="default" x={200} y={200} w={1280} h={500}>
  <Markdown x={20} y={20} w={1240} h={460} content={`
## Heading

**Bold text**, regular text, and *italic*.

| Col1 | Col2 |
|------|------|
| A    | B    |

- Task lists
  - [x] Done
  - [ ] Pending

$$ E = mc^2 $$

\`\`\`ts
const x = 1
\`\`\`
  `} />
</Cardbox>
```

### Supported features

- GFM tables, task lists (☐/☑ via Unicode), strikethrough, links
- LaTeX via KaTeX (`$...$` inline, `$$...$$` display)
- Syntax-highlighted code blocks (Prism + One Dark theme)

`overflow: hidden` is forced — content that exceeds `h` is clipped, never scrolled. Make `h` large enough.

---

## Mermaid — `@/components/markdown/mermaid`

Diagram renderer. Auto-detects type from chart string.

```tsx
import { Mermaid } from '@/components/markdown/mermaid'

<Mermaid x={100} y={200} w={1720} h={760} chart={`
flowchart TB
  A[Start] --> B{Check}
  B -->|Yes| C[OK]
  B -->|No| D[Fix]
  D --> B
`} />
```

### Supported diagram types

mindmap, flowchart (LR/TB), sequence, gantt, class

### Requirements

- **`w ≥ 540`** AND **`h ≥ 540`** — below this, labels overflow and become unreadable
- Recommended: one diagram per page at `w=1720, h=760`
- Font sizes configured at `mermaid.initialize()` — **do not** override post-render

### Diagram shape → container matching

| Diagram | Natural shape | Container advice |
|---|---|---|
| Flowchart LR | Wide, short | Full-width card. Or pair with text legend. |
| Flowchart TB | Tall, narrow | Center column, or standalone page |
| Sequence | Tall, narrow | Left column (w≈1100) + text legend right |
| Mindmap | Circular, balanced | Full-width card, evenly padded |
| Gantt | Wide, short | Full-width card (w=1720, h≈400), text cards below |

---

## Graph — `@/components/graph`

### BarChart / LineChart

```tsx
import { BarChart, LineChart } from '@/components/graph'

<BarChart  data={[{ label: 'A', value: 45 }]} x={120} y={200} w={700} h={400} />
<LineChart data={[{ label: 'Jan', value: 30 }]} x={120} y={200} w={700} h={400} />
```

`color` defaults to `colors.brand.primary` / `colors.brand.secondary`. SVG text uses 22px to match the caption variant.

### Axis

```tsx
<Axis x={100} y={200} w={800} h={500} xLabel="X" yLabel="Y" />
```

---

## Inline SVG

For small decorative icons inside cards (badges, checkmarks, glyphs). For diagrams, use `<Mermaid>`.

```tsx
<svg
  style={{ position: 'absolute', left: 24, top: 22, width: 48, height: 48 }}
  viewBox="0 0 48 48"
>
  <circle cx="24" cy="24" r="24" fill={colors.brand.primary} />
  <text x="24" y="29" textAnchor="middle" fill={colors.base.white}
    fontSize={typography.caption.fontSize} fontWeight={700}>01</text>
</svg>
```

---

## Player components

Internal — agents should not edit these directly:

- `components/player/slide-player.tsx` — keyboard navigation, audio playback, page state
- `components/player/narration-context.tsx` — `useNarration()` hook returns `{ script, audioSrc }`
- `components/player/debug-overlay.tsx` — `?debug=1` and `?debug=auto` overlays
