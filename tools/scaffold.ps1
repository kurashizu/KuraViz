#!/usr/bin/env pwsh
$ErrorActionPreference = "Stop"
if ($args.Count -eq 0) { Write-Host "Usage: .\tools\scaffold.ps1 C:\path\to\output"; exit 1 }
Set-Location "$PSScriptRoot/../scaffold"
docker compose run --rm -v "$($args[0]):/output" scaffold
