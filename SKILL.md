---
name: KuraViz
description: >-
  Fully autonomous video pipeline for AI agents. Build narrated slide decks
  rendered in a 1920x1080 canvas with auto-advance driven by audio playback.
use_when: >-
  User asks to create a video tutorial, slide-based course, narrated presentation,
  or e-learning content using web technologies. Also use when building or modifying
  slide pages, narration scripts, or TTS audio for video lessons.
---

# KuraViz Skill

## Prerequisites

**Docker with Compose** is the only host dependency. All tooling (Node.js, Python, Playwright, FFmpeg) runs inside a self-contained container. The user must have Docker and `docker compose` (v2 plugin) installed and running.

On macOS/Linux/WSL use `./scaffold/kuraviz.sh` from the repo root, or `./kuraviz.sh` from within scaffold/. On Windows (PowerShell) use `.\scaffold\kuraviz.ps1`. npm scripts (`npm run dev|build|test|record|tts`) are also available but require npm installed on the host.

## Workflow

### 0. Configuration

First, check if `MEMORY.md` exists in the current working directory (the project root, not inside a generated workspace — this config persists across projects).
- If **yes**: read saved preferences and skip configuration.
- If **no**: create `MEMORY.md` and follow `references/config-guide.md` to ask the user for configuration. 
 
**Remember** to load all environment variables from `MEMORY.md` before executing any related tools.

### 1. Project Setup

1. Create / choose a directory for your video project. This is your `WORKSPACE`.
2. Run scaffold from the skill's repo directory to generate the project skeleton:
   ```bash
   cd /path/to/kuraviz-repo
   ./tools/scaffold.sh /path/to/WORKSPACE
   ```
   This creates `WORKSPACE/scaffold/` with all files and tools, then pre-pulls the recorder image so all future commands are instant. No npm or Python required on the host — everything runs inside Docker.

3. Created structure:
   ```
   WORKSPACE/                     ← your working root
   ├── scaffold/                  ← generated here (cd into it for all commands)
    └── (sources/, outline.md go here — one level above scaffold/)
   ```

You must strictly follow the **directory structure** and **access rules** below:
```
WORKSPACE/
├── outline.md               # Chapter outline - Read/Write
├── sources/                  # Reference materials - Read/Write
├── ...                       # Everything else — No access
└── scaffold/
    ├── output/               # Recorded video output - List-files-only
    │   └── output.mp4        # Final video
    ├── content/chapters/      # Page components - Read/Write
    ├── public/
    │   ├── narration.json     # Narration scripts - Read/Write
    │   └── audio/             # Auto-generated TTS audio files - List-files-only
    ├── tools/
    │   ├── generate_audio.py   # Batch TTS generation - Execute-only
    │   ├── capture.mjs         # Video capturing script - Execute-only
    │   └── test-collisions.mjs # Collision detection scan - Execute-only
    └── ...                    # Everything else — No access
```

### 2. Source Collection & Outline

**You MUST collect real reference materials — never make up content.** If the user provided source materials, convert them to markdown files and save them in `WORKSPACE/sources/`. Otherwise, use web search to find relevant materials, write them as markdown files, and save them to `WORKSPACE/sources/`. Do not proceed without concrete source material.

1. Collect 3-6 relevant reference materials and save as markdown files in `WORKSPACE/sources/`.
2. Create `WORKSPACE/outline.md` with chapters and pages. Each page must have a title and a description of its content. See `references/outline-example.md` for an example.
3. Generate narration JSON at `WORKSPACE/scaffold/public/narration.json`. Use `\n` to manually control line breaks in scripts — this determines the caption `h` on each page. Follow `references/narration-system.md` for the schema.

### 3. Page Creation

First, rewrite `scaffold/content/chapters/index.ts` to make sure you unlink all example chapters and pages.

Split chapters evenly across **2 subagents** for parallel development. Each subagent reads the same reference files independently and follows the same process:

- `WORKSPACE/sources/` — research content
- `WORKSPACE/outline.md` — relevant chapters
- `WORKSPACE/scaffold/public/narration.json` — scripts (read-only)
- `references/page-creation.md`, `references/design-guide.md`, `references/components.md`
- `references/collision-prevention.md` — read before setting any `h`
- the language used for page content and narration

Each subagent, for each of its chapters:
1. Creates pages as `pg-NN-name.tsx` in `content/chapters/chXX-name/`.
2. Registers each page in the chapter's `index.ts`.

### 4. Collision Testing & Fixing

1. Run collision test from `scaffold/`:
   ```bash
   ./kuraviz.sh build   # production build (required before scan)
   ./kuraviz.sh test    # scan all pages → logs/debug.log
   ```
2. Read the output to find which pages have issues, then fix them using `references/collision-prevention.md`.
3. Repeat until no collisions remain.

### 5. Audio Generation

Run the batch TTS orchestrator from `scaffold/`:
```bash
./kuraviz.sh tts
```
This runs inside Docker. Set `KURAVIZ_TTS_ADAPTOR` env var to enable TTS. After this, audio files will be generated in `scaffold/public/audio/` so `narration.json` can find them.

### 6. Video Capture

First build, then record — both from `scaffold/`:
```bash
./kuraviz.sh build
./kuraviz.sh record
# output → scaffold/output/output.mp4
```

To save to a custom path (e.g. `../video.mp4`):
```bash
docker compose run --rm -v "$(pwd)/..:/output" record /output/video.mp4
```

This will generate the video file. All dependencies (FFmpeg, Xvfb, PulseAudio, Firefox) are handled inside the Docker container.

### 7. Final Report

Write a final report summarizing the work you did, including:
- A summary of the video content and structure (chapters/pages).
- Any challenges you faced and how you overcame them.

## Directory Reference

| Path | Description |
|---|---|
| `references/config-guide.md` | Environment variables and user preferences |
| `references/components.md` | All component APIs |
| `references/page-creation.md` | Page creation workflow |
| `references/narration-system.md` | Narration JSON schema |
| `references/design-guide.md` | Visual design rules, layout templates |
| `references/collision-prevention.md` | Font metrics, box sizing, debug workflow |
| `references/outline-example.md` | Example chapter outline |
