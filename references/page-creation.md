# Page Creation Guide

## Adding a New Page

### Step 1: Create the page component

File: `content/chapters/{chapter-folder}/pg-NN-{name}.tsx`

**IMPORTANT**: You must follow each page's description as specified in `WORKSPACE/outline.md`. Refer to `references/components.md` for available component APIs, `references/design-guide.md` for layout templates and design rules, and `references/collision-prevention.md` for font metrics and spacing rules.

The page layout should follow the standard structure outlined below, with the accent bar, title, subtitle, content cards, and caption in their respective positions.
Here is a template to get you started:

```tsx
'use client'

import { Anim } from '@/components/anim'
import { Text } from '@/components/text'
import { Cardbox } from '@/components/cardbox'
import { useNarration } from '@/components/player/narration-context'
import { colors } from '@/components/theme'

export default function PgNNName() {
  const { script } = useNarration()

  return (
    <>
      {/* Content section — accent bar + h2 + caption */}
      <Anim type="slide-left" delay={0} w={8} h={70} x={100} y={70}>
        <div style={{ width: '100%', height: '100%', background: colors.brand.primary, borderRadius: 4 }} />
      </Anim>

      <Anim type="fade-in" delay={100} x={128} y={72} w={600} h={70}>
        <Text variant="h2" x={0} y={0}>Page Title</Text>
      </Anim>

      <Anim type="fade-in" delay={200} x={128} y={152} w={600} h={35}>
        <Text variant="caption" x={0} y={0}>Subtitle text</Text>
      </Anim>

      {/* Content cards at y=200+ */}
      <Anim type="fade-in" delay={350} w={760} h={200} x={160} y={210}>
        <Cardbox variant="default" x={0} y={0} w={760} h={200}>
          <Text variant="body" x={20} y={20} w={720}>Content here</Text>
        </Cardbox>
      </Anim>

      {/* Caption: use \n in narration.json to control line breaks. h = lineCount × 33, y = 1080 - h - 20 */}
      <Text variant="caption" x={360} y={1027} w={1200} style={{ textAlign: 'center' }}>{script}</Text>
    </>
  )
}
```

### Step 2: Register the page

Edit `content/chapters/{chapter-folder}/index.ts`:

```tsx
import PgNNName from './pg-NN-name'

const chapter: ChapterDef = {
  id: 'chXX-name',
  title: 'Chapter Title',
  pages: [
    // ... existing pages
    { id: 'pg-NN-name', component: PgNNName },
  ],
}
```

## Rules

1. **File naming**: `pg-NN-{kebab-name}.tsx` where NN is zero-padded (01, 02, ...)
2. **Default export**: Each page must `export default function PgNNName()`
3. **No props**: Pages receive no props — use `useNarration()` for script access
4. **Box only**: All elements must use explicit x/y/w/h — no flex/grid at page level
5. **First page**: Each chapter's first page should be a title/intro slide
6. **Caption line**: Always include centered bottom caption. Use `\n` in `narration.json` to control line breaks. Set `h = lineCount × 33` and `y = 1080 - h - 20`. Use `x={360}` `w={1200}` (center=960, canvas center).
7. **Registration**: All pages must be registered in the chapter's `index.ts` — the SlidePlayer only loads pages from the chapter registry.
8. **Citation**: Use `<Text variant="citation">` for source attribution inside cardboxes, positioned at the bottom-right corner.
9. **Anim h matches content**: When wrapping content in `<Anim>`, the Anim's `h` must be ≥ the content's actual rendered height. If text wraps to multiple lines at the given width, each additional line adds a full line box (h1=86px, h2=70px, h3=59px, body=48px, caption=33px). For example, a 2-line h1 at w=1200 needs `Anim h≥172` (86×2), not 86. Never set Anim `h` smaller than the content it wraps.

## Section Layout Template

Content pages follow this rhythm:

```
y= 70  │ accent bar + h2 title     h=70 (matches h2 line box)
y=152  │ subtitle (caption)        h=35 (≥ caption 33px)  ← gap 12px from h2
y=210+ │ content cards             h varies by content
y=1027 │ bottom caption            centered, x=360 w=1200, h = lineCount × 33, y = 1080 - h - 20
```

The 12px gap between h2 bottom (142) and caption top (152) is critical — prevents 1px overlap from CSS scale subpixel rounding.

## Continue Page Template

When content overflows, create a continue page (no accent bar, no title). Content starts at y=80 to use full canvas:

```tsx
export default function PgXXContinue() {
  return (
    <>
      <Anim type="fade-in" delay={0} w={1720} h={920} x={100} y={80}>
        <Cardbox variant="default" x={0} y={0} w={1720} h={920}>
          {/* Content continues here */}
        </Cardbox>
      </Anim>
      <Text variant="caption" x={360} y={1027} w={1200} style={{ textAlign: 'center' }}>{script}</Text>
    </>
  )
}
```

For multi-item layouts (e.g. checklist), place items directly starting at y=80 without a wrapping cardbox.

## Bounding Box Reminder

| text | line box | min Box h |
|---|---|---|
| h1 (72px) | 86 | 120 |
| h2 (54px) | 70 | 80 |
| h3 (42px) | 59 | 65 |
| body (30px) | 48 | 50 per line |
| caption (22px) | 33 | 35 per line |

For `Cardbox variant="bordered"` (2px border), subtract 4px from h to get content area. Inner Text w must be ≤ cardbox_w - 4 to avoid overflow.
