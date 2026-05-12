# KuraViz

Fully autonomous video pipeline for AI agents. Build narrated tutorial videos from HTML slides — research, write, design, narrate, and record, all in one agent-driven workflow.

**Zero host dependencies** — the only requirement is Docker. Everything runs inside a self-contained container (Node.js, Python, Playwright Firefox, FFmpeg, Xvfb, PulseAudio).

## Prerequisites

- **Docker** (Docker Desktop on macOS/Windows, docker-ce on Linux)

## Install

Clone this repo into your agent's skills directory:

| Agent | Install command |
|---|---|
| **OpenCode** | `mkdir -p ~/.config/opencode/skills && git clone https://github.com/kurashizu/KuraViz.git ~/.config/opencode/skills/kuraviz` |
| **Claude Code** | `mkdir -p ~/.claude/skills && git clone https://github.com/kurashizu/KuraViz.git ~/.claude/skills/kuraviz` |
| **Cursor** | `mkdir -p ~/.cursor/skills && git clone https://github.com/kurashizu/KuraViz.git ~/.cursor/skills/kuraviz` |
| **OpenClaw** | `mkdir -p ~/.openclaw/skills && git clone https://github.com/kurashizu/KuraViz.git ~/.openclaw/skills/kuraviz` |
| **Hermes Agent** | `mkdir -p ~/.hermes/skills && git clone https://github.com/kurashizu/KuraViz.git ~/.hermes/skills/kuraviz` |

Or via `npx` (OpenCode):

```bash
npx skills add kurashizu/KuraViz
```

## Usage

Ask your agent:

> *"Use KuraViz Skill, make a tutorial video about [a blog post / news article / any topic]".*

The agent handles everything: content outline, slide pages, narration scripts, TTS audio, and video recording — all inside Docker.

### Commands

Every operation runs through Docker Compose. From the `scaffold/` directory:

```bash
./kuraviz.sh dev      # Start dev server at http://localhost:9999
./kuraviz.sh build    # Build production bundle
./kuraviz.sh test     # Run collision detection scan
./kuraviz.sh record   # Record video (requires prior build)
./kuraviz.sh tts      # Generate TTS audio files
./kuraviz.sh scaffold /path/to/output  # Create a new project from template
./kuraviz.sh shell    # Open a shell inside the container

# Windows (PowerShell)
.\kuraviz.ps1 dev
.\kuraviz.ps1 build
.\kuraviz.ps1 test
.\kuraviz.ps1 record
.\kuraviz.ps1 tts
.\kuraviz.ps1 shell
```

Or via npm (thin Docker wrappers — npm required on host):

```bash
npm run dev
npm run build
npm run test
npm run record
npm run tts
```

The image is pre-pulled during `./kuraviz.sh scaffold`. No build step needed.

### First-Run Configuration

On first use, the agent checks if `MEMORY.md` exists. If not, it walks through `references/config-guide.md` as a setup wizard:

1. **TTS Adapter** — asks if you have a TTS server to connect
2. **Language** — narration and page content language (Chinese / English / Japanese etc.)
3. **Style** — narration tone (formal / conversational / tutorial)

Answers are saved to `MEMORY.md` and automatically loaded on subsequent runs.

---

## Pipeline

### 1. Project Setup

```bash
cd /path/to/kuraviz-repo/scaffold
./kuraviz.sh scaffold /path/to/workspace
```

This creates the workspace directory containing the slide player, component library, and tooling. All dependencies run inside Docker — no npm or Python needed on the host.

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

### 4. Collision Testing

Collision detection uses Playwright (headless Firefox) to scan every page for layout violations:

| Type | Detection |
|---|---|
| `OVERLAP` | Sibling absolute elements overlap |
| `OVERFLOW` | Child exceeds its positioned parent's bounds |
| `CONTENT_OVERFLOW` | Content hidden by `overflow:hidden` exceeds the box |
| `EXCEED` | Element extends beyond the 1920×1080 canvas |

```bash
cd scaffold
npm run test
# or: ./kuraviz.sh test
```

Results are written to `logs/debug.log`. Repeat until zero collisions.

### 5. Audio Generation

`tools/generate_audio.py` reads `narration.json` and calls a TTS adapter for every page that doesn't already have a `.wav` file.

**TTS adapter contract**:
```bash
/tts/your-adapter.py --text "Script content" --output /path/to/output.wav
```

```bash
cd scaffold
npm run tts
# or: ./kuraviz.sh tts
```

Set `KURAVIZ_TTS_ADAPTOR` env var to enable. A template is at `tools/tts.example.py`. If the env var is unset, generation is skipped.

### 6. Video Capture

Records the final MP4. Requires a production build first.

```bash
cd scaffold
npm run build
npm run record
# or: ./kuraviz.sh build && ./kuraviz.sh record
```

To pass a GPU device for hardware encoding:

```bash
docker compose run --rm \
  --device /dev/dri/renderD128 \
  record
```

**How the recorder works**:

1. Starts Next.js production server on a random port
2. Launches Xvfb (virtual 1920×1080 display)
3. Creates a PulseAudio null sink for audio capture
4. Launches Firefox in kiosk mode at `/?record=1`
5. Waits for the first `[record] ch/pg` console log before starting FFmpeg — no loading screen is captured
6. Monitors page transitions; aborts if any page exceeds 5 minutes
7. Stops FFmpeg gracefully on `[record] done`

**SlidePlayer** (`components/player/slide-player.tsx`) is the runtime: fetches `narration.json`, creates an `HTMLAudioElement` for each page, and auto-advances on `onended` (500ms delay). In `?record=1` mode it skips the click-to-start overlay and auto-plays from page 1.

#### Troubleshooting

| Symptom | Fix |
|---|---|
| Firefox crash / shm error | Increase `shm_size` in docker-compose.yml to `4gb` |
| Hangs on `(init)` | Check that `?record=1` triggers auto-play in SlidePlayer |
| Black video | FFmpeg x11grab failed — check `[ffmpeg]` log lines |
| No audio in output | PulseAudio sink not ready — re-run |

---

## License

MIT
