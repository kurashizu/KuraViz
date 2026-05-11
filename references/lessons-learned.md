# Lessons Learned

Concrete mistakes that were made (and fixed) while building this scaffold. Read these before designing layouts or working with Mermaid — they save hours of debugging.

## Layout collisions

### 1. h2 container `h=70` exactly equals line box → siblings touch

`h2` line box is `54 × 1.3 = 70.2`. If you set Anim `h={70}` for an h2, then place the next sibling at `y = h2.y + 70`, sub-pixel rounding from CSS scale produces 1px overlap.

**Rule**: leave ≥ 12px gap between sibling Anim wrappers, even if the math says they touch exactly.

### 2. `box-sizing: border-box` shifts the content origin

For a `<Cardbox variant="bordered">` (2px border), `position: absolute` children measure from the **padding edge** (2px inside the visible border). A child at `top: 8` is actually 10px from the element's outer edge.

```
Cardbox h=42, 2px border each side
  → content area: y=2 to y=40 (38px)
  → Text at y=8 with lineHeight 33 → bottom at 41
  → overflows by 1px (clipped or flagged by detector)
Fix: h=44 → content area 40px → text bottom 41 → 1px margin
```

**Rule**: For `Cardbox bordered`, set `h ≥ textLineHeight + 2 + 2 + textY + safety`.

### 3. Text width too tight for caption causes line wrap

`<Text variant="caption" w={84}>Chapter 1</Text>` — "Chapter 1" at 22px font is ~125px wide. With `w=84` the text wraps to 2 lines, height becomes 66px, exceeds the 40px Cardbox content area, gets clipped/flagged.

**Rule**: When centering text in a Cardbox badge, give it ≥ 30px horizontal padding total. For a 22px caption, expect ~12px per Chinese char and ~10px per ASCII char.

### 4. Bottom caption clips if h is too small

`<Text variant="caption" h={35}>` only fits 1 line. If the script wraps, content is clipped.

**Rule**: use `\n` in `narration.json` to manually control line breaks. You know the exact line count. Set `h = lineCount × 33` and `y = 1080 - h - 20`.

### 5. Mermaid containers under 540px clip diagram text

Mermaid renders text labels inside the SVG. Below w=540 or h=540, labels overflow and become unreadable. **Hard rule**: Mermaid `w ≥ 540 AND h ≥ 540`. Don't try to fit two Mermaid diagrams side-by-side on a single 1920px canvas — split into separate pages.

## Collision detector pitfalls

### 6. `<=` flags touching edges as overlap

`ri.bottom <= rj.top` with strict equality treats `bottom=150, top=150` as collision. CSS sub-pixel rounding (`scale()` transforms) often produces 1px differences for elements that *should* be touching.

**Rule**: use strict `<` / `>` and add 1px tolerance: `ri.bottom > rj.top + 1`.

### 7. Detection runs during animation → false positives

framer-motion animations don't move layout (only transform/opacity), but during page transitions React might briefly mount both old and new pages. Detection during this window flags the cross-fade as collision.

**Fix**: poll `requestAnimationFrame` until DOM positions stabilize for 3 consecutive frames, then run detection once.

### 8. Skip wrapper containers with 0 width/height

Wrapping divs like `<div style={{ position: 'absolute', left: 160, top: 210 }}>` (no w/h) for grouping list items have `getBoundingClientRect()` returning 0×0. Their absolute children "exceed" them → false positive.

**Fix**: skip overflow check when parent's `width === 0 || height === 0`.

### 9. Background gradient div overlaps everything

A full-canvas gradient `<div>` at (0,0,1920,1080) overlaps every other element. **Fix**: skip elements covering ≥80% of the slide-viewport area.

## Workflow

### 10. Always verify with `?debug=auto` before declaring done

After any layout change:
1. `npm run dev`
2. Open `?debug=auto` — auto-scans every page, writes `logs/debug.log`
3. Wait for green completion banner
4. `tail logs/debug.log` — must end with `SCAN N pages all clean`

If the log shows `N collisions`, the layout is broken. Don't ship.
