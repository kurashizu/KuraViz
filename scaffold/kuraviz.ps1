#!/usr/bin/env pwsh
<#
.SYNOPSIS
    KuraViz unified CLI for Windows (PowerShell)
.DESCRIPTION
    Run all KuraViz operations inside Docker. No host dependencies.
.EXAMPLE
    .\kuraviz.ps1 dev
    .\kuraviz.ps1 build
    .\kuraviz.ps1 test
    .\kuraviz.ps1 record
    .\kuraviz.ps1 tts
    .\kuraviz.ps1 shell
#>

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

$cmd = if ($args.Count -gt 0) { $args[0] } else { "help" }
$rest = if ($args.Count -gt 1) { $args[1..($args.Count - 1)] } else { @() }

switch ($cmd) {
    "dev"      { docker compose run --rm --service-ports dev @rest }
    "build"    { docker compose run --rm build @rest }
    "test"     { docker compose run --rm test @rest }
    "record"   { docker compose run --rm record @rest }
    "tts"      { docker compose run --rm tts @rest }
    "scaffold" {
        if ($rest.Count -eq 0) { Write-Host "Usage: .\kuraviz.ps1 scaffold C:\path\to\output"; exit 1 }
        docker compose run --rm -v "${rest[0]}:/output" scaffold --dir /output
    }
    "shell"    { docker compose run --rm --entrypoint bash dev @rest }
    default {
        Write-Host "Usage: .\kuraviz.ps1 {dev|build|test|record|tts|scaffold <dir>|shell}"
        exit 1
    }
}
