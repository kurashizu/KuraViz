#!/usr/bin/env python3
"""
TTS single-call adapter — generates one audio file from text.

Usage:
    python tools/tts.py --text "Hello world" --output /path/to/output.wav

This is a stub. The actual TTS engine will be plugged in later.
"""

import argparse
import sys


def main():
    parser = argparse.ArgumentParser(description='TTS single-call adapter (placeholder)')
    parser.add_argument('--text', type=str, required=True, help='Text to synthesize')
    parser.add_argument('--output', type=str, required=True, help='Output audio file path')
    parser.add_argument('--voice', type=str, default='default', help='Voice ID')
    parser.add_argument('--model', type=str, default='qwen3-tts', help='TTS model name')
    args = parser.parse_args()

    print(f'[TTS] text={args.text[:60]!r}...  output={args.output}  voice={args.voice}  model={args.model}',
          file=sys.stderr)
    print(f'[TTS] (no audio generated — placeholder)', file=sys.stderr)


if __name__ == '__main__':
    main()
