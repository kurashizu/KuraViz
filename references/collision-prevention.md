# Collision Prevention Guide

## Collision Detection System

`lib/bbox.ts` — `scanOverlaps(container)` checks three types of layout violations:

| Detection | Prefix | What it checks |
|---|---|---|
| **OVERLAP** | `OVERLAP` | Top-level siblings (direct children of container) that overlap each other. 1px tolerance for touching edges. |
| **OVERFLOW** | `OVERFLOW` | Absolutely-positioned child exceeds its nearest positioned parent's bounds. 0.5px tolerance. |
| **EXCEED** | `EXCEED` | Absolutely-positioned element extends beyond the canvas boundary (1920×1080). 0.5px tolerance. |

Each collision entry shows `{type} {element-id}[x,y w×h] vs {other-id}[x,y w×h]`.

### False-positive prevention

- Elements covering ≥80% of the canvas are skipped (background/full-screen elements).
- Empty positioning wrappers (0×0) are skipped in OVERFLOW check.
- Elements smaller than 3×3px are skipped (filters KaTeX 1×1 helper spans).
- DOM positions must be stable for 3 consecutive `requestAnimationFrame` frames before detection runs.

## data-box-id

Core components (Text, Cardbox, Anim) automatically generate a `data-box-id` attribute for clear identification in collision reports:

| Component | data-box-id format | Example |
|---|---|---|
| `<Text variant="h1">Layout Basics</Text>` | `text-{variant}-{snippet}-{useId}` | `text-h1-Layout Basics-:r0:` |
| `<Cardbox variant="default">` | `cardbox-{variant}-{useId}` | `cardbox-default-:r1:` |
| `<Anim type="fade-in">` | `anim-{type}-{useId}` | `anim-fade-in-:r2:` |

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
