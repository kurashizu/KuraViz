# Configuration Guide

## First-run Configuration Wizard

When `MEMORY.md` does not exist, walk through these steps conversationally. Explain each option in plain terms.

### 0. Check Prerequisites

Only Docker with Compose is required:

```bash
docker compose version
```

If Docker is missing, tell the user:
- **macOS/Windows**: Install [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- **Linux**: Install `docker-ce` + `docker-compose-plugin`

Everything else (Node.js, Python, Playwright Firefox, FFmpeg, Xvfb, PulseAudio) runs inside the container — no host installation needed.


### 1. TTS Adapter

Explain to the user:

> A Text-to-Speech adapter turns your narration scripts into spoken audio. If you have a TTS server running, I'll need the path to a Python script that can talk to it. Without one, I'll skip audio generation and you'll have a silent slideshow.

If the user wants to set it up:
- Give them a friendly bullet list of options:
  - Tell me what TTS service you're using
  - Skip it for now (can be configured later)

When they tell you the TTS service, create an adapter script at `scaffold/tools/tts.py` based on `tools/tts.example.py`.
Test it inside Docker: `docker compose run --rm tts`. If it works, save the path as `KURAVIZ_TTS_ADAPTOR=/app/scaffold/tools/tts.py`.

### 2. Language

Ask naturally:

> What language should the video narration be in? This controls how I write the scripts and design the pages.

| Examples |
|---|
| `Chinese`, `English`, `Japanese` |

### 3. Style

Ask naturally:

> What tone would you like for the narration? Formal (like a lecture), conversational (like a casual explainer), or tutorial (step-by-step)?

| Examples |
|---|
| `formal`, `conversational`, `tutorial` |

### 4. Save

Write everything to `MEMORY.md`:

```markdown
# KuraViz Preferences
language: Chinese
style: conversational

# Environment Variables
KURAVIZ_TTS_ADAPTOR=/app/scaffold/tools/tts.py
```

Confirm with the user that everything looks correct.
