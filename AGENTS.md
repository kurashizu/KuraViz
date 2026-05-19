# AGENTS.md

## Project layout

- **`scaffold/`** — the actual Next.js app template. All source code lives here.
- **`tools/tts.example.py`** — TTS adapter template. Copy and modify, then point `KURAVIZ_TTS_ADAPTOR` env var at it.

To create a new project: `./tools/scaffold.sh /path/to/workspace` from repo root.

## Commands

Run in `scaffold/`. All commands run inside Docker — no host dependencies beyond Docker with Compose (v2 plugin).

| Command | Purpose |
|---|---|
| `./tools/scaffold.sh <dir>` | Create a new project from template (or `.\tools\scaffold.ps1 <dir>` on Windows) |
| `./kuraviz.sh dev` | Dev server at `http://localhost:9999` (or `.\kuraviz.ps1 dev` on Windows) |
| `./kuraviz.sh build` | Build + typecheck (there is no separate typecheck script) |
| `./kuraviz.sh test` | Auto-scan ALL pages for collisions, logs to `logs/debug.log` (requires prior build) |
| `./kuraviz.sh record` | Record video via Firefox + FFmpeg → `output/output.mp4` (requires prior build) |
| `./kuraviz.sh tts` | Batch TTS: reads `public/narration.json`, outputs `.wav` to `public/audio/` |
| `./kuraviz.sh shell` | Open bash shell inside the container |
| `npm run dev` | Same as `kuraviz.sh dev` (thin wrapper) |
| `npm run build` | Same as `kuraviz.sh build` |
| `npm run test` | Same as `kuraviz.sh test` |
| `npm run record` | Same as `kuraviz.sh record` |
| `npm run tts` | Same as `kuraviz.sh tts` |
| `?debug=1` | Show chapter/page/audio/script debug overlay |
| `?debug=auto` | Auto-scan all pages, logs collisions to `logs/debug.log` |
| `?record=1` | Recording mode: auto-plays from page 1, logs `[record] ch/pg` progress

The Docker image is pre-pulled during `kuraviz.sh scaffold`. Set `KURAVIZ_TTS_ADAPTOR` env var to enable TTS.

## Architecture rules (agent must not violate)

- **Canvas**: 1920×1080, defined in `components/theme.ts` as `canvas`. Do not change.
- **Colors**: Only `components/theme.ts` `colors.*`. No hardcoded hex anywhere.
- **Text**: `<Text variant="h1|h2|h3|body|caption|citation|code|watermark">` only. No raw `<h1>`, `<p>`, etc.
- **Animation**: `<Anim type="fade-in|slide-*|scale-in" delay={ms}>`. No direct framer-motion.
- **Layout**: Box absolute positioning (`x`/`y`/`w`/`h`). No flex/grid at page level.
- **Pages**: `content/chapters/{ch}/pg-NN-{name}.tsx`, default-exported component. Two-digit prefix.
- **Registration**: Every page must be listed in its chapter's `content/chapters/{ch}/index.ts`.
- **Narration**: Every page needs an entry in `public/narration.json` with `script` field.
- **Imports**: Use `@/*` path alias (maps to scaffold root).
- **Styling**: No Tailwind. All styles are inline via `boxStyle()` from `lib/bbox.ts`.
- **Box `h`**: Must be ≥ text line box. Font metrics: h1=72px(86), h2=54px(70), h3=42px(59), body=30px(48), caption=22px(33), citation=22px(33). For bordered Cardbox, subtract 2×border px from effective h.
- **Mermaid container**: `w` and `h` must both be ≥ 540px. Font sizes set in `initialize()` — do NOT override post-render.
- **Bordered cardbox**: Text inside must have `w ≤ cardbox_w - 4` (2px border each side).

## Component reference

| Path | Purpose |
|---|---|
| `@/components/text` | `<Text variant="h1\|h2\|h3\|body\|caption\|citation\|code\|watermark">` — auto `data-box-id` |
| `@/components/anim` | `<Anim type="fade-in\|slide-*\|scale-in" delay={ms}>` — auto `data-box-id` (prefix `wrapper-`, e.g. `wrapper-1`) |
| `@/components/cardbox` | Card container (default/elevated/bordered) — auto `data-box-id` |
| `@/components/markdown` | Markdown renderer (LaTeX, GFM tables, task lists with Unicode ☐/☑, syntax-highlighted code blocks) |
| `@/components/markdown/mermaid` | Mermaid diagram renderer (mindmap/flowchart/sequence/class/gantt) |
| `@/components/graph` | BarChart, LineChart, Axis (via recharts) |

## Reference docs

Located in `references/`:

| Path | Purpose |
|---|---|
| `references/config-guide.md` | Environment variables and user preferences |
| `references/components.md` | All component APIs |
| `references/page-creation.md` | Page creation workflow |
| `references/narration-system.md` | Narration JSON schema |
| `references/design-guide.md` | Visual design rules, layout templates |
| `references/collision-prevention.md` | Font metrics, box sizing, debug workflow |
| `references/outline-example.md` | Example chapter outline |

## Debug

- `?debug=1` — collision banner + info panel. `?debug=auto` — auto-scans all pages.
- Collision log: `logs/debug.log` after `?debug=auto`.
- Detection: four types — `OVERLAP` (siblings), `OVERFLOW` (child beyond parent), `CONTENT_OVERFLOW` (content hidden by `overflow:hidden`), `EXCEED` (beyond canvas).
- 1px tolerance for touching edges. 0.5px tolerance for overflow/exceed checks.
- Elements <3×3px are skipped (filters KaTeX helper spans).
- `data-box-id` auto-generated on Text/Cardbox/Anim for readable collision reports.
- Content must fit containers: `overflow: hidden` everywhere, no scrollbars allowed.

## Navigation

Arrow keys ← → to navigate slides. Audio auto-advances. Stops at last slide (no wrap-around).
