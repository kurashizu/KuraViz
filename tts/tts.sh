#!/usr/bin/env bash
TEXT=""
OUTPUT="output.wav"

while [[ $# -gt 0 ]]; do
  case $1 in
    --text) TEXT="$2"; shift 2 ;;
    --output) OUTPUT="$2"; shift 2 ;;
    *) shift ;;
  esac
done

jq -n \
  --arg input "$TEXT" \
  --arg voice "voice_1" \
  --arg model "Qwen3-TTS-12Hz-1.7B-Base-Q8_0" \
  --arg lang "zh" \
  '{
    input: $input,
    voice: $voice,
    model: $model,
    language: $lang
  }' | \
curl -X POST http://10.0.0.20:11400/v1/audio/speech \
  -H "Content-Type: application/json" \
  --data @- \
  --output "$OUTPUT"
