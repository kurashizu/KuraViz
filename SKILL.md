---
name: KuraViz
description: >-
  Build PPT-style videos using HTML slides (Next.js/React) + TTS audio.
  Generates narrated slide decks rendered in a 1920x1080 canvas with auto-advance driven by audio playback.
use_when: >-
  User asks to create a video tutorial, slide-based course, narrated presentation,
  or e-learning content using web technologies. Also use when building or modifying
  slide pages, narration scripts, or TTS audio for video lessons.
---

# KuraViz Skill

## Prerequisites

- **Node.js** ≥ 18 + **npm**
- **Python 3** (standard library — no extra packages required)
- **Git**
- **ffmpeg** — for screen recording and encoding
- **pulseaudio-utils** — for virtual audio sink (`pactl`)
- **Playwright Firefox** — install after `npm install` in scaffold:
  ```bash
  cd scaffold && npx playwright install firefox
  ```

## Overview

Build PPT-style videos as narrated HTML slides. Each slide is a React component in a 1920×1080 canvas; audio playback drives auto-advance.

## Core Constraints

- **File access**: After running `tools/scaffold.py --dir /path/to/workspace`, you can only modify files in `scaffold/content/*` and `scaffold/public/narration.json`. Do not read or modify any other scaffold files. Do not read or modify any tool files.
- **Theme**: `scaffold/components/theme.ts` is read-only — reference it for colors/typography/canvas config.

## Workflow

### 0. Workflow Options

Before starting, ask the user if they want you do the workflow step-by-step with for review.
- If yes, immediately ****STOP**** at each **PAUSE POINT** and ask for confirmation before proceeding.
- If no, ****IGNORE**** all pause points and proceed through all steps and provide a final summary of changes.

Then ask the user for video language, which you will use when writing narration scripts and creating pages.

### 1. Project Setup

1. Create a directory named after your video content. This is your `WORKSPACE`.
2. Run `tools/scaffold.py --dir /PATH/TO/WORKSPACE` to generate the scaffold.

```
WORKSPACE/
└── scaffold/
    ├── content/chapters/      # Page components (modify here)
    ├── public/
    │   ├── narration.json     # Narration scripts (modify here)
    │   └── audio/
    └── ...                    # Do not modify other files
```

### 2. Source Collection & Outline

**You MUST collect real reference materials — never make up content.** If the user provided source materials, convert them to markdown files and save them in `WORKSPACE/sources/`. Otherwise, use web search to find relevant materials, write them as markdown files, and save them to `WORKSPACE/sources/`. Do not proceed without concrete source material.

1. Collect 3-6 relevant reference materials and save as markdown files in `WORKSPACE/sources/`.
2. Create `WORKSPACE/outline.md` with chapters and pages. Each page must have a title and a description of its content. See `references/outline-example.md` for an example.
3. Generate narration JSON at `WORKSPACE/scaffold/public/narration.json`. Use `\n` to manually control line breaks in scripts — this determines the caption `h` on each page. Follow `references/narration-system.md` for the schema.

### **PAUSE POINT**

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

### **PAUSE POINT**

### 4. Collision Testing & Fixing

1. Run `node tools/test-collisions.mjs` from `scaffold/`, no need to run `npm run build` as this script will build and test in one step.
2. Read the output to find which pages have issues, then fix them using `references/collision-prevention.md`.
3. Repeat until no collisions remain.

### 5. Audio Generation

Run the batch TTS orchestrator from `scaffold/`:
```bash
python tools/generate_audio.py
```
After this, audio files will be generated in `scaffold/public/audio/` so `narration.json` can find them.

### **PAUSE POINT**

### 6. Video Capture

Run the video capture script from `scaffold/`:
```bash
node tools/capture.mjs ../video.mp4
```
This will generate `WORKSPACE/video.mp4`.

### 7. Final Report

Write a final report summarizing the work you did, including:
- A summary of the video content and structure (chapters/pages).
- Any challenges you faced and how you overcame them.

## Directory Reference

| Path | Description |
|---|---|
| `references/components.md` | All component APIs |
| `references/page-creation.md` | Page creation workflow |
| `references/narration-system.md` | Narration JSON schema |
| `references/design-guide.md` | Visual design rules, layout templates |
| `references/collision-prevention.md` | Font metrics, box sizing, debug workflow |
| `references/lessons-learned.md` | Concrete mistakes + fixes |
| `references/outline-example.md` | Example chapter outline |
