# KuraViz

Fully autonomous video pipeline skill for AI agents. Build narrated tutorial videos from HTML slides — research, write, design, narrate, and record, all in one agent-driven workflow. **Linux only** (requires Xvfb + pulseaudio for video capture).

## Install

```bash
npx skills add kurashizu/KuraViz
```

## Usage

Ask your agent:

> *"Use KuraViz Skill, make a tutorial video about [a blog post / news article / any topic]".*

The agent handles everything: content outline, slide pages, narration scripts, TTS audio, and video recording.

### First-Run Configuration

On first use, the agent checks if `MEMORY.md` exists. If not, it walks through `references/config-guide.md` as a setup wizard:

1. **TTS Adapter** — asks if you have a TTS server to connect
2. **Language** — narration and page content language (Chinese / English / Japanese etc.)
3. **Style** — narration tone (formal / conversational / tutorial)

Answers are saved to `MEMORY.md` and automatically loaded on subsequent runs.

## Prerequisites

- **Node.js** ≥ 18 + npm
- **Python 3** (stdlib only — no extra packages)
- **ffmpeg** (optional: `h264_vaapi` for GPU encoding)
- **pulseaudio-utils**, **Xvfb** (for video capture on Linux)

These are installed automatically when you `npm install` inside `scaffold/` (via `postinstall` script):
- playwright (Firefox browser)

---

## Pipeline

### 1. Project Setup

`tools/scaffold.py` generates a Next.js workspace at the target directory containing the slide player, component library, and tooling.

```
workspace/
├── outline.md               # Chapter outline (read/write)
├── sources/                  # Reference materials (read/write)
├── video.mp4                 # Final output (list only)
└── scaffold/
    ├── content/chapters/      # Page components (read/write)
    ├── public/
    │   ├── narration.json     # Narration scripts (read/write)
    │   └── audio/             # Generated .wav files (no access)
    ├── components/            # Slide primitives (read-only)
    ├── lib/                   # Utilities, types (read-only)
    └── tools/                 # Scripts (execute-only)
```

### 2. Source Collection & Outline

The agent collects reference materials (3–6 sources) and saves them to `workspace/sources/` as markdown. A chapter outline is written to `workspace/outline.md` with page titles and descriptions.

Each page gets an entry in `scaffold/public/narration.json`:

```json
{
  "{chapterId}": {
    "{pageId}": {
      "script": "Narration text for this slide.",
      "audioSrc": "/audio/{chapterId}/{pageId}.wav"
    }
  }
}
```

The `script` field is displayed as a caption overlay and fed to TTS. The `audioSrc` path maps to the TTS output and the player's audio lookup.

### 3. Page Creation

Each page is a `'use client'` React component with absolute-positioned elements on a 1920×1080 canvas. Registered in the chapter's `index.ts`.

**Component library** (in `components/`):

| Component | Purpose |
|---|---|
| `<Text>` | Typography (h1–h3, body, caption, citation, code, watermark) |
| `<Cardbox>` | Card container (default / elevated / bordered) |
| `<Anim>` | Entry animations (fade-in, slide-\*, scale-in) |
| `<Markdown>` | Rich text with LaTeX, GFM tables, task lists, syntax-highlighted code |
| `<Mermaid>` | Diagrams (flowchart, sequence, mindmap, gantt, class) |
| `<BarChart>` / `<LineChart>` | Recharts-based data visualization |

All styles are inline via `boxStyle()` from `lib/bbox.ts`. Box heights must account for font metrics — see `references/collision-prevention.md`.

### 4. Collision Testing & Fixing

`tools/test-collisions.mjs` runs Playwright (headless Firefox) with `?debug=auto`, scanning every page for layout violations:

| Type | Detection |
|---|---|
| `OVERLAP` | Sibling absolute elements overlap |
| `OVERFLOW` | Child exceeds its positioned parent's bounds |
| `CONTENT_OVERFLOW` | Content hidden by `overflow:hidden` exceeds the box |
| `EXCEED` | Element extends beyond the 1920×1080 canvas |

Results are written to `logs/debug.log` and printed as a summary. Repeat until zero collisions.

### 5. Audio Generation

`tools/generate_audio.py` reads `narration.json` and calls a TTS adapter for every page that doesn't already have a `.wav` file.

**TTS adapter contract**:
```bash
/tts/your-adapter.py --text "Script content" --output /path/to/output.wav
```

Set `KURAVIZ_TTS_ADAPTOR` to enable. A template is at `tools/tts.example.py`. If the env var is unset, generation is skipped.

### 6. Video Capture

`tools/capture.mjs` records the final MP4:

1. Starts a Next.js production server on a random port
2. Launches Xvfb (virtual 1920×1080 display)
3. Creates a PulseAudio null sink for audio capture
4. Launches Playwright Firefox in kiosk mode at `/?record=1`
5. Watches for `[record] ch/pg` console logs to track progress
6. Starts FFmpeg (x11grab + pulse) once playback begins
7. Stops FFmpeg when `[record] done` fires
8. Cleans up: server, audio sink, Xvfb

**SlidePlayer** (`components/player/slide-player.tsx`) is the runtime: fetches `narration.json`, creates an `HTMLAudioElement` for each page, and auto-advances on `onended` (500ms delay). In `?record=1` mode it skips the click-to-start overlay and auto-plays from page 1, logging every transition to the console.

---

## License

MIT
