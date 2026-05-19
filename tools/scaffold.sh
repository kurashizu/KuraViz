#!/bin/bash
set -e
cd "$(dirname "$0")/../scaffold"
docker compose run --rm --user $(id -u):$(id -g) -v "${1:?Usage: ./tools/scaffold.sh /path/to/output}":/output scaffold
