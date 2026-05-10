# Narration System

## `public/narration.json` Schema

```json
{
  "{chapterId}": {
    "{pageId}": {
      "script": "Full narration text for this slide.",
      "audioSrc": "/audio/{chapterId}/{pageId}.wav"
    }
  }
}
```

- `script` — required. The full manuscript text.
- `audioSrc` — optional. Path to the audio file. If present, the player auto-plays it and advances on end.

## Audio File Convention

```
public/audio/
├── ch01-intro/
│   ├── pg-01-title.wav
│   └── pg-02-overview.wav
└── ch02-basics/
    ├── pg-01-title.wav
    ├── pg-02-core-concept.wav
    └── pg-03-summary.wav
```

- Folder structure mirrors `content/chapters/`
- Filename matches the page ID exactly (e.g., `pg-01-title.wav`)
- Supported format: WAV (or any browser-compatible audio format)

## How It Works

1. SlidePlayer fetches `narration.json` on mount
2. On each page transition, it looks up `narration[chapterId][pageId]`
3. The matched entry is provided to child components via `useNarration()`
4. If `audioSrc` exists, an `<audio>` element plays it
5. `audio.onended` triggers `navigate(1)` — auto advance to next page
6. Manual navigation pauses any playing audio

## `useNarration()` Hook

```tsx
import { useNarration } from '@/components/player/narration-context'

function MyPage() {
  const { script, audioSrc } = useNarration()
  return <Text variant="caption">{script}</Text>
}
```

Returns `{ script: string, audioSrc?: string }`.

## `tools/tts.py` (Placeholder)

```bash
python tools/tts.py --json /path/to/narration.json --output ./public/audio
```

Currently a stub. When implemented, it will:
1. Read narration JSON (file path or inline string)
2. Call the TTS API for each entry
3. Save audio to `{output}/{chapterId}/{pageId}.wav`
4. Write `_timing.json` manifest with durations
