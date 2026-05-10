# Aesthetic Design Guide

## Canvas

- 1920×1080, 16:9 fixed
- Content safe zone: leave ≥80px padding on all edges (max content width ≈ 1760)
- For centered content: use `cx = (1920 - width) / 2` to calculate x

## Layout Principles

### 1. Title Pages

A title page should have this vertical rhythm (from top to bottom):

```
y=  0  ┌──────────────────────────────────────┐
        │   background gradient (full canvas)   │
y=320  │       ┌──────┐                       │
        │       │ Ch01 │  ← chapter badge      │
        │       └──────┘                       │
y=360  │  ────── accent line ──────            │
y=400  │     Machine Learning 入门              │  ← h1 (48px)
y=490  │   Introduction to ML   ← h3 (28px)   │
y=580  │    ┌──────────────┐                  │
        │    │ → 键继续      │  ← hint box     │
        │    └──────────────┘                  │
y=1080 └──────────────────────────────────────┘
```

**Element spacing:**
- Between badge and accent line: ~32px
- Between accent line and h1 title: ~36px
- Between h1 and h3 subtitle: ~50px
- Between subtitle and hint box: ~50px
- Between hint box and bottom: ≥400px (leave room for caption)

### 2. Content Pages

Every content page follows: **left accent bar + title + content**

```
x= 80  │▌  Section Title (h2, 36px)           ← y=80
       │▌  Subtitle/description (caption)      ← y=~130
       │
       │  ┌────────────────────────────────┐   ← y=180
       │  │  Content card / list / chart   │
       │  │                                │
       │  └────────────────────────────────┘
       │
       │  Side panel (optional)            → x≈940
       │
```

**Left accent bar specs:**
- Width: 8px
- Height: 56–64px (matches h2 line height)
- Color: chapter's brand color (ch01=#6366F1, ch02=#06B6D4, etc.)
- Position: x=80~100, y aligned with h2 baseline
- Border radius: 4px on right edge

### 3. List Items

```
┌─────────────────────────────────────────┐  h=76~88
│  ┌──────┐  01. Item title               │
│  │ icon │  Description text (caption)   │
│  └──────┘                               │
└─────────────────────────────────────────┘
  ↑ padding 24px
```

- Each item: 76–88px tall, spaced 88–100px apart
- Icon: 32–48px, sits at y=20~24 from card top
- Title: x=72~88 from card left, y=16~22
- Description (if present): x=same, y=title_y + 36
- Cards use `variant="default"` (bg-surface-card)

## Design Tokens Usage

### Colors

| Token | Usage | Example |
|---|---|---|
| `#6366F1` (Indigo) | Ch01 accent, primary buttons | badges, accent bars, highlights |
| `#06B6D4` (Cyan) | Ch02 accent, code highlights | chapter badges, secondary charts |
| `#F59E0B` (Amber) | Ch03 accent, warnings | summary checkmarks |
| `#22C55E` (Green) | Success indicators | key findings icons |
| `#0F1117` | Canvas background | body bg |
| `#1A1D2B` | Card background | Cardbox default |
| `#2E3144` | Borders/dividers | Cardbox borders |
| `#F1F3F9` | Primary text | h1, h2, h3 |
| `#9CA3AF` | Secondary text | body text |
| `#6B7280` | Dim text | captions, hints |

### Accent Bars Code Pattern

```tsx
<Anim type="slide-left" delay={0} w={8} h={64} x={100} y={88}>
  <div style={{
    width: '100%', height: '100%',
    background: '#6366F1',
    borderRadius: 4,
  }} />
</Anim>
```

### Gradient Background Pattern

```tsx
<Anim type="fade-in" delay={0} x={0} y={0} w={1920} h={1080}>
  <div style={{
    width: '100%', height: '100%',
    background: 'radial-gradient(ellipse at 50% 35%, rgba(99,102,241,0.15), transparent 65%)',
  }} />
</Anim>
```

- Chapter 1: `rgba(99,102,241,0.15)` (Indigo)
- Chapter 2: `rgba(6,182,212,0.12)` (Cyan)
- Chapter 3: `rgba(245,158,11,0.12)` (Amber)

