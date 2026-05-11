# Configuration Guide

## First-run Configuration Flow

When `MEMORY.md` does not exist, follow these steps in order:

### Step 1 — Environment Variables

For each variable in the table below, tell the user its purpose and ask if they want to set it. If yes, write the value to `MEMORY.md`. If no, skip it (the related functionality will be unavailable).

| Key | Purpose |
|---|---|
| `KURAVIZ_TTS_ADAPTOR` | Path to a TTS adapter script (e.g. `/home/user/adaptors/tts.py`). Without this, audio synthesis is skipped. |

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
```

## Environment Variable Reference

| Variable | Required | Description |
|---|---|---|
| `KURAVIZ_TTS_ADAPTOR` | No | Path to a TTS adapter script. The script must accept `--text "..." --output path.wav`. Set to skip if no TTS is available. |

## User Preference Reference

| Field | Examples | Description |
|---|---|---|
| `language` | `Chinese`, `English`, `Japanese` | Language used for narration scripts and page content |
| `style` | `formal`, `conversational`, `tutorial` | Tone for narration writing and page design |
