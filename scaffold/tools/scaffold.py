#!/usr/bin/env python3
"""
Scaffold tool — copies the web-video scaffold template to a target directory.

Usage (inside Docker):
    python3 tools/scaffold.py --dir /output --name scaffold
    python3 tools/scaffold.py --dir /output --name my-project --port 8080 --host 127.0.0.1 --force
"""

import argparse
import json
import os
import shutil
import sys

IS_CONTAINER = os.environ.get('IS_CONTAINER') == '1'

SCAFFOLD_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) \
    if not IS_CONTAINER else '/app/scaffold'

DEFAULT_PORT = 9999
DEFAULT_HOST = '0.0.0.0'

IGNORE_PATTERNS = shutil.ignore_patterns(
    '.next',
    '.gitignore',
    'node_modules',
    'output',
)


def inject_server_config(target: str, port: int, host: str):
    pkg_path = os.path.join(target, 'package.json')
    with open(pkg_path, 'r') as f:
        pkg = json.load(f)

    pkg['scripts']['start'] = f'next start -p {port} -H {host}'

    with open(pkg_path, 'w') as f:
        json.dump(pkg, f, indent=2)
        f.write('\n')
    print(f'  [OK] Server: {host}:{port}')


def main():
    parser = argparse.ArgumentParser(description='Copy scaffold template to target directory')
    parser.add_argument('--dir', type=str, required=True, help='Target workspace directory')
    parser.add_argument('--name', type=str, default='scaffold', help='Output folder name')
    parser.add_argument('--port', type=int, default=DEFAULT_PORT, help='Dev server port')
    parser.add_argument('--host', type=str, default=DEFAULT_HOST, help='Dev server host')
    parser.add_argument('--force', action='store_true', help='Overwrite existing directory')
    args = parser.parse_args()

    target = os.path.abspath(os.path.join(args.dir, args.name))

    if not os.path.exists(SCAFFOLD_DIR):
        print(f'[Error] Scaffold source not found: {SCAFFOLD_DIR}', file=sys.stderr)
        sys.exit(1)

    if os.path.exists(target):
        if args.force:
            shutil.rmtree(target)
            print(f'  [OK] Removed existing: {target}')
        else:
            print(f'[Error] Target already exists: {target}', file=sys.stderr)
            print(f'  Use --force to overwrite.', file=sys.stderr)
            sys.exit(1)

    os.makedirs(os.path.dirname(target), exist_ok=True)
    shutil.copytree(SCAFFOLD_DIR, target, ignore=IGNORE_PATTERNS, symlinks=True)
    print(f'  [OK] Copied scaffold -> {target}')

    inject_server_config(target, args.port, args.host)

    print()
    print(f'  -- Done --')
    print(f'  cd {target}')
    print(f'  ./kuraviz.sh dev')


if __name__ == '__main__':
    main()
