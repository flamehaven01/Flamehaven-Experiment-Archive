@echo off
setlocal
cd /d "%~dp0"

node scripts\build-ledger-summary.mjs
if errorlevel 1 (
  echo.
  echo Ledger summary build failed.
  pause
  exit /b 1
)

echo.
echo Ledger summary build completed.
pause
