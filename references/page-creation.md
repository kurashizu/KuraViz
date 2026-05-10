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

export default function PgNNName() {
  const { script } = useNarration()

  return (
    <>
      {/* Page content — all elements use Box positioning */}
      <Anim type="fade-in" delay={0} x={0} y={0} w={1920} h={1080}>
        <Text variant="h2" x={120} y={100} w={800}>Page Title</Text>
        <Text variant="body" x={120} y={200} w={600}>Content...</Text>
        <Cardbox variant="elevated" x={800} y={150} w={400} h={300}>
          <Text variant="body">Side panel</Text>
        </Cardbox>
      </Anim>

      {/* Script display (for debug/reference) */}
      <Text variant="caption" x={80} y={1020} w={800}>{script}</Text>
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

### Step 4: Generate audio

```bash
# Extract relevant narration entry and generate audio
python tools/tts.py --json '{"chXX-name":{"pg-NN-name":{"script":"..."}}}' --output ./public/audio
```

Place generated `pg-NN-name.wav` into `public/audio/chXX-name/`.

## Rules

1. **File naming**: `pg-NN-{kebab-name}.tsx` where NN is zero-padded (01, 02, ...)
2. **Default export**: Each page must `export default function PgNNName()`
3. **No props**: Pages receive no props — use `useNarration()` for script access
4. **Box only**: All elements must use explicit x/y/w/h — no flex/grid at page level
5. **First page**: Each chapter's first page should be a title/intro slide
6. **Script line**: Always include `<Text variant="caption" x={80} y={1020} w={800}>{script}</Text>` at the bottom
