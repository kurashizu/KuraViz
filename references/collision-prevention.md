# Collision Prevention Guide

## 🔴 #1 Most Common Mistake: Wrapper Too Small for Wrapped Text

Nearly all OVERFLOW errors come from one cause: text inside an Anim or Cardbox wraps to multiple lines, but the wrapper's `h` only accounts for one line.

**Before writing each page, check whether each piece of text fits on one line at its chosen width.** If it wraps, multiply the line box height by the number of lines.

| Wrapper | Line box | 1 line | 2 lines | 3 lines |
|---|---|---|---|---|
| `<Text variant="h1">` | 86px | h=90 | h=175 | h=260 |
| `<Text variant="h2">` | 70px | h=75 | h=145 | h=215 |
| `<Text variant="h3">` | 59px | h=65 | h=120 | h=180 |
| `<Text variant="body">` | 48px | h=50 | h=100 | h=150 |
| `<Text variant="caption">` | 33px | h=35 | h=70 | h=105 |

**Real examples of this mistake** (title at w=1000, h2 at w=600):
- `"Natural Language Autoencoders"` (28 chars at 72px ≈ 1120px) → wraps at w=1000 → needs **h≈175**, not 86
- `"Auditing Hidden Motivations"` (25 chars at 54px ≈ 675px) → wraps at w=600 → needs **h≈145**, not 70

If you set `Anim h` to the single-line value but your text wraps, the Text's bounding box will exceed the Anim wrapper — this is always an OVERFLOW.

**Right-sizing**: The content should sit comfortably inside its container — not overflowing (`h` too small) and not floating with excessive empty space below (`h` too large). Aim for 10-30px of padding between the last content line and the container's bottom edge. For a body text block at y=30 that wraps to 5 lines (5×48=240px), the content bottom is y=270, so a Cardbox `h` of 280-300 gives a reasonable 10-30px margin.

## Collision Detection System

`lib/bbox.ts` — `scanOverlaps(container)` checks three types of layout violations:

| Detection | Prefix | What it checks |
|---|---|---|
| **OVERLAP** | `OVERLAP` | Top-level siblings (direct children of container) that overlap each other. 1px tolerance for touching edges. |
| **OVERFLOW** | `OVERFLOW` | Absolutely-positioned child exceeds its nearest positioned parent's bounds. 0.5px tolerance. |
| **EXCEED** | `EXCEED` | Absolutely-positioned element extends beyond the canvas boundary (1920×1080). 0.5px tolerance. |

Each collision entry shows `{type} {element-id}[x,y w×h] vs {other-id}[x,y w×h]`.

### Reading Collision Reports

A collision log entry tells you exactly which page, which elements, and what kind of violation:

```
PAGE ch01-intro/pg-02-section            ← the file to fix
  OVERFLOW text-h2-The Black Box Problem-1[85,48 400x94]
  vs  wrapper-3[85,48 400x47]            ← text exceeds wrapper height
```

| Part | What it means |
|---|---|
| `PAGE ch01-intro/pg-02-section` | Fix this file: `content/chapters/ch01-intro/pg-02-section.tsx` |
| `OVERFLOW` | Detection type (OVERLAP / OVERFLOW / EXCEED) |
| `text-h2-The Black Box Problem-1` | The overflowing element: `Text variant="h2"`, content "...", instance #1 |
| `[85,48 400x94]` | Its bounding box (browser coords): left=85, top=48, width=400, height=94 |
| `wrapper-3` | The parent container: 3rd Anim/Cardbox on the page |
| `400x47` | Parent's size matches the outline, but the text box (94px tall) is 2× larger — it wrapped |

**How to fix**: The text "The Black Box Problem" wraps to 2 lines at w=400 (h2, 54px font). The Anim wrapper only has h=47 (1 line). From the table below, h2 at 2 lines needs `h=145`. Increase the Anim's `h` to 145.

### False-positive prevention

- Elements covering ≥80% of the canvas are skipped (background/full-screen elements).
- Empty positioning wrappers (0×0) are skipped in OVERFLOW check.
- Elements smaller than 3×3px are skipped (filters KaTeX 1×1 helper spans).
- DOM positions must be stable for 3 consecutive `requestAnimationFrame` frames before detection runs.

## data-box-id

Core components (Text, Cardbox, Anim) automatically generate a `data-box-id` attribute for clear identification in collision reports:

