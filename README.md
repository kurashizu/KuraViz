# KuraViz

Build PPT-style videos from HTML slides. Agent-powered narrated tutorial videos — zero video editing required. **Linux only** (requires Xvfb + pulseaudio for video capture).

## Install

```bash
npx skills add kurashizu/KuraViz
```

## Usage

Ask your agent:

> *"Use KuraViz Skill, make a tutorial video about [a blog post / news article / any topic]".*

The agent will guide you through the full pipeline: content outline, slide pages, narration scripts, TTS audio, and final video recording.

## Overview

Slides are React components rendered in a fixed 1920×1080 canvas. Each slide has an audio clip; the player auto-advances when a clip finishes. The final output is an MP4 captured from headless Firefox with FFmpeg (x11grab + pulse).

### Pipeline

1. **Slide pages** — `.tsx` components in `content/chapters/`. Text, cards, markdown, charts, diagrams using a component library with built-in collision detection.
2. **Narration** — `narration.json` on each page.
3. **TTS audio** — `generate_audio.py` iterates over all pages and calls a TTS adapter script for each one, producing `.wav` files.

### TTS Adapter

The adapter is a standalone script that follows a simple CLI contract:

```bash
/path/to/tts.py --text "Narration content" --output /path/to/output.wav
```

Set `KURAVIZ_TTS_ADAPTOR` to its absolute path. If the env var is unset, audio generation is skipped. A template is provided at `tools/tts.example.py`.

### Video Capture

`capture.mjs` uses Playwright (Firefox) to open the page in `?record=1` mode, which auto-plays through all slides. FFmpeg records the Xvfb display and PulseAudio sink simultaneously. Progress is logged via `[record] ch/pg` console output; the script stops when `[record] done` appears.

### Collision Detection

`test-collisions.mjs` runs Playwright in headless Firefox with `?debug=auto`, scanning every page for four types of layout issues: `OVERLAP`, `OVERFLOW`, `CONTENT_OVERFLOW`, and `EXCEED`. Results are written to `logs/debug.log`.

## Prerequisites

- Node.js ≥ 18 + npm
- Python 3
- ffmpeg (optional: `h264_vaapi` for hardware encoding)
- pulseaudio-utils, Xvfb (for video recording)

## Structure

```
├── scaffold/       # Next.js app (slides, player, component library)
├── references/     # Design guide, component API, rules
└── tools/          # Scaffold generator, capture, TTS template
```

## License

MIT
