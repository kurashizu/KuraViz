# Configuration Guide

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `KURAVIZ_TTS_ADAPTOR` | No (skips TTS) | Path to the TTS adapter script (`--text "..." --output ...` interface) |

## User Preferences (stored in `MEMORY.md`)

When creating or updating `MEMORY.md`, ask the user for these values:

| Field | Examples | Description |
|---|---|---|
| `language` | `Chinese`, `English`, `Japanese` | Video content and narration language |
| `style` | `formal`, `conversational`, `tutorial` | Narration and page design tone |

## MEMORY.md Format

```markdown
# KuraViz Preferences
language: Chinese
style: conversational
```

The agent reads these values on startup to skip re-configuration.