| Component | data-box-id format | Example |
|---|---|---|
| `<Text variant="h1">Layout Basics</Text>` | `text-{variant}-{snippet}-{counter}` | `text-h1-Layout Basics-1` |
| `<Cardbox variant="default">` | `cardbox-{variant}-{counter}` | `cardbox-default-1` |
| `<Anim type="fade-in">` | `wrapper-{counter}` | `wrapper-1` |

Custom raw `<div>` elements without `data-box-id` fall back to `tagName + textContent.slice(0, 20)`.

## Font Metrics Reference

All text sizes defined in `components/theme.ts` `typography`:

| Variant | Font Size | Line Height | Line Box (px) |
|---|---|---|---|
| h1 | 72px | 1.2 | **86** |
| h2 | 54px | 1.3 | **70** |
| h3 | 42px | 1.4 | **59** |
| body | 30px | 1.6 | **48** |
| caption | 22px | 1.5 | **33** |
| citation | 22px | 1.5 | **33** |
| code | 28px | 1.5 | **42** |
| watermark | 28px | 1.5 | **42** |

**Rule**: `Box.h` must be ≥ text line box height. For multi-line text, multiply line box by line count:

```
h >= lines × fontSize × lineHeight
```

Examples:
- 2-line body text: `2 × 30 × 1.6 = 96` → set `h={96}` minimum
- 1-line caption: `1 × 22 × 1.5 = 33` → set `h={35}` minimum

## Border Subtraction

`box-sizing: border-box` is global. If a component has a border, subtract it:

```
effective_h = h - borderTop - borderBottom
```

| Component | Border | Effective h for h=40 |
|---|---|---|
| Cardbox default | 1px | 38px |
| Cardbox bordered | 2px | 36px |
| Cardbox elevated | 1px | 38px |

**Critical for bordered cardboxes**: A `Cardbox variant="bordered"` has 2px border on each side, reducing the content area by 4px in both width and height. Any `Text` child inside must have `w ≤ cardbox_w - 4` to avoid OVERFLOW detection.

**Anim wrapper height**: When wrapping content in `<Anim>`, the Anim's `h` must be ≥ the content's `h`. If text wraps to multiple lines, multiply by line count.

| Content | Line box per line | Anim h (1 line) | Anim h (2 lines) | Anim h (3 lines) |
|---|---|---|---|---|
| `<Text variant="h1">` | 86px | **90** | **175** | **260** |
| `<Text variant="h2">` | 70px | **75** | **145** | **215** |
| `<Text variant="h3">` | 59px | **65** | **120** | **180** |
| `<Text variant="body">` | 48px | **50** | **100** | **150** |
| `<Text variant="caption">` | 33px | **35** | **70** | **105** |

**Always check whether your text fits on one line at the given width.** For h1 at 72px font, English chars are ~43px each. "Natural Language Autoencoders" (27 chars) needs ~1161px, so it wraps at w=1000 but fits at w=1200.

Example: chapter badge with `w={200}` `h={48}`:
- Content area: 196w × 44h
- Text `w={190}` fits within 196 ✓
- Text `y={7}` with lineHeight 33 → bottom at 40, content h=44 ✓

## Caption Positioning

Bottom caption formula: `y = 1080 - (lineCount × 33) - 20`

| Lines | y | bottom |
|---|---|---|
| 1 | 1027 | 1060 |
| 2 | 994 | 1060 |
| 3 | 961 | 1060 |

Use `x={360}` `w={1200}` to center the caption (center=960, canvas center). Right edge at 1500 clears the watermark at x=1640.

## Spacing Checklist for Content Pages

Every content section page must follow this vertical rhythm:

```
y= 70  │ accent bar + h2 title     h=70 (matches h2 line box)
y=152  │ subtitle (caption)        h=35 (≥ caption 33px)
y=210+ │ content cards             h varies by content
```

**Gaps between elements**: minimum 12px. If a card bottom is at y=600 and the next element starts at y=612, no collision.

**Mermaid diagram containers**: both `w` and `h` must be ≥ 540px. Mermaid renders text labels inside SVG; a container smaller than half the canvas clips text and makes the diagram illegible.

**Excessive items**: If a page has many content cards (which may collide with caption or hit canvas edges), split into a continue page instead of cramming.
