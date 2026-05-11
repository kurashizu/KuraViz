# Configuration Guide

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `KURAVIZ_TTS_ADAPTOR` | No (skips TTS) | Path to the TTS adapter script (`--text "..." --output ...` interface) |

## User Preferences (stored in `MEMORY.md`)

Preferences listed below. The agent creates `MEMORY.md` on first run and reads it on subsequent runs.

| Field | Example | Description |
|---|---|---|
| `language` | `zh`, `en`, `ja` | Video narration language |
| `style` | `formal`, `conversational`, `tutorial` | Narration and page design tone |
| `voice` | `voice_1` | TTS voice ID |
| `model` | `Qwen3-TTS-12Hz-1.7B-Base-Q8_0` | TTS model name |

## MEMORY.md Format

```markdown
# KuraViz Preferences
language: zh
style: conversational
voice: voice_1
model: Qwen3-TTS-12Hz-1.7B-Base-Q8_0
```

The agent reads these values on startup to skip re-configuration.
