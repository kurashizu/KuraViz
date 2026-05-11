#!/usr/bin/env python3
"""
Batch TTS orchestrator — reads narration.json, calls tools/tts.py for each page.

Usage:
    python tools/generate_audio.py
    python tools/generate_audio.py --json /path/to/narration.json --output /path/to/audio

Defaults to reading public/narration.json and writing to public/audio.
"""

import argparse
import json
import os
import subprocess
import sys


def _script_dir():
    return os.path.dirname(os.path.abspath(__file__))


def _resolve_path(*parts):
    return os.path.normpath(os.path.join(_script_dir(), '..', *parts))


def main():
    default_json = _resolve_path('public', 'narration.json')
    default_output = _resolve_path('public', 'audio')

    parser = argparse.ArgumentParser(description='Batch TTS orchestrator')
    parser.add_argument('--json', type=str, default=default_json,
                        help='Narration JSON (default: %(default)s)')
    parser.add_argument('--output', type=str, default=default_output,
                        help='Output directory for audio files (default: %(default)s)')
    parser.add_argument('--voice', type=str, default='default', help='Voice ID')
    parser.add_argument('--model', type=str, default='qwen3-tts', help='TTS model name')
    parser.add_argument('--tts-script', type=str, default=_resolve_path('tools', 'tts.py'),
                        help='Path to tts.py adapter (default: %(default)s)')
    args = parser.parse_args()

    # Read narration data
    try:
        with open(args.json, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        data = json.loads(args.json)

    out_path = args.output.rstrip('/')
    os.makedirs(out_path, exist_ok=True)

    manifest = {}

    for ch_id, pages in data.items():
        ch_dir = os.path.join(out_path, ch_id)
        os.makedirs(ch_dir, exist_ok=True)
        manifest[ch_id] = {}

        for pg_id, entry in pages.items():
            script = entry.get('script', '')
            wav_path = os.path.join(ch_dir, f'{pg_id}.wav')

            print(f'[generate] {ch_id}/{pg_id} -> {wav_path}', file=sys.stderr)

            subprocess.run(
                [sys.executable, args.tts_script,
                 '--text', script,
                 '--output', wav_path,
                 '--voice', args.voice,
                 '--model', args.model],
                check=True,
            )

            manifest[ch_id][pg_id] = {
                'script': script,
                'audioSrc': f'/audio/{ch_id}/{pg_id}.wav',
                'audioDuration': 0.0,
            }

    # Write timing manifest
    manifest_path = os.path.join(out_path, '_timing.json')
    print(f'\n  manifest written to: {manifest_path}', file=sys.stderr)
    with open(manifest_path, 'w', encoding='utf-8') as f:
        json.dump(manifest, f, ensure_ascii=False, indent=2)


if __name__ == '__main__':
    main()
