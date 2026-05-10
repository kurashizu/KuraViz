---
name: web-video-tutorial
description: >-
  Build PPT-style video tutorials using HTML slides (Next.js/React) + TTS audio.
  Generates narrated slide decks rendered in a 1920x1080 canvas with auto-advance driven by audio playback.
use_when: >-
  User asks to create a video tutorial, slide-based course, narrated presentation,
  or e-learning content using web technologies. Also use when building or modifying
  slide pages, narration scripts, or TTS audio for video lessons.
config:
  canvas_width: 1920
  canvas_height: 1080
  server_host: 0.0.0.0
  server_port: 9999
  debug_flag: "?debug=1"
---

# Web Video Tutorial Skill

## Overview

This skill builds PPT-style video tutorials using HTML slides + TTS audio. Each slide is a React component rendered in a 1920×1080 canvas, with auto-advance driven by audio playback.

## Core Constraints

1. **Canvas**: 1920×1080 fixed — defined in `lib/theme.ts`. Do not change.
2. **Layout**: All elements use Box absolute positioning (`x`, `y`, `w`, `h`). No `flex`/`grid` at page level.
3. **Colors**: Must use CSS variables (`var(--brand-primary)`) or `@/components/theme` constants. No hardcoded hex values.
4. **Text**: Use `<Text variant="...">` — never raw `<h1>`, `<p>`, etc.
5. **Animation**: Use `<Anim type="..." delay={ms}>` — never direct framer-motion.
6. **Pages**: Each page is a default-exported component in `content/chapters/{ch}/pg-NN-{name}.tsx`.
7. **Registration**: Every page must be registered in its chapter's `index.ts`.
8. **Narration**: Every page must have an entry in `public/narration.json`. `script` field is required.

## Project Structure

```
scaffold/
├── lib/theme.ts                # colors, typography, canvas (1920×1080)
├── app/                        # Next.js App Router
├── components/
│   ├── player/                 # SlidePlayer, narration, debug, progress
│   ├── text/                   # <Text variant="h1|h2|h3|body|caption|code">
│   ├── anim/                   # <Anim type="fade-in|slide-*|scale-in" delay={ms}>
│   ├── markdown/               # Markdown renderer (LaTeX, Mermaid, tables)
│   ├── graph/                  # BarChart, LineChart, MindMap, Axis
│   ├── cardbox/                # Card container
│   ├── image/                  # Image with effects
│   └── svg/                    # SVG wrapper
├── lib/                        # types, theme, utils, bbox
├── content/chapters/           # Page components organized by chapter
├── public/
│   ├── narration.json          # All narration scripts + audio paths
│   └── audio/                  # Generated audio files
└── tools/tts.py                # TTS adapter (placeholder)
```

## Component System

See `references/components.md` for full API documentation of each component.

## Workflow

### Creating a New Lesson

1. Create chapter folder: `content/chapters/chXX-name/`
2. Add `index.ts` with chapter metadata
3. Create slide files: `pg-01-title.tsx`, `pg-02-xxx.tsx`, ...
4. Add narration entries to `public/narration.json`
5. Generate audio: `python tools/tts.py --json ...`
6. Place audio: `public/audio/chXX-name/pg-NN-xxx.wav`
7. Test: `npm run dev` → open `http://0.0.0.0:9999?debug=1`

### Testing

- `?debug=1` — shows chapter ID, page ID, audio path, script text in red overlay
- Arrow keys: ← previous page, → next page
- Audio plays automatically and advances on end

## Directory Reference

| Path | Description |
|---|---|
| `references/components.md` | All component APIs |
| `references/page-creation.md` | Page creation workflow |
| `references/narration-system.md` | Narration JSON schema + audio system |
| `references/design-guide.md` | Visual design rules, layout templates, color assignments |

## Prohibited Actions

- ❌ Do not use raw `<div>` for layout — always use Box-based components
- ❌ Do not hardcode colors — use `@/components/theme` or CSS variables
- ❌ Do not bypass the SlidePlayer — all pages must be registered in the chapter system
- ❌ Do not modify `lib/theme.ts` canvas config — 1920×1080 is fixed
- ❌ Do not add `npm install` of new packages without verifying with the user
