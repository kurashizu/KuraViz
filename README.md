# KuraViz

A web-based slide builder for narrated video tutorials. Build PPT-style presentations as React components with auto-advance driven by audio playback — zero video editing required.

## How It Works

1. **Write slides as React components** — each page is a `tsx` file with absolute-positioned elements on a 1920×1080 canvas
2. **Add narration scripts** — pair each slide with a voiceover script in `narration.json`
3. **Generate audio** — TTS pipeline produces `.wav` files from the scripts
4. **Playback** — the SlidePlayer renders slides full-screen and auto-advances as each audio clip ends

The result is a downloadable HTML/JS bundle that plays like a video but is built entirely with web technologies.

## Project Structure

```
├── scaffold/               # Next.js app template
│   ├── content/chapters/   # Slide page components (modify these)
│   ├── public/
│   │   ├── narration.json  # Narration scripts (modify this)
│   │   └── audio/          # Generated .wav files
│   ├── components/         # Slide primitives (Text, Cardbox, Anim, Mermaid, ...)
│   └── lib/                # Utilities, types, collision detection
├── references/             # Component API docs, design guide, rules
└── tools/                  # Scaffold generator, TTS adapter
```

## Getting Started

```bash
# Create a new project
python tools/scaffold.py --dir /path/to/my-course

cd /path/to/my-course/scaffold
npm install
npm run dev
```

Open `http://localhost:9999?debug=1` to preview slides with the debug overlay.

### Audio Generation

```bash
cd scaffold
python tools/generate_audio.py
```

Reads `public/narration.json` and generates `.wav` files to `public/audio/` via the TTS adapter. Requires `KURAVIZ_TTS_ADAPTOR` env var set to the adapter script path.

### Video Capture

```bash
cd scaffold
node tools/capture.mjs output.mp4
```

Captures a 1920×1080 video of the automated playback using Firefox + FFmpeg. Requires Xvfb and pulseaudio-utils for headless recording.

### Playback Modes

| URL Parameter | Behavior |
|---|---|
| *(none)* | Click anywhere to start. Audio auto-advances through slides. |
| `?record=1` | No click needed. Page auto-plays from page 1, logs `[record] ch/pg` progress to console. |

## Core Components

| Component | Purpose |
|---|---|
| `<Text>` | Typography (h1, h2, h3, body, caption, citation, code) |
| `<Cardbox>` | Card container (default / elevated / bordered) |
| `<Anim>` | Entry animations (fade-in, slide-*, scale-in) |
| `<Markdown>` | Rich text with LaTeX, tables, task lists, syntax-highlighted code |
| `<Mermaid>` | Diagrams (flowchart, sequence, mindmap, gantt, class) |
| `<BarChart>` / `<LineChart>` | Recharts-based data visualization |

## Layout Canvas

- Fixed 1920×1080, 16:9 aspect ratio
- Absolute positioning only (no flex/grid at page level)
- Four collision detection types: `OVERLAP` (sibling), `OVERFLOW` (child vs parent), `CONTENT_OVERFLOW` (content exceeds overflow:hidden container), `EXCEED` (beyond canvas)
- Auto-generated `data-box-id` on all components for easy debugging

## License

MIT
