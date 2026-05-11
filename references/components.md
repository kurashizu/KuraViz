# Components Reference

All components use explicit Box positioning (`x`, `y`, `w`, `h`) within the 1920×1080 canvas. **No flex/grid at page level**. All colors must come from `@/components/theme` `colors.*` — no hardcoded hex values anywhere. Raw `<div>` must not be used for layout — always use Box-based components.

---

## Text — `@/components/text`

**Use only for**: titles (h1/h2/h3), section labels, captions, watermarks, and citations. For body paragraphs, inline code, or multi-line content, use `<Markdown>` instead.

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

See `references/collision-prevention.md` for line box values and `h` calculation.

### Citation

`<Text variant="citation">` for source attribution inside cardboxes. Place at the cardbox's bottom-right corner (`x={cardbox_w - text_w - 20}`, `y={cardbox_h - 40}`). Same size as caption but semantically distinct.

---

## Anim — `@/components/anim`

Positioning wrapper with entry animation.

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

The wrapper is `position: absolute` at the given Box. Children should use `x={0} y={0}` to fill the wrapper. The `data-box-id` prefix is `wrapper-` (not `anim-`), to avoid confusion with animation issues in collision reports.

---

## Cardbox — `@/components/cardbox`

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

`box-sizing: border-box` is global. For border sizing and content area calculation, see `references/collision-prevention.md`.

---

## Markdown — `@/components/markdown`

Rich text renderer for body content inside a Cardbox. **Use this instead of Text for any multi-line content, mixed styles, inline code, or body paragraphs.**

```tsx
import { Markdown } from '@/components/markdown'

<Cardbox variant="default" x={200} y={200} w={1280} h={500}>
  <Markdown x={20} y={20} w={1240} h={460} content={`
## Heading

**Bold**, regular, and *italic*.

| Col1 | Col2 |
|------|------|
| A    | B    |

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

### Requirements

- **`w ≥ 540`** AND **`h ≥ 540`** — below this, labels overflow and become unreadable
- Font sizes configured at `mermaid.initialize()` — **do not** override post-render
- For diagram shape → container matching, see `references/design-guide.md`

---

## Graph — `@/components/graph`

```tsx
import { BarChart, LineChart } from '@/components/graph'

<BarChart  data={[{ label: 'A', value: 45 }]} x={120} y={200} w={700} h={400} />
<LineChart data={[{ label: 'Jan', value: 30 }]} x={120} y={200} w={700} h={400} />
<Axis x={100} y={200} w={800} h={500} xLabel="X" yLabel="Y" />
```

`color` defaults to `colors.brand.primary` / `colors.brand.secondary`.

---

## Inline SVG

For small decorative icons inside cards. For diagrams, use `<Mermaid>`.

```tsx
<svg style={{ position: 'absolute', left: 24, top: 22, width: 48, height: 48 }}
  viewBox="0 0 48 48">
  <circle cx="24" cy="24" r="24" fill={colors.brand.primary} />
  <text x="24" y="29" textAnchor="middle" fill={colors.base.white}
    fontSize={typography.caption.fontSize} fontWeight={700}>01</text>
</svg>
```

---

## Player components

Internal — agents should not edit these directly:

- `components/player/slide-player.tsx` — keyboard navigation, audio playback, page state
- `components/player/narration-context.tsx` — `useNarration()` hook
- `components/player/debug-overlay.tsx` — `?debug=1` and `?debug=auto` overlays
