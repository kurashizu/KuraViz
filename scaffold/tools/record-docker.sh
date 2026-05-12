#!/bin/bash
set -e

SCAFFOLD_DIR="$(cd "$(dirname "$0")/.." && pwd)"
OUTPUT_DIR="$(pwd)"
OUTPUT_FILE="${1:-output.mp4}"
IMAGE="ghcr.io/kurashizu/kuraviz-recorder:latest"

echo "[record-docker] Pulling latest recorder image..."
docker pull "$IMAGE"

echo "[record-docker] Starting recording → $OUTPUT_FILE"
docker run --rm \
    --shm-size=2g \
    -v "$SCAFFOLD_DIR:/app/scaffold:ro" \
    -v "$OUTPUT_DIR:/output" \
    "$IMAGE" \
    "/output/$OUTPUT_FILE"
