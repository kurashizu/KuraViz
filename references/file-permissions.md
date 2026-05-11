# File Permissions

Permission levels for agent file access:

| Path | Read | Write | Notes |
|---|---|---|---|
| `scaffold/content/chapters/` | ✅ | ✅ | Create/edit page components (`pg-*.tsx`) and chapter `index.ts` |
| `scaffold/public/narration.json` | ✅ | ✅ | Narration scripts and audio source paths |
| `references/` | ✅ | ❌ | Component API, design guide, collision prevention — reference only |
| `scaffold/components/` | ✅ | ❌ | Slide primitives — read to understand API, never modify |
| `scaffold/lib/` | ✅ | ❌ | Utilities and types — read only |
| `scaffold/theme.ts` | ✅ | ❌ | Colors, typography, canvas config — reference only |
| `scaffold/public/audio/` | ❌ | ❌ | Generated audio files; see `tools/generate_audio.py` |
| `scaffold/tools/` | ❌ | ❌ | Run scripts from here but do not read or modify |
| `scaffold/app/` | ❌ | ❌ | Next.js app router — do not touch |
| `scaffold/package.json` | ❌ | ❌ | Do not modify |
| `scaffold/tsconfig.json` | ❌ | ❌ | Do not modify |
| `tools/` | ❌ | ❌ | Project-level tools — do not read or modify |
| `tts/` | ❌ | ❌ | TTS configuration — do not modify |
| `AGENTS.md` | ❌ | ❌ | Agent configuration |
| `SKILL.md` | ❌ | ❌ | Skill definition |
| `README.md` | ❌ | ❌ | Project readme |
