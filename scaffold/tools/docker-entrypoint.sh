#!/bin/bash
set -e

OUTPUT="${1:-/output/output.mp4}"

echo "[entrypoint] Starting Xvfb on :99..."
Xvfb :99 -screen 0 1920x1080x24 -ac &
sleep 1

echo "[entrypoint] Starting PulseAudio with null sink..."
pulseaudio --start \
    --exit-idle-time=-1 \
    --log-level=warn \
    --load="module-null-sink sink_name=kuraviz_sink sink_properties=device.description=KuraViz"
sleep 0.5

echo "[entrypoint] Running capture script → $OUTPUT"
exec node /app/tools/capture.mjs "$OUTPUT"
