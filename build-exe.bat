@echo off
rem ============================================================
rem  ApkStart - build the Windows program (ApkStart.exe)
rem
rem  Usage:
rem    build-exe.bat            portable edition (default, no installer)
rem    build-exe.bat full       portable edition WITH the Android runtime
rem                             (needs build\runtime, see "npm run runtime")
rem    build-exe.bat setup      NSIS installer Setup.exe
rem                             (needs build\runtime, about 1.4 GB)
rem                             (electron-builder needs a 3-part semver version: it refuses the
rem                             fork's 4-part 0.6.4.1, so setup stops with a message)
rem
rem  Output:
rem    portable : dist\ApkStart-win64-portable\ApkStart.exe
rem    full     : dist\ApkStart-v<version>-win64-full\ApkStart.exe
rem    setup    : dist\release\ApkStart-<version>-Setup.exe
rem
rem  Set NOPAUSE=1 to skip the final "press any key" prompt (CI use).
rem ============================================================
setlocal
cd /d "%~dp0"

rem These two variables are inherited from some hosts and break the build
rem (electron.exe runs as plain node / safe-delete guard blocks pack.js).
set "ELECTRON_RUN_AS_NODE="
set "NODE_OPTIONS="

set "MODE=%~1"
if "%MODE%"=="" set "MODE=portable"
set "RC=0"

where node >nul 2>nul
if errorlevel 1 (
  echo [ERROR] Node.js was not found. Install Node.js 20 or newer from https://nodejs.org/ and try again.
  set "RC=1"
) else if /i not "%MODE%"=="portable" if /i not "%MODE%"=="full" if /i not "%MODE%"=="setup" (
  echo [ERROR] Unknown mode "%MODE%". Use: portable ^| full ^| setup
  set "RC=1"
) else (
  if not exist "node_modules\electron\dist\electron.exe" (
    echo [1/2] Installing dependencies ^(npm ci^) ...
    call npm ci --no-audit --no-fund
    if errorlevel 1 set "RC=1"
  ) else (
    echo [1/2] Dependencies already installed.
  )
)

if "%RC%"=="0" (
  if /i "%MODE%"=="portable" (
    echo [2/2] Building portable edition ...
    call node build\pack.js
    if errorlevel 1 set "RC=1"
  ) else if /i "%MODE%"=="full" (
    if not exist "build\runtime" (
      echo [ERROR] build\runtime was not found. Run "npm run runtime" first ^(needs the engine\ download cache^).
      set "RC=1"
    ) else (
      echo [2/2] Building full portable edition ...
      call node build\pack.js --full
      if errorlevel 1 set "RC=1"
    )
  ) else (
    if not exist "build\runtime" (
      echo [ERROR] build\runtime was not found. Run "npm run runtime" first ^(needs the engine\ download cache^).
      set "RC=1"
    ) else (
      rem electron-builder rejects non-semver versions such as 0.6.4.1 (four parts)
      node -e "process.exit(require('semver').valid(require('./package.json').version)?0:1)"
      if errorlevel 1 (
        echo [ERROR] electron-builder only accepts a 3-part semver version, but package.json has a 4-part one.
        echo         Use the portable edition, or set the version to 0.6.4-1 in package.json for this build only.
        set "RC=1"
      ) else (
        echo [2/2] Building installer ...
        call npm run build:exe
        if errorlevel 1 set "RC=1"
      )
    )
  )
)

echo.
if "%RC%"=="0" (
  echo Build finished. Check the dist\ folder.
) else (
  echo Build FAILED. See the messages above.
)
if not defined NOPAUSE pause
endlocal & exit /b %RC%
