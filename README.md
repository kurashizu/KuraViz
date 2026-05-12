# KuraViz

Build PPT-style videos from HTML slides. Write React components on a 1920×1080 canvas, pair them with narration scripts, auto-generate audio via TTS, and record a video — all without a video editor.

## Usage

```bash
npx skills add kurashizu/KuraViz
```

Then ask your agent: *"Use KuraViz Skill, make a tutorial video about [a blog post / news article / any topic]".*

## How It Works

1. **Write slides** — each page is a `.tsx` component with absolute-positioned text, cards, markdown, charts, or diagrams
2. **Add scripts** — pair each slide with a voiceover script in `narration.json`
3. **Generate audio** — TTS pipeline turns scripts into `.wav` files
4. **Record video** — automatic playback captured via Firefox + FFmpeg into an MP4

## Commands

## Project Structure

```
├── scaffold/            # Next.js app template
│   ├── content/chapters/# Slide page components
│   ├── components/      # Slide primitives (Text, Cardbox, Anim, …)
│   ├── lib/             # Utilities, types, collision detection
│   └── public/          # narration.json, audio/
├── references/          # Design guide, component API, rules
└── tools/               # Scaffold generator, capture, TTS template
```

## Usage

| Command | What it does |
|---|---|
| `python tools/scaffold.py --dir /path/to/project` | Create a new project |
| `cd scaffold && npm run dev` | Start dev server at `0.0.0.0:9999` |
| `cd scaffold && python tools/generate_audio.py` | Generate TTS audio (needs `KURAVIZ_TTS_ADAPTOR`) |
| `cd scaffold && node tools/capture.mjs output.mp4` | Record video via Firefox |
| `cd scaffold && node tools/test-collisions.mjs` | Detect layout collisions |

Append `?debug=1`, `?debug=auto`, or `?record=1` to the URL during development.

## License

MIT
