@echo off
echo ====================================
echo Vaultora Admin System Setup
echo ====================================
echo.

echo [1/3] Installing dependencies...
call npm install
echo.

echo [2/3] Setting up environment...
if not exist .env.local (
    echo Creating .env.local from .env.example...
    copy .env.example .env.local
    echo.
    echo ⚠️  IMPORTANT: Add your API keys to .env.local
    echo    - RESEND_API_KEY (get from https://resend.com)
    echo.
) else (
    echo ✓ .env.local already exists
)

echo [3/3] Setup complete!
echo.
echo ====================================
echo Next Steps:
echo ====================================
echo 1. Add RESEND_API_KEY to .env.local
echo 2. Run: start-dev.bat
echo 3. Visit: http://localhost:3000/admin
echo ====================================
echo.
pause
