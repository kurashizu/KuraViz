# Page Creation Guide

## Adding a New Page

### Step 1: Create the page component

File: `content/chapters/{chapter-folder}/pg-NN-{name}.tsx`

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

      {/* Caption: centered, 2/3 width, at y=1000 */}
      <Text variant="caption" x={320} y={1000} w={1280} style={{ textAlign: 'center' }}>{script}</Text>
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

### Step 3: Add narration script

Edit `public/narration.json`:

```json
{
  "chXX-name": {
    "pg-NN-name": {
      "script": "What to say during this slide.",
      "audioSrc": "/audio/chXX-name/pg-NN-name.wav"
    }
  }
}
```

### Step 4: Generate audio (placeholder)

```bash
python tools/tts.py --json '{"chXX-name":{"pg-NN-name":{"script":"..."}}}' --output ./public/audio
```

Place generated `pg-NN-name.wav` into `public/audio/chXX-name/`.

### Step 5: Verify no collisions

```bash
npm run dev
# Open http://0.0.0.0:9999/?debug=auto
# Navigate through all pages → check logs/debug.log
# Must end with: SCAN COMPLETE: N pages, all clean
```

## Rules

1. **File naming**: `pg-NN-{kebab-name}.tsx` where NN is zero-padded (01, 02, ...)
2. **Default export**: Each page must `export default function PgNNName()`
3. **No props**: Pages receive no props — use `useNarration()` for script access
4. **Box only**: All elements must use explicit x/y/w/h — no flex/grid at page level
5. **First page**: Each chapter's first page should be a title/intro slide
6. **Caption line**: Always include centered caption: `<Text variant="caption" x={320} y={1000} w={1280} style={{ textAlign: 'center' }}>{script}</Text>`
7. **Collision check**: After creating a page, run `?debug=auto` and verify `logs/debug.log`

## Section Layout Template

Content pages follow this rhythm:

```
y= 70  │ accent bar + h2 title     h=70 (matches h2 line box)
y=152  │ subtitle (caption)        h=35 (≥ caption 33px)  ← gap 12px from h2
y=210+ │ content cards             h varies by content
y=1000 │ bottom caption            centered, 2/3 width
```

The 12px gap between h2 bottom (142) and caption top (152) is critical — prevents 1px overlap from CSS scale subpixel rounding.

## Bounding Box Reminder

| text | line box | min Box h |
|---|---|---|
| h1 (72px) | 86 | 120 |
| h2 (54px) | 70 | 80 |
| h3 (42px) | 59 | 65 |
| body (30px) | 48 | 50 per line |
| caption (22px) | 33 | 35 per line |

For `Cardbox variant="bordered"` (2px border), subtract 4px from h to get content area.
