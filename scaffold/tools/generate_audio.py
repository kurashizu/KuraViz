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
import time


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

    total = sum(len(pages) for pages in data.values())
    done = 0
    t_start = time.time()

    for ch_id, pages in data.items():
        ch_dir = os.path.join(out_path, ch_id)
        os.makedirs(ch_dir, exist_ok=True)

        for pg_id, entry in pages.items():
            done += 1
            script = entry.get('script', '')
            wav_path = os.path.join(ch_dir, f'{pg_id}.wav')

            if os.path.exists(wav_path):
                print(f'[{done}/{total}] {ch_id}/{pg_id} — skipped (exists)', file=sys.stderr)
                continue

            subprocess.run(
                [sys.executable, args.tts_script,
                 '--text', script,
                 '--output', wav_path],
                check=True,
            )

            elapsed = time.time() - t_start
            print(f'[{done}/{total}] {ch_id}/{pg_id} ({elapsed:.0f}s)', file=sys.stderr)


if __name__ == '__main__':
    main()