### Accent Line Pattern

```tsx
<Anim type="scale-in" delay={300} w={640} h={4} x={cx - 320} y={384}>
  <div style={{
    width: '100%', height: '100%',
    background: 'linear-gradient(90deg, transparent, #6366F1, transparent)',
    borderRadius: 2,
  }} />
</Anim>
```

### Chapter Badge Pattern

```tsx
<Cardbox variant="bordered" x={0} y={0} w={80} h={32}>
  <Text variant="caption" x={0} y={7} w={80} style={{ textAlign: 'center' }}>
    Ch01
  </Text>
</Cardbox>
```

- Placed above the accent line, centered
- Badge width: auto (fit text + 16px padding)
- Variant: `bordered` (uses brand color)

## Component Usage Rules

### Text

| Variant | Font Size | Weight | Usage | Visual |
|---|---|---|---|---|
| `h1` | 48px | 700 | Main title, page titles | `#F1F3F9` |
| `h2` | 36px | 600 | Section headings | `#F1F3F9` |
| `h3` | 28px | 600 | Subheadings, subtitles | `#9CA3AF` for subtitles |
| `body` | 20px | 400 | Content text | `#9CA3AF` |
| `caption` | 14px | 400 | Metadata, hints, labels | `#6B7280` |
| `code` | 18px | 400 | Inline code | `#06B6D4` |

**DO NOT** set `color` manually — use the variant's default. Exception: subtitles use `<Text variant="h3" style={{ color: '#9CA3AF' }}>`.

### Anim

| Type | Usage |
|---|---|
| `fade-in` | Full page transitions, title content |
| `slide-up` | Main title entrance |
| `slide-left` | Content cards, list items |
| `slide-right` | Side panels, secondary content |
| `scale-in` | Hint buttons, accent lines |

Delay increments: title fade 0→200→300→400, list items spaced 250–300ms apart.

### Cardbox

| Variant | Usage |
|---|---|
| `default` | Content cards, list items (bg-surface-card + border) |
| `elevated` | Highlight cards, charts, hint boxes (adds shadow) |
| `bordered` | Chapter badges, key findings (colored border) |

## Page Templates

### Template A: Title Page

```tsx
import { Anim } from '@/components/anim'
import { Text } from '@/components/text'
import { Cardbox } from '@/components/cardbox'
import { SVG } from '@/components/svg'
import { canvas } from '@/config/canvas'
import { useNarration } from '@/components/player/narration-context'

const cx = canvas.width / 2

export default function PgXXTitle() {
  const { script } = useNarration()
  return (
    <>
      <Anim type="fade-in" delay={0} x={0} y={0} w={1920} h={1080}>
        <div style={{
          width: '100%', height: '100%',
          background: 'radial-gradient(ellipse at 50% 35%, rgba(99,102,241,0.15), transparent 65%)',
        }} />
      </Anim>

      {/* chapter badge */}
      <Anim type="fade-in" delay={200} x={cx - 40} y={320} w={80} h={32}>
        <Cardbox variant="bordered" x={0} y={0} w={80} h={32}>
          <Text variant="caption" x={0} y={7} w={80} style={{ textAlign: 'center' }}>Ch01</Text>
        </Cardbox>
      </Anim>

      {/* accent line */}
      <Anim type="scale-in" delay={300} w={600} h={4} x={cx - 300} y={368}>
        <div style={{ width:'100%',height:'100%',background:'linear-gradient(90deg,transparent,#6366F1,transparent)',borderRadius:2 }} />
      </Anim>

      {/* main title */}
      <Anim type="slide-up" delay={400} x={cx - 500} y={400} w={1000} h={80}>
        <Text variant="h1" x={0} y={0} w={1000} style={{ textAlign: 'center' }}>Title Text</Text>
      </Anim>

      {/* subtitle */}
      <Anim type="fade-in" delay={700} x={cx - 400} y={490} w={800} h={40}>
        <Text variant="h3" x={0} y={0} w={800} style={{ textAlign: 'center', color: '#9CA3AF' }}>Subtitle Text</Text>
      </Anim>

      {/* hint */}
      <Anim type="scale-in" delay={1100} x={cx - 200} y={580} w={400} h={56}>
        <Cardbox variant="elevated" x={0} y={0} w={400} h={56}>
          <Text variant="caption" x={0} y={18} w={400} style={{ textAlign: 'center' }}>按 → 键继续</Text>
        </Cardbox>
      </Anim>

      <Text variant="caption" x={80} y={1020} w={800}>{script}</Text>
    </>
  )
}
```

