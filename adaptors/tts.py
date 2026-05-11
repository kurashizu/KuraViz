#!/usr/bin/env python3
"""
TTS single-call adapter — generates one audio file from text.

Usage:
    python tools/tts.py --text "Hello world" --output /path/to/output.wav
"""

import argparse
import json
import os
import sys
import urllib.request

TTS_ENDPOINT = "http://10.0.0.20:11400/v1/audio/speech"


def main():
    parser = argparse.ArgumentParser(description="TTS single-call adapter")
    parser.add_argument("--text", type=str, required=True, help="Text to synthesize")
    parser.add_argument(
        "--output", type=str, required=True, help="Output audio file path"
    )
    args = parser.parse_args()

    payload = json.dumps(
        {
            "input": args.text,
            "voice": "voice_1",
            "model": "Qwen3-TTS-12Hz-1.7B-Base-Q8_0",
            "language": "zh",
        }
    ).encode()

    req = urllib.request.Request(
        TTS_ENDPOINT, data=payload, headers={"Content-Type": "application/json"}
    )

    os.makedirs(os.path.dirname(args.output), exist_ok=True)

    with urllib.request.urlopen(req) as resp:
        with open(args.output, "wb") as f:
            f.write(resp.read())

    print(f"[TTS] generated {args.output}", file=sys.stderr)


if __name__ == "__main__":
    main()
