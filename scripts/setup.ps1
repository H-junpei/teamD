$ErrorActionPreference = "Stop"

Write-Host "=== Setup start ==="

# このスクリプトの1つ上（teamD）へ移動
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$rootDir = Split-Path -Parent $scriptDir
Set-Location $rootDir

# ----------------------------
# prerequisite checks
# ----------------------------
$hasPython = $null -ne (Get-Command python -ErrorAction SilentlyContinue)
$hasNode = $null -ne (Get-Command node -ErrorAction SilentlyContinue)
$hasNpmCmd = $null -ne (Get-Command npm.cmd -ErrorAction SilentlyContinue)

if (-not $hasPython) {
    Write-Host "[warn] python が見つかりません。backend を使う場合は Python のインストールが必要です。"
}

if (-not $hasNode -or -not $hasNpmCmd) {
    Write-Host "[warn] Node.js / npm が見つかりません。frontend を使う場合は Node.js LTS のインストールが必要です。"
    Write-Host "[warn] https://nodejs.org/ja/download"
}

# ----------------------------
# backend (Python / Flask)
# ----------------------------
if (Test-Path ".\backend") {
    Write-Host "[backend] setup start"
    Set-Location ".\backend"

    if (-not $hasPython) {
        Write-Host "[backend] python が見つからないため skip"
    } else {
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

        if ((Test-Path ".\.env.example") -and (-not (Test-Path ".\.env"))) {
            Write-Host "[backend] create .env from .env.example"
            Copy-Item ".\.env.example" ".\.env"
        } else {
            Write-Host "[backend] .env already exists or .env.example not found"
        }
    }

    Set-Location $rootDir
} else {
    Write-Host "[backend] folder not found, skip"
}

# ----------------------------
# frontend (React / Vite)
# ----------------------------
if (Test-Path ".\frontend") {
    Write-Host "[frontend] setup start"
    Set-Location ".\frontend"

    if (-not $hasNode -or -not $hasNpmCmd) {
        Write-Host "[frontend] Node.js / npm が見つからないため skip"
    } else {
        if (Test-Path ".\package-lock.json") {
            Write-Host "[frontend] npm.cmd ci"
            npm.cmd ci
        } elseif (Test-Path ".\package.json") {
            Write-Host "[frontend] package-lock.json not found, fallback to npm.cmd install"
            npm.cmd install
        } else {
            Write-Host "[frontend] package.json not found, skip"
        }
    }

    Set-Location $rootDir
} else {
    Write-Host "[frontend] folder not found, skip"
}

Write-Host "=== Setup done ==="
