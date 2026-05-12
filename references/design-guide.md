# Aesthetic Design Guide

## Canvas

- 1920×1080, 16:9 fixed
- Content safe zone: leave ≥80px padding on all edges (max content width ≈ 1760)
- For centered content: use `cx = (1920 - width) / 2` to calculate x

### Caption Positioning

All bottom captions default to `w=1200`:
- **English**: ~90 characters per line at 22px font
- **Chinese/Japanese**: ~45 characters per line (CJK glyphs are ~2× Latin width)
- Keep each line between these limits — too few chars wastes space, too many gets cramped

Using a narrower width (e.g. `w=800`) causes more line breaks and requires recalculating `h` and `y`.

**Formula**: `h = lineCount × 33`, `y = 1080 - h - 20`

| Lines | h | y |
|---|---|---|
| 1 | 33 | 1027 |
| 2 | 66 | 994 |
| 3 | 99 | 961 |
| 4 | 132 | 928 |

**If you change the caption width from the default `w=1200`**, text wraps at a different point, changing the line count. Always recalculate `h` and `y` when adjusting width.

## Page Content Capacity

### Text Content
| Scenario | Lines of text | Max chars (English) | Vertical space |
|---|---|---|---|
| Title page subtitle | 1 line (h3, 42px) | ~30 words | 59px |
| Card body paragraph | 3-5 lines (body, 30px) | ~15 words/line | 150-250px |
| Bottom caption | 1 line (caption, 22px) | ~90 chars / ~45 CJK chars at w=1200 | 33px |
| Bottom caption | 2 lines | ~180 chars / ~90 CJK chars | 66px |
| Bottom caption | 3 lines | ~270 chars / ~135 CJK chars | 99px |

**Caption y formula**: `y = 1080 - (lineCount × 33) - 20`
- 1 line: `y=1027` (bottom=1060)
- 2 lines: `y=994` (bottom=1060)
- 3 lines: `y=961` (bottom=1060)

### Cards per Page
| Card type | Max per page | Spacing |
|---|---|---|
| List items (h=130) | 5 items | y += 160 |
| Timeline steps (w=440, h=240) | 3 steps | x += 540 |
| Two-column cards (h=420) | 2 cards | side by side |
| Full-width card (w=1720) | 1 card | — |

### Continue Pages
When content exceeds one page, create a **continue page** (no accent bar, no title — content starts at y=80 to use full canvas):

```tsx
export default function PgXXContinue() {
  return (
    <>
      {/* No accent bar, no title — content continues from previous page */}
      <Anim type="fade-in" delay={0} w={1720} h={920} x={100} y={80}>
        <Cardbox variant="default" x={0} y={0} w={1720} h={920}>
          ...
        </Cardbox>
      </Anim>
      <Text variant="caption" x={360} y={1027} w={1200} style={{ textAlign: 'center' }}>{script}</Text>
    </>
  )
}
```

Continue pages can also use multiple small items (like checklist cards) starting at y=80 for full canvas coverage.

### SVG Chart Sizes
SVG text must match Text component sizing for visual consistency:

| Element | Font size | Matches Text variant |
|---|---|---|
| Chart axis labels | 22px | caption |
| Bar/line labels | 22px | caption |
| Data values | 22px bold | caption (bold) |
| Chart title | 30px | body |

### Diagram Container Sizing

Before placing a diagram, analyze its **natural shape** and choose a matching container aspect ratio. A mismatched box clips content or wastes space.

| Diagram Type | Natural Shape | Recommended Container | Layout |
|---|---|---|---|
| **Flowchart** (LR) | Wide, short | Left-to-right orientation in a wide box (e.g. w=1680, h=640) | Full-width card, or left column |
| **Flowchart** (TB) | Tall, narrow | Top-to-bottom orientation in a tall box (e.g. w=800, h=800) | Center column, or standalone page |
| **Sequence diagram** | Tall, narrow | Left column (w≈1100) + text legend (w≈560) — two-column layout | Split page: diagram left, legend right |
| **Mindmap** | Circular, balanced | Square-ish aspect ratio (e.g. w=1680, h=800 in full card) | Full-width card, evenly padded |
| **Gantt chart** | Wide, short | Full-width short card (e.g. w=1720, h=400) with text cards below | Top: chart card. Bottom: explanation cards |

