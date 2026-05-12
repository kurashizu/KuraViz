# Configuration Guide

## First-run Configuration Flow

When `MEMORY.md` does not exist, follow these steps in order:

### Step 1 — Environment Variables

For each variable in the table below, tell the user its purpose and ask if they want to set it. If yes, write the value to `MEMORY.md`. If no, skip it (the related functionality will be unavailable).

| Key | Purpose |
|---|---|
| `KURAVIZ_TTS_ADAPTOR` | Path to a TTS adapter script (e.g. `/path/to/tts.py`). Without this, audio synthesis is skipped. |

Please refer to `tools/tts.example.py` and save it as a separate file (e.g. `tts.py`) in your preferred directory, then set `KURAVIZ_TTS_ADAPTOR` to its absolute path.

Test the adapter by running `python /path/to/tts.py --text "Hello, world!" --output test.wav` and ensure it generates `test.wav` with the correct content.

### Step 2 — User Preferences

Ask the user for each of these and write to `MEMORY.md`:

| Key | Examples | Description |
|---|---|---|
| `language` | `Chinese`, `English`, `Japanese` | Language used for narration scripts and page content |
| `style` | `formal`, `conversational`, `tutorial` | Tone for narration writing and page design |

### Step 3 — Save

Write all collected values to `KuraViz/MEMORY.md` in the following format:

```markdown
# KuraViz Preferences
language: Chinese
style: conversational

# Environment Variables
KURAVIZ_TTS_ADAPTOR=/path/to/tts.py
```
