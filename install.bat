@echo off
echo ========================================
echo Vaultora - Quick Install Script
echo ========================================
echo.

echo Checking for package managers...
echo.

where yarn >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo Found Yarn! Installing with Yarn (faster)...
    yarn install
    if %ERRORLEVEL% EQU 0 (
        echo.
        echo ========================================
        echo Installation Complete!
        echo Run: yarn dev
        echo ========================================
        pause
        exit /b 0
    )
)

where pnpm >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo Found pnpm! Installing with pnpm (fastest)...
    pnpm install
    if %ERRORLEVEL% EQU 0 (
        echo.
        echo ========================================
        echo Installation Complete!
        echo Run: pnpm dev
        echo ========================================
        pause
        exit /b 0
    )
)

echo Using npm (standard)...
npm install --legacy-peer-deps

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo Installation Complete!
    echo Run: npm run dev
    echo ========================================
) else (
    echo.
    echo ========================================
    echo Installation failed!
    echo Try:
    echo 1. npm cache clean --force
    echo 2. Check your internet connection
    echo 3. Install yarn: npm install -g yarn
    echo ========================================
)

pause
