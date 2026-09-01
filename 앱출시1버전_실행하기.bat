@echo off
chcp 65001 > nul
title 토큰앱 앱출시 1버전 (독립 실행기)
echo ========================================================
echo   [토큰앱 - 앱출시 1버전] 독립 실행기 가동 중...
echo ========================================================
echo.

if not exist node_modules (
    echo [안내] 초기 패키지 의존성을 설치합니다 (최초 1회 실행)...
    call npm install
)

echo [실행] 로컬 웹 서버 및 브라우저를 실행합니다...
echo.
echo 📱 스마트폰(핸드폰) 접속 주소: http://192.168.219.104:5173
echo 💻 PC 브라우저 접속 주소: http://localhost:5173
echo.
call npm run dev
pause

