#!/usr/bin/env python3
"""
Docker wrapper for scaffold.py — delegates to the container.
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
known, remaining = parser.parse_known_args()

target_abs = os.path.abspath(known.dir)

subprocess.run([
    'docker', 'compose', 'run', '--rm',
    '-v', f'{target_abs}:/output',
    'scaffold',
    '--dir', '/output',
] + remaining, cwd=SCAFFOLD_DIR, check=True)
