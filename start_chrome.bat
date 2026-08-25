@echo off
echo ===================================================
echo Force closing any hidden Chrome background processes...
echo ===================================================
taskkill /IM chrome.exe /F 2>nul

echo.
echo ===================================================
echo Starting Chrome with remote debugging enabled...
echo ===================================================
start "" "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" --remote-debugging-port=9222 --user-data-dir="%APPDATA%\chrome_debug_profile"

echo.
echo Chrome has been started! 
echo Please leave that Chrome window open, and now you can run:
echo node edutap_downloader.js
echo.
pause
