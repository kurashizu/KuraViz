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

## Script Writing Guidelines

Write narration scripts to sound like natural human speech — not like reading a textbook or article aloud.

### Do's

- Use conversational phrasing: "So let's take a look at…" instead of "The following section examines…"
- Vary sentence length. Mix short punchy sentences with longer flowing ones.
- Use rhetorical questions: "But what does that actually mean?"
- Add transitions: "Now that we've covered X, let's move on to Y."
- Write for the ear, not the eye — read it aloud in your head. If it sounds stiff, rewrite it.
- For tutorials/explanations, imagine you're talking to a colleague over a whiteboard.

### Don'ts

- Don't start every sentence with "This", "The", or "It".
- Don't list facts in a dry "A is… B is… C is…" pattern.
- Don't use overly formal academic language unless the subject demands it.
- Don't write paragraph-long sentences without a breath pause.

### Line Breaks

- Use `\n` to split scripts into natural breath groups. A line should feel comfortable when read aloud.
- For English: roughly 1 line per sentence or clause.
- For Chinese: roughly every **40–50 characters**.
- For mixed text, count English words as roughly 2 characters each.
