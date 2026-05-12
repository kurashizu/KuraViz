# KuraViz

Fully autonomous video pipeline for AI agents. Build narrated tutorial videos from HTML slides — research, write, design, narrate, and record, all in one agent-driven workflow.

**Only requirement: Docker with Compose.** Everything else (Node.js, Python, Playwright Firefox, FFmpeg, Xvfb, PulseAudio) runs inside a self-contained container image published on [GHCR](https://github.com/kurashizu/KuraViz/pkgs/container/kuraviz-recorder).

---

## Install as Agent Skill

Clone this repo into your agent's skills directory:

| Agent | Install command |
|---|---|
| **OpenCode** | `git clone https://github.com/kurashizu/KuraViz.git ~/.config/opencode/skills/kuraviz` |
| **Claude Code** | `git clone https://github.com/kurashizu/KuraViz.git ~/.claude/skills/kuraviz` |
| **Cursor** | `git clone https://github.com/kurashizu/KuraViz.git ~/.cursor/skills/kuraviz` |
| **OpenClaw** | `git clone https://github.com/kurashizu/KuraViz.git ~/.openclaw/skills/kuraviz` |
| **Hermes Agent** | `git clone https://github.com/kurashizu/KuraViz.git ~/.hermes/skills/kuraviz` |

Or via `npx` (OpenCode):

```bash
npx skills add kurashizu/KuraViz
```

After install, the agent reads `SKILL.md` and follows its workflow. The human just says:

> *"Make a tutorial video about [topic]"*

The agent handles: project setup → research → page creation → collision fixing → TTS → video capture → final report.

If you want to explore KuraViz without an agent, clone the repo anywhere and run `./scaffold/kuraviz.sh` commands directly (see [Commands](#commands)).

---

## What the Agent Does

```
1. ./kuraviz.sh scaffold /workspace    → creates workspace/scaffold/, pre-pulls Docker image
2. Research sources                    → saves to workspace/sources/
3. outline.md + narration.json         → chapter structure + voiceover scripts
4. Create page components              → React .tsx files in scaffold/content/chapters/
5. ./kuraviz.sh test                   → collision scan, fix layout bugs
6. ./kuraviz.sh tts                    → generate .wav audio from scripts
7. ./kuraviz.sh build                  → production bundle
8. ./kuraviz.sh record                 → output/output.mp4
```

The agent creates everything under a `WORKSPACE` directory:

```
workspace/
├── outline.md               # chapter outline
├── sources/                  # reference materials
├── MEMORY.md                 # TTS config, language, style (created on first run)
└── scaffold/
    ├── content/chapters/      # page components
    ├── public/
    │   ├── narration.json     # voiceover scripts
    │   └── audio/             # generated .wav files
    ├── components/            # slide primitives (Text, Cardbox, Anim, Mermaid, …)
    ├── lib/                   # utilities, types
    ├── tools/                 # capture.mjs, test-collisions.mjs, generate_audio.py
    ├── kuraviz.sh             # CLI for all operations
    ├── kuraviz.ps1            # Windows PowerShell variant
    └── docker-compose.yml     # references ghcr.io/kurashizu/kuraviz-recorder
```

The Docker image (~800 MB) is pre-pulled during scaffold creation. It ships a full Ubuntu environment with all dependencies — no build step needed.

---

## Commands

All commands run from `scaffold/` inside the generated workspace (or the repo's own `scaffold/` for exploration). Every command runs in Docker — zero host dependencies.

```bash
# From repo root (project creation only):
./tools/scaffold.sh /path/to/output     # Linux/macOS/WSL
.\tools\scaffold.ps1 C:\path\to\output  # Windows

# From scaffold/ (all other commands):
./kuraviz.sh dev                       # dev server → http://localhost:9999 (human preview only)
./kuraviz.sh build                     # production build
./kuraviz.sh test                      # collision detection scan
./kuraviz.sh record                    # record video (requires build first)
./kuraviz.sh tts                       # batch TTS audio generation
./kuraviz.sh shell                     # open bash inside the container
```

Windows inside scaffold/: `.\kuraviz.ps1 dev` etc.

npm scripts (`npm run dev|build|test|record|tts`) are thin Docker wrappers — optional, requires npm installed on host.

---

## Pipeline Details

### 1. Project Setup

```bash
cd /path/to/kuraviz-repo
./tools/scaffold.sh /path/to/workspace
```

Copies the scaffold template into `workspace/scaffold/` and pre-pulls the Docker image from GHCR.

### 2. Source Collection & Outline

The agent collects 3–6 reference sources, saves them as markdown in `workspace/sources/`, and writes a chapter outline to `workspace/outline.md`. Each page gets a narration entry in `scaffold/public/narration.json`:

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

### 3. Page Creation

Each page is a `'use client'` React component on a 1920×1080 canvas, absolute-positioned. Registered in the chapter's `index.ts`.

| Component | Purpose |
|---|---|
| `<Text>` | Typography (h1–h3, body, caption, citation, code, watermark) |
| `<Cardbox>` | Card container (default / elevated / bordered) |
| `<Anim>` | Entry animations (fade-in, slide-\*, scale-in) |
| `<Markdown>` | Rich text with LaTeX, GFM tables, task lists, syntax-highlighted code |
| `<Mermaid>` | Diagrams (flowchart, sequence, mindmap, gantt, class) |
| `<BarChart>` / `<LineChart>` | Recharts data visualization |

Design rules and metric details are in `references/` — see `references/design-guide.md` and `references/collision-prevention.md`.

### 4. Collision Testing

Playwright (headless Firefox) scans every page for layout violations:

| Type | Detection |
|---|---|
| `OVERLAP` | Sibling absolute elements overlap |
| `OVERFLOW` | Child exceeds its positioned parent's bounds |
| `CONTENT_OVERFLOW` | Content hidden by `overflow:hidden` exceeds the box |
| `EXCEED` | Element extends beyond the 1920×1080 canvas |

```bash
./kuraviz.sh test   # outputs to logs/debug.log
```

Repeat until zero collisions. Fixes reference `references/collision-prevention.md`.

### 5. Audio Generation

`tools/generate_audio.py` reads `narration.json` and calls a TTS adapter for each page missing its `.wav` file.

**TTS adapter contract** — a script accepting `--text` and `--output`:

```bash
/tts/your-adapter.py --text "Script content" --output /path/to/output.wav
```

**Free option — edge-tts** (no API key required):

```bash
# scaffold/tools/requirements.txt
edge-tts
```

Based on `tools/tts.example.py`, create `scaffold/tools/tts.py` using `edge_tts`:
```python
import argparse, asyncio, edge_tts
async def main(): await edge_tts.Communicate(args.text, "zh-CN-XiaoxiaoNeural").save(args.output)
if __name__ == "__main__": asyncio.run(main())
```

Then set `KURAVIZ_TTS_ADAPTOR=/app/scaffold/tools/tts.py` and run:

```bash
./kuraviz.sh tts
```

If extra Python libraries are needed, write them to `scaffold/tools/requirements.txt` — the container auto-installs them before running.

If `KURAVIZ_TTS_ADAPTOR` is unset, TTS is skipped. See `tools/tts.example.py` for the adapter template.

### 6. Video Capture

Records the final MP4 using Firefox (kiosk mode) + FFmpeg (x11grab + PulseAudio).

```bash
./kuraviz.sh build
./kuraviz.sh record   # → output/output.mp4
```

For GPU-accelerated encoding (Linux, VAAPI-compatible GPU):

```bash
docker compose run --rm --device /dev/dri/renderD128 record
```

**How it works**: starts Next.js → Xvfb virtual display → PulseAudio null sink → Firefox at `/?record=1` → FFmpeg captures when playback begins → graceful stop on `[record] done`. Pages auto-advance driven by audio `onended` events. Times out if any page exceeds 5 minutes.

#### Troubleshooting

| Symptom | Fix |
|---|---|
| Firefox crash / shm error | Increase `shm_size` in docker-compose.yml to `4gb` |
| Black video | x11grab failed — check `[ffmpeg]` log lines |
| No audio in output | PulseAudio sink not ready — re-run |
| Image pull fails | Ensure the GHCR package visibility is set to Public |

---

## Further Reading

- **`SKILL.md`** — the workflow the agent follows step by step
- **`AGENTS.md`** — architecture rules, component reference, debug options
- **`references/`** — design guides, component APIs, collision prevention, narration schema

---

## License

MIT
