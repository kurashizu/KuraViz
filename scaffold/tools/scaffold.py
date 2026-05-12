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
DEFAULT_IMAGE = 'ghcr.io/kurashizu/kuraviz-recorder:latest'

IGNORE_PATTERNS = shutil.ignore_patterns(
    '.next',
    '.gitignore',
    'node_modules',
    'output',
    'docker-compose.yml',
    'scaffold.py',
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


def write_compose(target: str, image: str):
    """Write a docker-compose.yml for the workspace that uses the pre-built image."""
    compose = {
        'services': {
            'dev': {
                'image': image,
                'ports': ['9999:9999'],
                'volumes': ['.:/app/scaffold'],
                'working_dir': '/app/scaffold',
                'command': 'npx next dev -H 0.0.0.0 -p 9999',
            },
            'build': {
                'image': image,
                'volumes': ['.:/app/scaffold'],
                'working_dir': '/app/scaffold',
                'command': 'npx next build',
            },
            'test': {
                'image': image,
                'volumes': ['.:/app/scaffold'],
                'command': 'node /app/tools/test-collisions.mjs',
                'shm_size': '2gb',
            },
            'record': {
                'image': image,
                'volumes': ['.:/app/scaffold:ro', './output:/output'],
                'entrypoint': '/entrypoint.sh',
                'command': '/output/output.mp4',
                'shm_size': '2gb',
            },
            'tts': {
                'image': image,
                'volumes': ['.:/app/scaffold'],
                'working_dir': '/app/scaffold',
                'command': 'python3 tools/generate_audio.py',
                'environment': ['KURAVIZ_TTS_ADAPTOR'],
            },
        }
    }

    import yaml
    # Prefer using yaml if available, otherwise write minimal yaml manually
    try:
        with open(os.path.join(target, 'docker-compose.yml'), 'w') as f:
            yaml.dump(compose, f, default_flow_style=False, sort_keys=False)
    except ImportError:
        _write_compose_plain(os.path.join(target, 'docker-compose.yml'), compose)

    print(f'  [OK] docker-compose.yml (image: {image})')


def _write_compose_plain(path: str, compose: dict):
    """Fallback yaml writer — no PyYAML dependency."""
    lines = ['services:']
    for name, cfg in compose['services'].items():
        lines.append(f'  {name}:')
        for key, val in cfg.items():
            if isinstance(val, list):
                lines.append(f'    {key}:')
                for item in val:
                    lines.append(f'      - {item}')
            else:
                lines.append(f'    {key}: {val}')
    lines.append('')
    with open(path, 'w') as f:
        f.write('\n'.join(lines))


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
    write_compose(target, DEFAULT_IMAGE)

    print()
    print(f'  -- Done --')
    print(f'  cd {target}')
    print(f'  ./kuraviz.sh dev')


if __name__ == '__main__':
    main()
