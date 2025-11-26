@echo off
chcp 65001 > nul
echo GitHub 이슈 생성 시작...
echo.

REM Task DB-1 (완료됨)
echo [1/14] DB-1 이슈 생성 중...
gh issue create --title "[DB] 데이터베이스 스키마 및 테이블 생성" --label "feature,database,complexity:medium" --body-file "issues\db-1.md"
for /f "tokens=*" %%a in ('gh issue list --limit 1 --json number --jq ".[0].number"') do set ISSUE_NUM=%%a
gh issue close %ISSUE_NUM% --comment "완료됨: 데이터베이스 스키마가 성공적으로 생성되었습니다."
echo.

REM Task BE-1
echo [2/14] BE-1 이슈 생성 중...
gh issue create --title "[Backend] 백엔드 프로젝트 설정" --label "feature,backend,setup,complexity:low" --body-file "issues\be-1.md"
echo.

REM Task BE-2
echo [3/14] BE-2 이슈 생성 중...
gh issue create --title "[Backend] 핵심 미들웨어 구현" --label "feature,backend,middleware,complexity:medium" --body-file "issues\be-2.md"
echo.

REM Task BE-3
echo [4/14] BE-3 이슈 생성 중...
gh issue create --title "[Backend] 사용자 인증 API 구현" --label "feature,backend,auth,complexity:high" --body-file "issues\be-3.md"
echo.

REM Task BE-4
echo [5/14] BE-4 이슈 생성 중...
gh issue create --title "[Backend] 할일(Todo) CRUD API 구현" --label "feature,backend,todo,complexity:high" --body-file "issues\be-4.md"
echo.

REM Task BE-5
echo [6/14] BE-5 이슈 생성 중...
gh issue create --title "[Backend] 휴지통 API 구현" --label "feature,backend,trash,complexity:low" --body-file "issues\be-5.md"
echo.

REM Task BE-6
echo [7/14] BE-6 이슈 생성 중...
gh issue create --title "[Backend] 국경일 API 구현" --label "feature,backend,holiday,complexity:medium" --body-file "issues\be-6.md"
echo.

REM Task FE-1
echo [8/14] FE-1 이슈 생성 중...
gh issue create --title "[Frontend] 프론트엔드 프로젝트 설정" --label "feature,frontend,setup,complexity:low" --body-file "issues\fe-1.md"
echo.

REM Task FE-2
echo [9/14] FE-2 이슈 생성 중...
gh issue create --title "[Frontend] 라우팅 및 레이아웃 구현" --label "feature,frontend,routing,complexity:medium" --body-file "issues\fe-2.md"
echo.

REM Task FE-3
echo [10/14] FE-3 이슈 생성 중...
gh issue create --title "[Frontend] 전역 상태 관리(Zustand) 및 API 서비스 설정" --label "feature,frontend,state-management,complexity:high" --body-file "issues\fe-3.md"
echo.

REM Task FE-4
echo [11/14] FE-4 이슈 생성 중...
gh issue create --title "[Frontend] 공통 컴포넌트 구현" --label "feature,frontend,components,complexity:medium" --body-file "issues\fe-4.md"
echo.

REM Task FE-5
echo [12/14] FE-5 이슈 생성 중...
gh issue create --title "[Frontend] 사용자 인증 화면 구현" --label "feature,frontend,auth,complexity:medium" --body-file "issues\fe-5.md"
echo.

REM Task FE-6
echo [13/14] FE-6 이슈 생성 중...
gh issue create --title "[Frontend] 할일 관리 화면 구현" --label "feature,frontend,todo,complexity:high" --body-file "issues\fe-6.md"
echo.

REM Task FE-7
echo [14/14] FE-7 이슈 생성 중...
gh issue create --title "[Frontend] 휴지통 화면 구현" --label "feature,frontend,trash,complexity:low" --body-file "issues\fe-7.md"
echo.

REM Task FE-8
echo [15/14] FE-8 이슈 생성 중...
gh issue create --title "[Frontend] 반응형 디자인 및 다크모드 적용" --label "feature,frontend,ui,complexity:medium" --body-file "issues\fe-8.md"
echo.

echo ============================================
echo 모든 이슈 생성 완료!
echo ============================================
echo.
echo 생성된 이슈 목록:
gh issue list --limit 20

pause
