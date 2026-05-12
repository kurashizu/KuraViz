#!/usr/bin/env python3
"""
Docker wrapper for scaffold.py — delegates to the container, then pre-pulls the image.
Zero host dependencies beyond Docker.

Usage:
    python tools/scaffold.py --dir /path/to/workspace
    python tools/scaffold.py --dir /path/to/workspace --name my-project --force
"""

import argparse
import os
import subprocess
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SCAFFOLD_DIR = os.path.join(REPO, 'scaffold')

parser = argparse.ArgumentParser(add_help=False)
parser.add_argument('--dir', type=str, required=True)
parser.add_argument('--name', type=str, default='scaffold')
known, remaining = parser.parse_known_args()

target_abs = os.path.abspath(known.dir)
project_dir = os.path.join(target_abs, known.name)

# Step 1: run scaffold inside Docker
subprocess.run([
    'docker', 'compose', 'run', '--rm',
    '-v', f'{target_abs}:/output',
    'scaffold',
    '--dir', '/output',
    '--name', known.name,
] + remaining, cwd=SCAFFOLD_DIR, check=True)

# Step 2: pre-pull the recorder image so the first command is instant
print(f'\n  Pre-pulling recorder image...')
result = subprocess.run(
    ['docker', 'compose', 'pull'],
    cwd=project_dir,
    capture_output=True, text=True,
)
if result.returncode == 0:
    print(f'  [OK] Image cached — ready to use')
else:
    print(f'  [Warn] Pull failed (no network?) — image will be pulled on first use')
    print(f'         {result.stderr.strip()[-120:]}')
