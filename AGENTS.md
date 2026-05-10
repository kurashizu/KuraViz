# AGENTS.md

## Project layout

- **`scaffold/`** — the actual Next.js app template. All source code lives here.
- **`tools/scaffold.py`** — copies scaffold/ to a target directory with pre-installed node_modules.
- **`tts/`**, **`tools/`**, **`references/`**, **`SKILL.md`** — project-level tooling and docs, not part of the scaffold.

To create a new project: `python tools/scaffold.py --dir /path/to/workspace`

## Commands

Run in `scaffold/`:

| Command | Purpose |
|---|---|
| `npm run dev` | Dev server at `0.0.0.0:9999` |
| `npm run build` | Build + typecheck (there is no separate typecheck script) |
| `?debug=1` | Append to URL to show chapter/page/audio/script debug overlay |

If `scaffold/node_modules` is missing, run `cd scaffold && npm install`.

## Architecture rules (agent must not violate)

- **Canvas**: 1920×1080, defined in `components/theme.ts` as `canvas`. Do not change.
- **Colors**: Only `components/theme.ts` `colors.*`. No hardcoded hex anywhere.
- **Text**: `<Text variant="h1|h2|h3|body|caption|code">` only. No raw `<h1>`, `<p>`, etc.
- **Animation**: `<Anim type="fade-in|slide-*|scale-in" delay={ms}>`. No direct framer-motion.
- **Layout**: Box absolute positioning (`x`/`y`/`w`/`h`). No flex/grid at page level.
- **Pages**: `content/chapters/{ch}/pg-NN-{name}.tsx`, default-exported component. Two-digit prefix.
- **Registration**: Every page must be listed in its chapter's `content/chapters/{ch}/index.ts`.
- **Narration**: Every page needs an entry in `public/narration.json` with `script` field.
- **Audio**: Place at `public/audio/{chId}/{pageId}.wav`. Auto-plays and advances on end.
- **Imports**: Use `@/*` path alias (maps to scaffold root).
- **Styling**: No Tailwind. All styles are inline via `boxStyle()` from `lib/utils.ts`.

## Component reference

See `references/components.md` for component APIs. Key path: `@/components/{text|anim|markdown|graph|cardbox|image|svg}`.

## Navigation

Arrow keys ← → to navigate slides. Audio auto-advances. Wraps around at first/last slide.

## TTS

`scaffold/tools/tts.py` is a placeholder stub. Real TTS adapter TBD.
