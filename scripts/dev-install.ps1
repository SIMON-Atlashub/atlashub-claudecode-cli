<#
.SYNOPSIS
    Build et install local pour dev
.PARAMETER Target
    Repertoire cible (default: repertoire courant)
.PARAMETER Global
    Installer globalement (~/.claude) au lieu de localement
.EXAMPLE
    .\dev-install.ps1
.EXAMPLE
    .\dev-install.ps1 -Target "C:\Projects\MonProjet"
.EXAMPLE
    .\dev-install.ps1 -Global
#>

param(
    [string]$Target = ".",
    [switch]$Global
)

$ErrorActionPreference = "Stop"
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectRoot = Split-Path -Parent $ScriptDir

Push-Location $ProjectRoot

try {
    Write-Host "`n=== Claude GitFlow Dev Install ===" -ForegroundColor Cyan

    # Build
    Write-Host "`n[1/2] Building..." -ForegroundColor Yellow
    npm run build
    if ($LASTEXITCODE -ne 0) { throw "Build failed" }

    # Install
    Write-Host "`n[2/2] Installing..." -ForegroundColor Yellow

    if ($Global) {
        Write-Host "Target: ~/.claude (global)" -ForegroundColor Cyan
        node dist/index.js install --force --skip-license
    } else {
        $ResolvedTarget = Resolve-Path $Target -ErrorAction SilentlyContinue
        if (-not $ResolvedTarget) { $ResolvedTarget = $Target }
        Write-Host "Target: $ResolvedTarget/.claude (local)" -ForegroundColor Cyan

        Push-Location $Target
        try {
            node "$ProjectRoot/dist/index.js" install --local --force --skip-license
        } finally {
            Pop-Location
        }
    }

    if ($LASTEXITCODE -ne 0) { throw "Install failed" }

    Write-Host "`n=== Done! ===" -ForegroundColor Green
    Write-Host "Test with: /gitflow or /apex in Claude Code`n" -ForegroundColor Gray

} catch {
    Write-Host "`nError: $_" -ForegroundColor Red
    exit 1
} finally {
    Pop-Location
}
