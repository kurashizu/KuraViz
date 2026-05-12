#!/bin/bash
set -e
cd "$(dirname "$0")"

CMD="${1:-help}"
shift 2>/dev/null || true

case "$CMD" in
  dev)      docker compose run --rm --service-ports dev ;;
  build)    docker compose run --rm build ;;
  test)     docker compose run --rm test ;;
  record)   docker compose run --rm record ;;
  tts)      docker compose run --rm tts ;;
  scaffold) docker compose run --rm -v "${2:?Usage: ./kuraviz.sh scaffold /path/to/output [--name NAME]}":/output scaffold --dir /output ${@:3} ;;
  shell)    docker compose run --rm --entrypoint bash dev ;;
  *)
    echo "Usage: ./kuraviz.sh {dev|build|test|record|tts|scaffold <dir>|shell}"
    exit 1
    ;;
esac
