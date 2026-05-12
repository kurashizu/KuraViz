# KuraViz

Build PPT-style videos from HTML slides. Agent-powered narrated tutorial videos — zero video editing required.

## Install

```bash
npx skills add kurashizu/KuraViz
```

## Usage

Ask your agent:

> *"Use KuraViz Skill, make a tutorial video about [a blog post / news article / any topic]".*

The agent will guide you through content, design, TTS audio, and final video recording.

## What It Does

1. **Write slides** — each page is a React component with text, cards, markdown, charts, or diagrams on a 1920×1080 canvas
2. **Add scripts** — pair each slide with a voiceover script
3. **Generate audio** — TTS pipeline turns scripts into `.wav` files
4. **Record video** — automatic playback captured into MP4 via Firefox + FFmpeg

## Prerequisites

- Node.js ≥ 18 + npm
- Python 3
- ffmpeg (optional: `h264_vaapi` for hardware encoding)
- pulseaudio-utils, Xvfb (for video recording)

## Structure

```
├── scaffold/       # Next.js app (slides, player, components)
├── references/     # Design guide, component API, rules
└── tools/          # Scaffold generator, capture, TTS template
```

## License

MIT
