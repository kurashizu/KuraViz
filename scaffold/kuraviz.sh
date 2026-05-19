#!/bin/bash
set -e
cd "$(dirname "$0")"

CMD="${1:-help}"
shift 2>/dev/null || true

case "$CMD" in
  dev)    docker compose run --rm --service-ports --user $(id -u):$(id -g) dev ;;
  build)  docker compose run --rm --user $(id -u):$(id -g) build ;;
  test)   docker compose run --rm --user $(id -u):$(id -g) test ;;
  record) docker compose run --rm --user $(id -u):$(id -g) record ;;
  tts)    docker compose run --rm --user $(id -u):$(id -g) tts ;;
  shell)  docker compose run --rm --user $(id -u):$(id -g) --entrypoint bash dev ;;
  *)
    echo "Usage: ./kuraviz.sh {dev|build|test|record|tts|shell}"
    exit 1
    ;;
esac
