# AGENTS.md

## Project layout

- **`scaffold/`** — the actual Next.js app template. All source code lives here.
- **`tools/scaffold.py`** — copies scaffold/ to a target directory with pre-installed node_modules.
- **`tts/`**, **`tools/`**, **`references/`**, **`SKILL.md`** — project-level tooling and docs, not part of the scaffold.

To create a new project: `python tools/scaffold.py --dir /path/to/workspace --port 9999 --host 0.0.0.0`

## Commands

Run in `scaffold/`:

| Command | Purpose |
|---|---|
| `npm run dev` | Dev server at `0.0.0.0:9999` |
| `npm run build` | Build + typecheck (there is no separate typecheck script) |
| `?debug=1` | Append to URL to show chapter/page/audio/script debug overlay |
| `?debug=auto` | Auto-scan ALL pages, logs collisions to `logs/debug.log` |

If `scaffold/node_modules` is missing, run `cd scaffold && npm install`.

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
| `@/components/anim` | `<Anim type="fade-in\|slide-*\|scale-in" delay={ms}>` — auto `data-box-id` |
| `@/components/cardbox` | Card container (default/elevated/bordered) — auto `data-box-id` |
| `@/components/markdown` | Markdown renderer (LaTeX, GFM tables, task lists with Unicode ☐/☑, syntax-highlighted code blocks) |
| `@/components/markdown/mermaid` | Mermaid diagram renderer (mindmap/flowchart/sequence/class/gantt) |
| `@/components/graph` | BarChart, LineChart, Axis (via recharts) |

## Debug

- `?debug=1` — collision banner + info panel. `?debug=auto` — auto-scans all pages.
- Collision log: `logs/debug.log` after `?debug=auto`.
- Detection: three types — `OVERLAP` (siblings), `OVERFLOW` (child beyond parent), `EXCEED` (beyond canvas).
- 1px tolerance for touching edges. 0.5px tolerance for overflow/exceed checks.
- Elements <3×3px are skipped (filters KaTeX helper spans).
- `data-box-id` auto-generated on Text/Cardbox/Anim for readable collision reports.
- Content must fit containers: `overflow: hidden` everywhere, no scrollbars allowed.

## Navigation

Arrow keys ← → to navigate slides. Audio auto-advances. Wraps around at first/last slide.
