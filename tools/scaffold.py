#!/usr/bin/env python3
"""
Scaffold tool — pre-installs dependencies and copies the web-video scaffold template.

Usage:
    python tools/scaffold.py --dir /path/to/workspace
    python tools/scaffold.py --dir /path/to/workspace --name my-project
    python tools/scaffold.py --dir /path/to/workspace --force
"""

import argparse
import os
import shutil
import subprocess
import sys

SCAFFOLD_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'scaffold')

IGNORE_PATTERNS = shutil.ignore_patterns('.next', '.gitignore')


def ensure_deps():
    """Run npm install in scaffold/ if node_modules is missing."""
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
    result = subprocess.run(
        ['npm', 'install'],
        cwd=SCAFFOLD_DIR,
        capture_output=True,
        text=True,
        timeout=180,
    )
    if result.returncode == 0:
        print(f'  [OK] npm install completed in scaffold/')
        return True
    print(f'  [Error] npm install failed in scaffold/:', file=sys.stderr)
    for line in result.stderr.strip().split('\n')[-5:]:
        print(f'    {line}', file=sys.stderr)
    sys.exit(1)


def main():
    parser = argparse.ArgumentParser(description='Copy scaffold template to target directory')
    parser.add_argument('--dir', type=str, required=True, help='Target workspace directory')
    parser.add_argument('--name', type=str, default='scaffold', help='Output folder name')
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

    # Pre-install deps in source scaffold/
    ensure_deps()

    # Copy (includes pre-installed node_modules, preserve symlinks for .bin entries)
    os.makedirs(os.path.dirname(target), exist_ok=True)
    shutil.copytree(SCAFFOLD_DIR, target, ignore=IGNORE_PATTERNS, symlinks=True)
    print(f'  [OK] Copied scaffold → {target}')

    # Create .env.local from .env.example if not present
    env_example = os.path.join(target, '.env.example')
    env_local = os.path.join(target, '.env.local')
    if os.path.exists(env_example) and not os.path.exists(env_local):
        shutil.copy2(env_example, env_local)
        print(f'  [OK] Created .env.local from .env.example')

    print(f'\n  ── Done ──')
    print(f'  cd {target}')
    print(f'  npm run dev')


if __name__ == '__main__':
    main()
