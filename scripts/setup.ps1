$ErrorActionPreference = "Stop"

Write-Host "=== Setup start ==="

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$rootDir = Split-Path -Parent $scriptDir
Set-Location $rootDir

# prerequisite checks
$hasPython = $null -ne (Get-Command python -ErrorAction SilentlyContinue)
$hasNode = $null -ne (Get-Command node -ErrorAction SilentlyContinue)
$hasNpmCmd = $null -ne (Get-Command npm.cmd -ErrorAction SilentlyContinue)

if (-not $hasPython) {
    Write-Host "WARN: python not found. Backend setup will be skipped."
}

if (-not $hasNode -or -not $hasNpmCmd) {
    Write-Host "WARN: Node.js / npm not found. Frontend setup will be skipped."
    Write-Host "WARN: Install Node.js LTS from:"
    Write-Host "WARN: https://nodejs.org/ja/download"
}

# backend
if (Test-Path ".\backend") {
    Write-Host "[backend] start"
    Set-Location ".\backend"

    if (-not $hasPython) {
        Write-Host "[backend] skip (python not found)"
    }
    else {
        if (-not (Test-Path ".\.venv")) {
            Write-Host "[backend] create .venv"
            python -m venv .venv
        }
        else {
            Write-Host "[backend] .venv already exists"
        }

        if (Test-Path ".\.venv\Scripts\Activate.ps1") {
            Write-Host "[backend] activate .venv"
            . .\.venv\Scripts\Activate.ps1

            Write-Host "[backend] upgrade pip"
            python -m pip install --upgrade pip

            if (Test-Path ".\requirements.txt") {
                Write-Host "[backend] install requirements"
                python -m pip install -r requirements.txt
            }
            else {
                Write-Host "[backend] skip (requirements.txt not found)"
            }

            if ((Test-Path ".\.env.example") -and (-not (Test-Path ".\.env"))) {
                Write-Host "[backend] create .env from .env.example"
                Copy-Item ".\.env.example" ".\.env"
            }
            else {
                Write-Host "[backend] .env already exists or .env.example not found"
            }
        }
        else {
            Write-Host "[backend] skip (.venv created but Activate.ps1 not found)"
        }
    }

    Set-Location $rootDir
}
else {
    Write-Host "[backend] skip (folder not found)"
}

# frontend
if (Test-Path ".\frontend") {
    Write-Host "[frontend] start"
    Set-Location ".\frontend"

    if (-not $hasNode -or -not $hasNpmCmd) {
        Write-Host "[frontend] skip (Node.js / npm not found)"
    }
    else {
        if (Test-Path ".\package-lock.json") {
            Write-Host "[frontend] npm.cmd ci"
            npm.cmd ci
        }
        elseif (Test-Path ".\package.json") {
            Write-Host "[frontend] npm.cmd install"
            npm.cmd install
        }
        else {
            Write-Host "[frontend] skip (package.json not found)"
        }
    }

    Set-Location $rootDir
}
else {
    Write-Host "[frontend] skip (folder not found)"
}

Write-Host "=== Setup done ==="
