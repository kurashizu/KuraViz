#!/usr/bin/env python3
"""
Scaffold tool — pre-installs dependencies and copies the web-video scaffold template.

Usage:
    python tools/scaffold.py --dir /path/to/workspace
    python tools/scaffold.py --dir /path/to/workspace --name my-project --port 9999 --host 0.0.0.0
    python tools/scaffold.py --dir /path/to/workspace --force
"""

import argparse
import os
import shutil
import subprocess
import sys

SCAFFOLD_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'scaffold')
DEFAULT_PORT = '9999'
DEFAULT_HOST = '0.0.0.0'

IGNORE_PATTERNS = shutil.ignore_patterns('.next', '.gitignore')


def ensure_deps():
    nm = os.path.join(SCAFFOLD_DIR, 'node_modules')
    if os.path.isdir(nm):
        print(f'  [OK] Dependencies already installed in scaffold/')
        return True
    print(f'  [..] Installing dependencies in scaffold/...')
    try:
        subprocess.run(['node', '--version'], capture_output=True, check=True)
    except (subprocess.CalledProcessError, FileNotFoundError):
        print(f'  [Error] Node.js not found. Install Node.js first.', file=sys.stderr)
        sys.exit(1)
    result = subprocess.run(['npm', 'install'], cwd=SCAFFOLD_DIR, capture_output=True, text=True, timeout=180)
    if result.returncode == 0:
        print(f'  [OK] npm install completed in scaffold/')
        return True
    print(f'  [Error] npm install failed in scaffold/:', file=sys.stderr)
    for line in result.stderr.strip().split('\n')[-5:]:
        print(f'    {line}', file=sys.stderr)
    sys.exit(1)


def write_env(target: str, port: str, host: str):
    """Write .env with server config."""
    env_path = os.path.join(target, '.env')
    with open(env_path, 'w') as f:
        f.write(f'PORT={port}\n')
        f.write(f'HOSTNAME={host}\n')


def main():
    parser = argparse.ArgumentParser(description='Copy scaffold template to target directory')
    parser.add_argument('--dir', type=str, required=True, help='Target workspace directory')
    parser.add_argument('--name', type=str, default='scaffold', help='Output folder name')
    parser.add_argument('--port', type=str, default=DEFAULT_PORT, help='Dev server port (default: 9999)')
    parser.add_argument('--host', type=str, default=DEFAULT_HOST, help='Dev server host (default: 0.0.0.0)')
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

    ensure_deps()

    os.makedirs(os.path.dirname(target), exist_ok=True)
    shutil.copytree(SCAFFOLD_DIR, target, ignore=IGNORE_PATTERNS, symlinks=True)
    print(f'  [OK] Copied scaffold → {target}')

    write_env(target, args.port, args.host)
    print(f'  [OK] Server: {args.host}:{args.port}')

    print(f'\n  ── Done ──')
    print(f'  cd {target}')
    print(f'  npm run dev')


if __name__ == '__main__':
    main()
