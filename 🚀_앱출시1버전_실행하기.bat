@echo off
chcp 65001 > nul
title 토큰앱 앱출시 1버전 (독립 실행기)
echo ========================================================
echo   🚀 [토큰앱 - 앱출시 1버전] 독립 실행기 가동 중...
echo ========================================================
echo.

if not exist node_modules (
    echo 📦 초기 패키지 의존성을 설치합니다 (최초 1회 실행)...
    call npm install
)

echo 🌐 로컬 웹 서버 및 브라우저를 실행합니다...
call npm run dev
pause
