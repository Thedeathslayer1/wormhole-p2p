@echo off
title Wormhole Launcher
echo Starting Wormhole...
cd /d "%~dp0"
npm run electron:dev
