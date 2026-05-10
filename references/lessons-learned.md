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

### 4. Bottom caption width must allow safe wrapping

Caption at `y=1000 w=1280` → 1 line, 33px → bottom at 1033, safe.
Same caption at `y=1000 w=600` with long script → 2 lines = 66px → bottom at 1066, still safe.
Caption at `y=1020 w=600` with 3 lines = 99px → bottom at 1119, **clipped by canvas**.

**Rule**: bottom caption must use `y ≤ 1000` and `w ≥ 1280` to keep scripts on 1-2 lines within 1080.

### 5. Mermaid containers under 540px clip diagram text

Mermaid renders text labels inside the SVG. Below w=540 or h=540, labels overflow and become unreadable. **Hard rule**: Mermaid `w ≥ 540 AND h ≥ 540`. Don't try to fit two Mermaid diagrams side-by-side on a single 1920px canvas — split into separate pages.

## Mermaid integration pitfalls

### 6. `mermaid.run({ nodes: [{ id, node }] })` does not exist

In Mermaid v11, `run()` accepts an array of `HTMLElement`, not `{id, node}` wrappers. **Correct API for our use case is `mermaid.render(id, chart)`** which returns `{ svg }` as a string, then assign `el.innerHTML = svg`.

### 7. Static `import mermaid from 'mermaid'` breaks Next.js SSR

Mermaid is a large ESM package. Static import causes vendor chunk resolution errors during build:
```
Cannot find module './vendor-chunks/mermaid.js'
```

**Correct**: `await import('mermaid')` inside `useEffect`, with `'use client'` at top of file.

### 8. `themeVariables` does NOT control mindmap colors

Mermaid v11 mindmap hardcodes `font-size: 40px` as a CSS rule and renders nodes with `style="..."` inline attributes. `themeVariables.fontSize` is ignored for mindmap.

**Correct approach**: After `render()`, walk the SVG and override `style.fontSize` on `<text>` elements directly. Inline style beats CSS class selectors.

### 9. CSS class names differ between diagram types

| Diagram | Node selector | Edge selector |
|---|---|---|
| mindmap | `.root rect/circle`, `.section rect/circle`, `.node:not(.root):not(.section)` | `.mindmap-edge, .mindmap-arrow` |
| flowchart | `.node rect/circle/polygon` | `.edgePath path`, `.arrowheadPath` |
| sequence | `rect.actor`, `text.actor`, `.actor-line` | `.messageLine0, .messageLine1`, `marker path` |
| gantt | `.task`, `.taskText` | `.grid .tick line` |
| class | `.classBox .outer` | `.relation` |

Use **descendant selector** (space) not direct child (`>`). Mermaid wraps nodes in nested `<g>` layers.

### 10. Setting font sizes after render breaks layout

If you call `mermaid.render()` with default fontSize, then post-process to `style.fontSize = '30px'`, Mermaid already computed the layout for the smaller font. Bigger font causes labels to overlap each other and break out of frames.

**Correct**: set font sizes in `initialize({ fontSize, sequence: { actorFontSize, messageFontSize, ... } })` so Mermaid computes layout with the correct sizes. Only override **colors** post-render, not fonts.

### 11. Mermaid SVG has hardcoded `max-width: 650px` inline style

Even after setting `width="100%"`, the SVG's inline `style="max-width: 650px"` constrains its width. Override with `svgEl.style.maxWidth = 'none'`.

### 12. Read `width`/`height` attributes BEFORE overriding to 100%

Bug:
```ts
svgEl.setAttribute('width', '100%')   // first, overrides original
const w = parseFloat(svgEl.getAttribute('width'))  // reads "100%" → NaN
```

Correct order: read `origW`/`origH` first, build `viewBox`, then set width/height to 100%.

## Collision detector pitfalls

### 13. `<=` flags touching edges as overlap

`ri.bottom <= rj.top` with strict equality treats `bottom=150, top=150` as collision. CSS sub-pixel rounding (`scale()` transforms) often produces 1px differences for elements that *should* be touching.

**Rule**: use strict `<` / `>` and add 1px tolerance: `ri.bottom > rj.top + 1`.

### 14. Detection runs during animation → false positives

framer-motion animations don't move layout (only transform/opacity), but during page transitions React might briefly mount both old and new pages. Detection during this window flags the cross-fade as collision.

**Fix**: poll `requestAnimationFrame` until DOM positions stabilize for 3 consecutive frames, then run detection once.

### 15. Skip wrapper containers with 0 width/height

Wrapping divs like `<div style={{ position: 'absolute', left: 160, top: 210 }}>` (no w/h) for grouping list items have `getBoundingClientRect()` returning 0×0. Their absolute children "exceed" them → false positive.

**Fix**: skip overflow check when parent's `width === 0 || height === 0`.

### 16. Background gradient div overlaps everything

A full-canvas gradient `<div>` at (0,0,1920,1080) overlaps every other element. **Fix**: skip elements covering ≥80% of the slide-viewport area.

## Configuration pitfalls

### 17. PORT in `.env` is not read by Next.js

Next.js reads `process.env.PORT` *before* dotenv loads `.env` files. Setting `PORT=9999` in `.env` does nothing.

**Working approaches**:
- CLI flag: `next dev -p 9999 -H 0.0.0.0` (in `package.json` scripts)
- `node --env-file=.env` (Node 20.6+)
- Inject directly into `package.json` via `scaffold.py --port 9999 --host 0.0.0.0`

This scaffold uses the third option: `tools/scaffold.py` rewrites `package.json` scripts on copy.

### 18. `shutil.copytree` resolves symlinks by default

`scaffold/node_modules/.bin/next` is a symlink to `../next/dist/bin/next`. Default copy turns it into a regular file with stale internal `require('../server/require-hook')` paths → "Cannot find module" at runtime.

**Fix**: `shutil.copytree(src, dst, symlinks=True)`.

### 19. Tailwind was removed; styling is inline only

Earlier versions used Tailwind v4. It was removed because:
- Only 4 utility classes were actually used
- `@theme` block duplicated `theme.ts` colors
- Build size drop was negligible

**Now**: all styles inline via `boxStyle()` from `lib/bbox.ts` + the `style` prop. **Do not reintroduce Tailwind.**

## Workflow

### 20. Always verify with `?debug=auto` before declaring done

After any layout change:
1. `npm run dev`
2. Open `?debug=auto` — auto-scans every page, writes `logs/debug.log`
3. Wait for green completion banner
4. `tail logs/debug.log` — must end with `SCAN COMPLETE: N pages, all clean`

If the log shows `N collision(s) found`, the layout is broken. Don't ship.
