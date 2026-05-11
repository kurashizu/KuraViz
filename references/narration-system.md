# Narration System

## `public/narration.json` Schema

```json
{
  "{chapterId}": {
    "{pageId}": {
      "script": "Full narration text for this slide.\nUse \\n for line breaks to control caption height.",
      "audioSrc": "/audio/{chapterId}/{pageId}.wav"
    }
  }
}
```

- `script` — required. The full manuscript text. Use `\n` (single backslash-n in JSON) to manually insert line breaks. This lets you control the caption `h` and `y` precisely (see `references/design-guide.md` for the positioning formula).
- `audioSrc` — required. TTS and the application will rely on this path. Even though there is no actual audio file in the path, you must provide it to ensure the system functions correctly.

## Audio File Convention

```
public/audio/
├── ch01-{name}/
│   └── pg-01-title.wav
└── ch02-{name}/
    └── pg-01-title.wav
```

- Folder structure mirrors `content/chapters/`
- Filename matches the page ID exactly (e.g., `pg-01-title.wav`)
- Supported format: WAV (or any browser-compatible audio format)

## `useNarration()` Hook

```tsx
import { useNarration } from '@/components/player/narration-context'

function MyPage() {
  const { script, audioSrc } = useNarration()
  return <Text variant="caption">{script}</Text>
}
```

Returns `{ script: string, audioSrc?: string }`.

## Caption Height Calculation

```ts
const lineCount = script.split('\n').length  // count explicit line breaks
const captionH = lineCount * 33              // 33px per line
const captionY = 1080 - captionH - 20        // bottom margin
```
