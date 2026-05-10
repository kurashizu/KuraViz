#!/usr/bin/env python3
"""
Scaffold tool — copies the web-video scaffold template to a target directory.

Usage:
    python tools/scaffold.py --dir /path/to/workspace
    python tools/scaffold.py --dir /path/to/workspace --name my-project
    python tools/scaffold.py --dir /path/to/workspace --no-install
    python tools/scaffold.py --dir /path/to/workspace --force
"""

import argparse
import json
import os
import shutil
import subprocess
import sys

SCAFFOLD_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'scaffold')

IGNORE_PATTERNS = shutil.ignore_patterns('node_modules', '.next', '.gitignore')


def main():
    parser = argparse.ArgumentParser(description='Copy scaffold template to target directory')
    parser.add_argument('--dir', type=str, required=True, help='Target workspace directory')
    parser.add_argument('--name', type=str, default='scaffold', help='Output folder name (default: scaffold)')
    parser.add_argument('--no-install', action='store_true', help='Skip npm install')
    parser.add_argument('--force', action='store_true', help='Overwrite existing directory')
    args = parser.parse_args()

    target = os.path.abspath(os.path.join(args.dir, args.name))

    # Validate
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

    # Copy
    os.makedirs(os.path.dirname(target), exist_ok=True)
    shutil.copytree(SCAFFOLD_DIR, target, ignore=IGNORE_PATTERNS)
    print(f'  [OK] Copied scaffold → {target}')

    # Create .env.local from .env.example
    env_example = os.path.join(target, '.env.example')
    env_local = os.path.join(target, '.env.local')
    if os.path.exists(env_example) and not os.path.exists(env_local):
        shutil.copy2(env_example, env_local)
        print(f'  [OK] Created .env.local from .env.example')

    # Check node
    node_ok = False
    try:
        result = subprocess.run(['node', '--version'], capture_output=True, text=True, timeout=10)
        if result.returncode == 0:
            print(f'  [OK] Node {result.stdout.strip()}')
            node_ok = True
        else:
            print(f'  [WARN] Node not found — skipping npm install')
    except FileNotFoundError:
        print(f'  [WARN] Node not found — skipping npm install')

    # npm install
    if not args.no_install and node_ok:
        print(f'  [..] Running npm install...')
        result = subprocess.run(
            ['npm', 'install'],
            cwd=target,
            capture_output=True,
            text=True,
            timeout=120,
        )
        if result.returncode == 0:
            print(f'  [OK] npm install completed')
        else:
            print(f'  [WARN] npm install had issues:')
            for line in result.stderr.strip().split('\n')[-5:]:
                print(f'        {line}')

    # Summary
    print(f'\n  ── Done ──')
    print(f'  cd {target}')
    print(f'  npm run dev')


if __name__ == '__main__':
    main()
