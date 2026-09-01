@echo off
chcp 65001 > nul
title 토큰 스포츠 팩트 검증 앱 실행기
echo ======================================================
echo 🚀 토큰 스포츠 팩트 분석 앱을 시작합니다...
echo ======================================================
echo.
echo [1/2] 개발 서버를 확인하고 브라우저를 자동으로 엽니다.
echo [2/2] PC 주소: http://localhost:5173
echo 📱 스마트폰(핸드폰) 접속 주소: http://192.168.219.104:5173
echo.
start "" "http://localhost:5173"
call npm run dev
pause