### Template B: Section Page with Accent Bar

```tsx
import { Anim } from '@/components/anim'
import { Text } from '@/components/text'
// ... other imports

export default function PgXXContent() {
  return (
    <>
      {/* accent bar */}
      <Anim type="slide-left" delay={0} w={8} h={64} x={100} y={88}>
        <div style={{ width:'100%',height:'100%',background:'#6366F1',borderRadius:4 }} />
      </Anim>

      {/* title */}
      <Anim type="fade-in" delay={100} x={128} y={92} w={600} h={48}>
        <Text variant="h2" x={0} y={0}>Section Title</Text>
      </Anim>

      {/* caption */}
      <Anim type="fade-in" delay={200} x={128} y={138} w={600} h={24}>
        <Text variant="caption" x={0} y={0}>Subtitle description text</Text>
      </Anim>

      {/* content cards at y=200+ */}
    </>
  )
}
```

### Template C: Summary/Checklist Page

```tsx
{items.map((item, i) => (
  <Anim key={i} type="slide-left" delay={350 + i * 250} w={760} h={76} x={160} y={190 + i * 88}>
    <Cardbox variant="default" x={0} y={0} w={760} h={76}>
      {/* checkmark icon at x=24, y=22 */}
      <SVG x={24} y={22} w={32} h={32} viewBox="0 0 32 32">
        <circle cx="16" cy="16" r="16" fill="rgba(245,158,11,0.15)" />
        <path d="M11 16l3 3 7-7" fill="none" stroke="#F59E0B" strokeWidth={2} strokeLinecap="round" />
      </SVG>
      <Text variant="body" x={72} y={22} w={660}>{item}</Text>
    </Cardbox>
  </Anim>
))}
```

### Template D: Chart/Data Page

- Chart card (left): width ~760px, height ~420px
- Insight card (right): width ~380px, height ~240px, positioned at x≈940
- Use `BarChart` or `LineChart` inside `Cardbox variant="elevated"`
- Insight card uses `variant="bordered"` with a success icon

## Horizontal Layout Examples

### Two-Column Layout

```
│  ┌──────────────┐    ┌────────┐
│  │  Main content │    │ Side   │
│  │  (760w)      │    │ (380w) │
│  │              │    │        │
│  └──────────────┘    └────────┘
│  x=100              x=940
```

### Single Column with List

```
│  ┌──────────────────────────────────────┐
│  │  Item 1  (760w, 88h)                │
│  ├──────────────────────────────────────┤
│  │  Item 2                             │
│  ├──────────────────────────────────────┤
│  │  Item 3                             │
│  └──────────────────────────────────────┘
│  x=160, items start at y=190, spaced 88px apart
```

## Prohibited Visual Patterns

- ❌ Flexbox/grid layout on page level (use absolute positioning)
- ❌ Hardcoded colors outside the theme palette
- ❌ Mixed layout approaches (don't combine flex + absolute)
- ❌ Overlapping elements without z-index control
- ❌ Fixed pixel values that don't account for 1920×1080 centering
- ❌ <div> without a component wrapper when a slide component exists
- ❌ `<br>` for spacing (use explicit y positioning)

## Color Assignment by Chapter

| Chapter | Accent | Gradient | Icon Color |
|---|---|---|---|
| Ch01 | #6366F1 (Indigo) | rgba(99,102,241,0.15) | #6366F1 |
| Ch02 | #06B6D4 (Cyan) | rgba(6,182,212,0.12) | #06B6D4 |
| Ch03 | #F59E0B (Amber) | rgba(245,158,11,0.12) | #F59E0B |
| Ch04+ | #22C55E / #3B82F6 / #EC4899 | (use hex + 0.12 opacity) | same as accent |
