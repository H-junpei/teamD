$ErrorActionPreference = "Stop"

Write-Host "=== Setup start ==="

# 階層移動
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$rootDir = Split-Path -Parent $scriptDir
Set-Location $rootDir

# backend (Python / Flask)
if (Test-Path ".\backend") {
    Write-Host "[backend] setup start"
    Set-Location ".\backend"

    if (-not (Test-Path ".\.venv")) {
        Write-Host "[backend] create .venv"
        python -m venv .venv
    } else {
        Write-Host "[backend] .venv already exists"
    }

    Write-Host "[backend] activate .venv"
    . .\.venv\Scripts\Activate.ps1

    Write-Host "[backend] upgrade pip"
    python -m pip install --upgrade pip

    if (Test-Path ".\requirements.txt") {
        Write-Host "[backend] install requirements.txt"
        python -m pip install -r requirements.txt
    } else {
        Write-Host "[backend] requirements.txt not found, skip"
    }

    Set-Location $rootDir
} else {
    Write-Host "[backend] folder not found, skip"
}

# frontend (React)
if (Test-Path ".\frontend") {
    Write-Host "[frontend] setup start"
    Set-Location ".\frontend"

    if (Test-Path ".\package-lock.json") {
        Write-Host "[frontend] npm ci"
        npm ci
    } elseif (Test-Path ".\package.json") {
        Write-Host "[frontend] package-lock.json not found, fallback to npm install"
        npm install
    } else {
        Write-Host "[frontend] package.json not found, skip"
    }

    Set-Location $rootDir
} else {
    Write-Host "[frontend] folder not found, skip"
}

Write-Host "=== Setup done ==="
