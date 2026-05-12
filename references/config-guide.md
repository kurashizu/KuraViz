# Configuration Guide

## First-run Configuration Wizard

When `MEMORY.md` does not exist, walk through these steps conversationally. Explain each option in plain terms.

### 0. Check Prerequisites

Check for the following tools and libraries. If any are missing, explain to the user what they are and how to install them:
```bash
# Check Node.js + npm
node --version
npm --version

# Check Python
python3 --version

# Check Git
git --version

# Check ffmpeg (advise the user that vaapi support is a bonus)
ffmpeg -version

# Check pulseaudio-utils
pactl --version

# Check Xvfb
Xvfb -help
```


### 1. TTS Adapter

Explain to the user:

> A Text-to-Speech adapter turns your narration scripts into spoken audio. If you have a TTS server running, I'll need the path to a Python script that can talk to it. Without one, I'll skip audio generation and you'll have a silent slideshow.

If the user wants to set it up:
- Give them a friendly bullet list of options:
  - Tell me what TTS service you're using
  - Skip it for now (can be configured later)

When they tell you the TTS service, refer to `tools/tts.example.py` and implement it as `tts.py`.
Test it with the command: `python tts.py --text "Hello world" --output /tmp/test.wav`. If it works, save the absolute path (e.g, `/path/to/tts.py`) to `KURAVIZ_TTS_ADAPTOR`.

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
KURAVIZ_TTS_ADAPTOR=/path/to/tts.py
```

Confirm with the user that everything looks correct.