**Rule**: If a diagram fully uses one dimension but not the other, pair it with text content (legend, explanation, or data table) in the remaining space rather than stretching the diagram to fill an ill-fitting box.

### Citation

Use `<Text variant="citation">` for source attribution inside cardboxes. Place at the cardbox's bottom-right corner (e.g. `x={cardbox_w - text_w - 20}` `y={cardbox_h - 40}`). Same size as caption (22px, dim color) but semantically distinct.

## Layout Principles

### 1. Title Page

Centered layout with gradient background, chapter badge, and title stacked vertically.

| Element | Component | y | Align |
|---|---|---|---|
| Background | `div` with `radial-gradient` | 0 | full canvas |
| Chapter badge | `Cardbox variant="bordered" w={200} h={48}`, caption "Chapter 01" | 320 | center |
| Accent line | `Anim type="scale-in" w={600} h={4}` | 376 | center |
| Main title | `Text variant="h1" w={1000}` | 420 | center |
| Subtitle | `Text variant="h3" w={800}`, color `colors.text.secondary` | 620 | center |
| Caption | `Text variant="caption"` | 1080 - h - 20 | center, x=360 |

Chapter badge uses `w={200}` `h={48}` with text `w={190}` — the bordered cardbox subtracts 4px for 2px border, so text width (190) fits within content area (196). Use full "Chapter 01" text, not "Ch01".

Caption: centered at `x={360}` `w={1200}` (center=960, canvas center). Right edge 1500 clears watermark at x=1640. `h = lineCount × 33`, `y = 1080 - h - 20`. Use `\n` in script to control line breaks.

Spacing: badge→accent line ~56px, accent line→h1 44px, h1→h3 ~200px, h3→caption ≥400px.

Badge and accent line centered using `cx = canvas.width / 2` for x. Gradient uses chapter's brand color at 15% opacity (append `26` hex alpha suffix to color: `` `${color}26` ``).

### 2. Section Page with Accent Bar

Standard content page with a colored accent bar, title, subtitle, and content area.

| Element | Component | x | y |
|---|---|---|---|
| Accent bar | `Anim type="slide-left" w={8} h={70}`, `borderRadius: 4` | 100 | 70 |
| Section title | `Text variant="h2"` | 128 | 72 |
| Subtitle | `Text variant="caption"` | 128 | 152 |
| Content | Cards / chart / list | 160 | 210+ |

The accent bar's height (70px) matches the h2 line box (54 × 1.3 = 70). Bar color uses the chapter's brand color (`colors.brand.*`). The ~10px gap between h2 bottom (142) and subtitle top (152) prevents sub-pixel overlap.

### 3. Two-Column Layout (Main + Side)

| Zone | Width | x | y |
|---|---|---|---|
| Main content | 1000px | 160 | 210+ |
| Side panel | 500px | 1260 | 210+ |

Total width 1600px, centered on canvas (160px margin each side). Main content holds cards, charts, or lists. Side panel holds supplementary info (key points, summary badges, supporting chart).

### 4. Two-Column Layout (Equal Split)

| Zone | Width | x | y |
|---|---|---|---|
| Left column | 840px | 100 | 210+ |
| Right column | 840px | 980 | 210+ |

40px gap between columns. Total width 1720px, centered (100px margin each side). Use for side-by-side comparisons (before/after, two charts, code + output).

### 5. List / Checklist Page

A vertical stack of cards, each with an icon and text.

