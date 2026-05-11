#!/usr/bin/env python3
"""
TTS adapter template.

Copy this file to your own adapter (e.g., tts.myengine.py) and implement
the --text / --output interface. Point KURAVIZ_TTS_ADAPTOR env var at it.

Usage:
    export KURAVIZ_TTS_ADAPTOR=/path/to/tts.myengine.py
    python tools/generate_audio.py
"""

import argparse
import os


def main():
    parser = argparse.ArgumentParser(description="TTS adapter")
    parser.add_argument("--text", type=str, required=True, help="Text to synthesize")
    parser.add_argument("--output", type=str, required=True, help="Output audio file path")
    args = parser.parse_args()

    os.makedirs(os.path.dirname(args.output), exist_ok=True)

    # TODO: Replace with real TTS engine call
    with open(args.output, "wb") as f:
        f.write(b"")
    print(f"[TTS] generated {args.output}")


if __name__ == "__main__":
    main()
