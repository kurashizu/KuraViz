#!/bin/bash
set -e
cd "$(dirname "$0")/../scaffold"
docker compose run --rm -v "${1:?Usage: ./tools/scaffold.sh /path/to/output}":/output scaffold --dir /output ${@:2}
