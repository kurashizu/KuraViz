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
- **Playwright Chromium** — install after `npm install` in scaffold:
  ```bash
  cd scaffold && npx playwright install chromium
  ```

## Overview

Build PPT-style videos as narrated HTML slides. Each slide is a React component in a 1920×1080 canvas; audio playback drives auto-advance.

## Core Constraints

- **File access**: After running `tools/scaffold.py --dir /path/to/workspace`, you can only modify files in `scaffold/content/*` and `scaffold/public/narration.json`. Do not read or modify any other scaffold files. Do not read or modify any tool files.
- **Theme**: `scaffold/components/theme.ts` is read-only — reference it for colors/typography/canvas config.

## Workflow

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

**STOP HERE AND ASK USER TO APPROVE THE OUTLINE AND NARRATION BEFORE PROCEEDING.**

### 3. Page Creation

Split chapters evenly across **2 subagents** for parallel development. Each subagent reads the same reference files independently and follows the same process:

- `WORKSPACE/sources/` — research content
- `WORKSPACE/outline.md` — relevant chapters
- `WORKSPACE/scaffold/public/narration.json` — scripts (read-only)
- `references/page-creation.md`, `references/design-guide.md`, `references/components.md`
- `references/collision-prevention.md` — read before setting any `h`

Each subagent, for each of its chapters:
1. Creates pages as `pg-NN-name.tsx` in `content/chapters/chXX-name/`.
2. Registers each page in the chapter's `index.ts`.

### 4. Collision Testing & Fixing

1. Run `node tools/test-collisions.mjs` from `scaffold/`, no need to run `npm run build` as this script will build and test in one step.
2. Read the output to find which pages have issues, then fix them using `references/collision-prevention.md`.
3. Repeat until no collisions remain.

**STOP HERE AND ASK USER TO APPROVE THE PAGES BEFORE PROCEEDING.**

### 5. Audio Generation (Yet to be implemented)

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