| Part | Spec |
|---|---|
| Card | `Cardbox variant="default" w={1400} h={130}` |
| Icon | `SVG` or inline `<svg>`, 52px, at x=36, y=30 within card |
| Title | `Text variant="body"`, at x=108, y=26 within card |
| Description | `Text variant="caption"` (optional), same x, y = 78 |
| Stacking | First card at y=200, each subsequent card at y += 160 (gap ~30px) |
| Animation | `Anim type="slide-left" delay={350 + i * 250}` for staggered entry |

On continue pages (no title/accent), cards start at y=80 to use full canvas.

### 6. Full-Width Card Page

A single large content area spanning most of the canvas width.

| Element | Component | x | y | w |
|---|---|---|---|---|
| Accent bar | As in section page | 100 | 70 | 8 |
| Title | `Text variant="h2"` | 128 | 72 | — |
| Large card | `Cardbox variant="default"` | 100 | 210 | 1720 |

Use when content needs maximum space: large markdown blocks, one big chart, detailed code walkthroughs.

### 7. Chart / Data Page

Chart on the left, insight card on the right. Centered on canvas.

| Zone | Component | x | y | w | h |
|---|---|---|---|---|---|
| Chart | `BarChart` / `LineChart` inside `Cardbox variant="elevated"` | 140 | 210 | 1100 | 460 |
| Insight card | `Cardbox variant="bordered"` with key finding | 1300 | 210 | 480 | 400 |

Total width 1580px, centered (170px margin each side). Chart height ~420px with SVG text at 22px. Insight card contains title at y=58, finding text at y=110, recommendation at y=290.

### 8. Timeline / Process Flow

Horizontal steps from left to right, evenly spaced.

| Step | Component | y | w | Gap |
|---|---|---|---|---|
| Each step | `Cardbox variant="default" w={440} h={240}` | 240 | 440 | 100px between cards |
| Step badge | `Cardbox variant="bordered" w={90} h={44}`, text w={80} | 18 (inside) | — | — |

Cards start at x=160. For N steps, layout: step 0 at x=160, step 1 at x=700, step 2 at x=1240. Each step has a number badge at y=18, title at y=76, description at y=136 within the card.

## Design Tokens Usage

All colors are defined in `@/components/theme` `colors.*`. Do not hardcode hex values. Key tokens:

| Token | Usage |
|---|---|
| `colors.surface.bg` | Canvas background |
| `colors.surface.card` | Cardbox background |
| `colors.surface.border` | Cardbox borders |
| `colors.text.primary` | h1, h2, h3 text |
| `colors.text.secondary` | body text |
| `colors.text.dim` | captions, hints |
| `colors.brand.*` | Chapter accents, badges, highlights (see assignment below) |

### Gradient Background Pattern

Title page background uses `radial-gradient` with the chapter's brand color at low opacity — the `26` hex suffix represents 15% opacity:

```tsx
background: `radial-gradient(ellipse at 50% 35%, ${colors.brand.primary}26, transparent 65%)`
```

## Prohibited Visual Patterns

- ❌ Flexbox/grid layout on page level (use absolute positioning)
- ❌ Hardcoded colors outside the theme palette
- ❌ Mixed layout approaches (don't combine flex + absolute)
- ❌ Overlapping elements without z-index control
- ❌ Fixed pixel values that don't account for 1920×1080 centering
- ❌ `<div>` without a component wrapper when a slide component exists
- ❌ `<br>` for spacing (use explicit y positioning)
- ❌ Emoji characters — use inline `<SVG>` for icons

## Color Assignment by Chapter

Use `colors.brand.*` tokens from `@/components/theme`. Each chapter picks one brand color for its accents, badges, and gradient backgrounds.

| Chapter | Token |
|---|---|
| Ch01 | `colors.brand.primary` |
| Ch02 | `colors.brand.secondary` |
| Ch03 | `colors.brand.accent` |
| Ch04+ | Cycle from Ch01 |
