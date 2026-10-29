# Codo Editor - Install & Run Script
# Run this script from the repository root: .\install-and-run.ps1

Write-Host "=== Codo Editor Setup ===" -ForegroundColor Cyan

# Check Node version
$nodeVersion = node --version 2>$null
if (-not $nodeVersion) {
    Write-Host "ERROR: Node.js not found. Install Node.js >= 20.18.1 from https://nodejs.org" -ForegroundColor Red
    exit 1
}
Write-Host "Node.js: $nodeVersion" -ForegroundColor Green

# Check for pnpm or yarn
$pnpm = Get-Command pnpm -ErrorAction SilentlyContinue
$yarn = Get-Command yarn -ErrorAction SilentlyContinue

if ($pnpm) {
    Write-Host "Package manager: pnpm" -ForegroundColor Green
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    pnpm install
    Write-Host "Building native modules..." -ForegroundColor Yellow
    pnpm run build
    Write-Host "Starting Codo..." -ForegroundColor Cyan
    pnpm run start
} elseif ($yarn) {
    Write-Host "Package manager: yarn" -ForegroundColor Green
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    yarn install
    Write-Host "Building native modules..." -ForegroundColor Yellow
    yarn build
    Write-Host "Starting Codo..." -ForegroundColor Cyan
    yarn start
} else {
    Write-Host "ERROR: Neither pnpm nor yarn found." -ForegroundColor Red
    Write-Host "Install pnpm with: npm install -g pnpm" -ForegroundColor Yellow
    exit 1
}
