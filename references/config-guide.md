# Configuration Guide

## First-run Configuration Wizard

When `MEMORY.md` does not exist, walk through these steps conversationally. Explain each option in plain terms — do not just read the table aloud.

### 1. TTS Adapter

Explain to the user:

> A Text-to-Speech adapter turns your narration scripts into spoken audio. If you have a TTS server running, I'll need the path to a Python script that can talk to it. Without one, I'll skip audio generation and you'll have a silent slideshow.

If the user wants to set it up:
- Give them a friendly bullet list of options:
  - Use the existing `tools/tts.example.py` as a starting point (copy it and fill in your API endpoint)
  - Write a custom script that accepts `--text "..." --output path.wav`
  - Skip it for now (can be configured later)

When they provide a path, validate it with a quick test: `python /path/to/tts.py --text "Test" --output /tmp/test.wav`. If it produces a valid `.wav`, save `KURAVIZ_TTS_ADAPTOR` to `MEMORY.md`.

### 2. Language

Ask naturally:

> What language should the video narration be in? This controls how I write the scripts and design the pages.

| Examples |
|---|
| `Chinese`, `English`, `Japanese` |

Save the answer to `MEMORY.md`.

### 3. Style

Ask naturally:

> What tone would you like for the narration? Formal (like a lecture), conversational (like a casual explainer), or tutorial (step-by-step)?

| Examples |
|---|
| `formal`, `conversational`, `tutorial` |

Save the answer to `MEMORY.md`.

### 4. Save

Write everything to `KuraViz/MEMORY.md`:

```markdown
# KuraViz Preferences
language: Chinese
style: conversational

# Environment Variables
KURAVIZ_TTS_ADAPTOR=/path/to/tts.py
```

Confirm with the user that everything looks correct.
