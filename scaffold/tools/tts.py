#!/usr/bin/env python3
"""
TTS Placeholder — Audio generation for slide narration.

Usage:
    python tools/tts.py --json '{"ch01-intro":{"pg-01-title":{"script":"..."}}}' --output /path/to/audio

This is a stub. The actual TTS adapter will be implemented later.
"""

import argparse
import json
import sys


def main():
    parser = argparse.ArgumentParser(description='TTS audio generator (placeholder)')
    parser.add_argument('--json', type=str, required=True, help='Narration JSON (string or file path)')
    parser.add_argument('--output', type=str, default='./public/audio', help='Output directory for audio files')
    parser.add_argument('--voice', type=str, default='default', help='Voice ID')
    parser.add_argument('--model', type=str, default='qwen3-tts', help='TTS model name')
    args = parser.parse_args()

    # Try parse as file path first, then as raw JSON string
    try:
        with open(args.json, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        data = json.loads(args.json)

    print(f'[TTS Placeholder] args received:', file=sys.stderr)
    print(f'  json keys: {list(data.keys())}', file=sys.stderr)
    print(f'  output:    {args.output}', file=sys.stderr)
    print(f'  voice:     {args.voice}', file=sys.stderr)
    print(f'  model:     {args.model}', file=sys.stderr)
    print(f'  (no audio generated — this is a placeholder)', file=sys.stderr)

    # Output a timing manifest for reference
    manifest = {}
    for ch_id, pages in data.items():
        manifest[ch_id] = {}
        for pg_id, entry in pages.items():
            manifest[ch_id][pg_id] = {
                'script': entry.get('script', ''),
                'audioSrc': f'/audio/{ch_id}/{pg_id}.wav',
                'audioDuration': 0.0,
            }

    # Write manifest
    out_path = args.output.rstrip('/')
    manifest_path = f'{out_path}/_timing.json'
    print(f'\n  manifest written to: {manifest_path}', file=sys.stderr)
    with open(manifest_path, 'w', encoding='utf-8') as f:
        json.dump(manifest, f, ensure_ascii=False, indent=2)


if __name__ == '__main__':
    main()
