# KuraViz

Fully autonomous video pipeline skill for AI agents. Build narrated tutorial videos from HTML slides — research, write, design, narrate, and record, all in one agent-driven workflow. **Linux only** (requires Xvfb + pulseaudio for video capture).

## Install

```bash
npx skills add kurashizu/KuraViz
```

## Usage

Ask your agent:

> *"Use KuraViz Skill, make a tutorial video about [a blog post / news article / any topic]".*

The agent handles content, slide pages, narration scripts, TTS audio, and video recording.

## How It Works

Slides are React components on a fixed canvas. Each slide has an audio clip; the player auto-advances when a clip ends. The final MP4 is captured from headless Firefox with FFmpeg.

- **TTS Adapter** — a standalone script with `--text "..." --output path.wav` interface. Set `KURAVIZ_TTS_ADAPTOR` to enable. Template: `tools/tts.example.py`.
- **Capture** — `capture.mjs` opens the page in `?record=1` mode (auto-play), records via x11grab + pulse, stops on `[record] done`.
- **Collision Detection** — `test-collisions.mjs` scans every page for layout issues via headless Firefox.

## Prerequisites

- Node.js ≥ 18 + npm
- Python 3
- ffmpeg (optional: `h264_vaapi`)
- pulseaudio-utils, Xvfb

## Structure

```
├── scaffold/       # Next.js app (slides, player, component library)
├── references/     # Design guide, component API, rules
└── tools/          # Scaffold generator, capture, TTS template
```

## License

MIT
