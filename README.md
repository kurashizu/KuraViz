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

---

## Pipeline

### 1. Project Setup

`tools/scaffold.py` generates a Next.js workspace at the target directory. The workspace contains a pre-configured `scaffold/` folder with the slide player, component library, and tooling ready to go.

```
workspace/
├── outline.md               # Chapter outline
├── sources/                  # Reference materials
├── video.mp4                 # Final output
└── scaffold/
    ├── content/chapters/      # Page components
    ├── public/
    │   ├── narration.json     # Narration scripts
    │   └── audio/             # Generated .wav files
    ├── components/            # Slide primitives (read-only)
    ├── lib/                   # Utilities, types (read-only)
    └── tools/                 # Scripts (execute-only)
```

### 2. Slide Pages

Pages are React components (`'use client'`) with absolute-positioned elements on a 1920×1080 canvas. Each chapter has its own directory under `content/chapters/`, with an `index.ts` that registers all pages.

**Component library** (`components/`):

| Component | Purpose |
|---|---|
| `<Text>` | Typography (h1–h3, body, caption, citation, code, watermark) |
| `<Cardbox>` | Card container (default / elevated / bordered) |
| `<Anim>` | Entry animations (fade-in, slide-\*, scale-in) |
| `<Markdown>` | Rich text with LaTeX, GFM tables, task lists, code syntax highlighting |
| `<Mermaid>` | Diagrams (flowchart, sequence, mindmap, gantt, class) |
| `<BarChart>` / `<LineChart>` | Recharts-based data visualization |

**Styling constraints**: All styles are inline via `boxStyle()` from `lib/bbox.ts`. No Tailwind. Box heights must account for font metrics — see `references/collision-prevention.md`.

### 3. Narration

Each page has an entry in `public/narration.json`:

```json
{
  "{chapterId}": {
    "{pageId}": {
      "script": "Text spoken on this slide.\\nUse \\n for line breaks.",
      "audioSrc": "/audio/{chapterId}/{pageId}.wav"
    }
  }
}
```

The `script` field is displayed as a caption overlay and fed to TTS. The `audioSrc` path determines where the TTS output is stored and how the player loads it.

### 4. TTS Audio

**Interface**: `tools/generate_audio.py` reads `narration.json`, iterates over pages, and for each one calls:

```bash
/tts/your-adapter.py --text "script content" --output /path/to/output.wav
```

This is the **TTS adapter contract** — any script that accepts `--text` and `--output` can serve as the backend.

**Configuration**: Set `KURAVIZ_TTS_ADAPTOR` to the adapter path. If unset, generation is skipped. A template is at `tools/tts.example.py`.

**Skip logic**: Already-existing `.wav` files are skipped so the pipeline is restartable.

### 5. Player

`SlidePlayer` (`components/player/slide-player.tsx`) is the core runtime:

- Fetches `narration.json` on mount
- Looks up the current chapter+page key to get the `audioSrc`
- Creates an `HTMLAudioElement` and calls `.play()`
- On `onended`, auto-advances to the next page (500ms delay)
- Stops on the last slide (no wrap-around)
- Arrow keys ← → for manual navigation

**Record mode** (`?record=1`): Skips the click-to-start overlay. The player auto-plays from page 1 and logs every page change to the console as `[record] chapterId/pageId`. On the last slide it logs `[record] done`.

### 6. Video Capture

`tools/capture.mjs` orchestrates the recording:

1. Starts a Next.js production server on a random port
2. Launches Xvfb (virtual 1920×1080 display)
3. Creates a PulseAudio null sink for audio capture
4. Launches Playwright Firefox in kiosk mode (no browser UI) at `/?record=1`
5. Listens for `[record]` console messages to track progress
6. Starts FFmpeg (x11grab + pulse input) once playback begins
7. Signals FFmpeg to stop when `[record] done` is received
8. Cleans up: kills server, unloads audio sink, stops Xvfb

**Output**: A single MP4 with H.264 video (VAAPI hardware encoding if available) and AAC audio.

### 7. Collision Detection

`tools/test-collisions.mjs` runs headless Firefox with `?debug=auto`. It scans every page for four layout violation types:

| Type | Detection |
|---|---|
| `OVERLAP` | Sibling absolute elements overlap (>1px tolerance) |
| `OVERFLOW` | Child exceeds its positioned parent's bounds |
| `CONTENT_OVERFLOW` | Content inside `overflow:hidden` container exceeds its box (`scrollHeight > clientHeight`) |
| `EXCEED` | Element extends beyond the 1920×1080 canvas |

Results are written to `logs/debug.log` and printed as a summary.

---

## Prerequisites

- Node.js ≥ 18 + npm
- Python 3
- ffmpeg (optional: `h264_vaapi` for GPU encoding)
- pulseaudio-utils, Xvfb

## License

MIT
