# Configuration Guide

## First-run Configuration Flow

When `MEMORY.md` does not exist, follow these steps in order:

### Step 1 — Environment Variables

For each variable in the table below, tell the user its purpose and ask if they want to set it. If yes, write the value to `MEMORY.md`. If no, skip it (the related functionality will be unavailable).

| Key | Purpose |
|---|---|
| `KURAVIZ_TTS_ADAPTOR` | Path to a TTS adapter script (e.g. `/home/user/adaptors/tts.py`). Without this, audio synthesis is skipped. |

The TTS adapter script must accept command-line arguments `--text "narration content" --output path.wav`.
For guidance on writing a TTS adapter, refer to `adaptors/adaptors.example.py` and and save it as `adaptors/tts.py` (set the absolute path as `KURAVIZ_TTS_ADAPTOR`).
Test the adapter by running `python adaptors/tts.py --text "Hello, world!" --output test.wav` and ensure it generates `test.wav` with the correct content.

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
KURAVIZ_TTS_ADAPTOR=/home/user/adaptors/tts.py
```
