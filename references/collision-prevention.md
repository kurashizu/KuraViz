# Collision Prevention Guide

## Font Metrics Reference

All text sizes defined in `components/theme.ts` `typography`:

| Variant | Font Size | Line Height | Line Box (px) |
|---|---|---|---|
| h1 | 72px | 1.2 | **86** |
| h2 | 54px | 1.3 | **70** |
| h3 | 42px | 1.4 | **59** |
| body | 30px | 1.6 | **48** |
| caption | 22px | 1.5 | **33** |
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

With `box-sizing: border-box`, `position: absolute` children are positioned relative to the **padding box** (after border). So a child at `top: 8` starts at 8px inside the content area, not 8px from the element edge.

For `Cardbox variant="bordered"` (2px border) containing 1-line caption text:
```
h=42 → content area after border = 42-2(top)-2(bottom) = 38px  (y=2 to y=40)
Text at y=8 with lineHeight 33 → bottom at 41 → overflows by 1px
Fix: h=44 → content area = 40px → text bottom at 41 → 1px margin
```

**Formula**: `h ≥ textLineHeight + borderTop + borderBottom + y`

## Spacing Checklist for Content Pages

Every content section page must follow this vertical rhythm:

```
y= 70  │ accent bar + h2 title     h=70 (matches h2 line box)
y=140  │ subtitle (caption)        h=35 (≥ caption 33px)
y=200+ │ content cards             h varies by content
```

**Gaps between elements**: minimum 16px. If a card bottom is at y=600 and the next element starts at y=620, no collision.

**Mermaid diagram containers**: both `w` and `h` must be ≥ 540px. Mermaid renders text labels inside SVG; a container smaller than half the canvas clips text and makes the diagram illegible.

## Debug Verification

After creating/modifying any page:

1. Run `npm run dev`
2. Open `http://0.0.0.0:9999/?debug=1`
3. Navigate through all pages with → key
4. **Red banner at top = collision detected**. Fix and retry.
5. Green = no collisions

## Common Causes of Collisions

| Symptom | Root Cause | Fix |
|---|---|---|
| Text clipped or overlapping sibling | `Box.h` too small for font | Increase `h` to fit line box |
| Text exceeds Cardbox border | border thickness not accounted for | Add 2-4px to `h` |
| Caption extends past canvas bottom | `y + textHeight > 1080` | Move up or reduce `w` (wider = fewer lines) |
| Child content overflows parent card | Parent `h` too small | Measure all children + gaps |
| Two Anim blocks overlap | Adjacent Y spans intersect | Adjust `y` or `h` to leave gap |

## Zero-Tolerance Policy

- No scrollbars (`overflow: hidden` — content MUST fit)
- No red collision banner at `?debug=1`
- No text clipped by container bounds
