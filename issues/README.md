# GitHub 이슈 생성 가이드

이 디렉토리에는 WHS-TodoList 프로젝트의 모든 Task에 대한 GitHub 이슈 템플릿이 포함되어 있습니다.

## 사용 방법

### 방법 1: 배치 파일 실행 (권장)

프로젝트 루트 디렉토리에서 다음 명령을 실행하세요:

```bash
create-all-issues.bat
```

이 스크립트는:
- 모든 Task에 대한 GitHub 이슈를 자동으로 생성합니다
- 적절한 라벨을 할당합니다
- Task DB-1은 완료(closed) 상태로 생성합니다
- 생성된 이슈 목록을 표시합니다

### 방법 2: 수동으로 개별 이슈 생성

특정 이슈만 생성하려면:

```bash
gh issue create --title "[DB] 데이터베이스 스키마 및 테이블 생성" --label "feature,database,complexity:medium" --body-file "issues\db-1.md"
```

## 이슈 템플릿 목록

### 데이터베이스
- `db-1.md` - 데이터베이스 스키마 및 테이블 생성 ✅ (완료)

### 백엔드
- `be-1.md` - 백엔드 프로젝트 설정
- `be-2.md` - 핵심 미들웨어 구현
- `be-3.md` - 사용자 인증 API 구현
- `be-4.md` - 할일(Todo) CRUD API 구현
- `be-5.md` - 휴지통 API 구현
- `be-6.md` - 국경일 API 구현

### 프론트엔드
- `fe-1.md` - 프론트엔드 프로젝트 설정
- `fe-2.md` - 라우팅 및 레이아웃 구현
- `fe-3.md` - 전역 상태 관리(Zustand) 및 API 서비스 설정
- `fe-4.md` - 공통 컴포넌트 구현
- `fe-5.md` - 사용자 인증 화면 구현
- `fe-6.md` - 할일 관리 화면 구현
- `fe-7.md` - 휴지통 화면 구현
- `fe-8.md` - 반응형 디자인 및 다크모드 적용

## 이슈 구조

각 이슈는 다음 섹션을 포함합니다:

1. **Todo (해야할 일)**: 체크리스트 형태의 작업 목록
2. **완료 조건**: 명확한 완료 기준
3. **기술적 고려사항**: 구현 시 고려해야 할 기술적 세부사항
4. **의존성**: 다른 Task와의 의존관계
5. **선행 작업**: 이 Task를 시작하기 전에 완료되어야 할 작업
6. **후행 작업**: 이 Task 완료 후 시작 가능한 작업

## 라벨 설명

- **종류**: `feature`, `bug`, `enhancement`, `documentation`
- **영역**: `database`, `backend`, `frontend`
- **복잡도**:
  - `complexity:low` - 1-2시간 예상
  - `complexity:medium` - 2-4시간 예상
  - `complexity:high` - 4시간 이상 예상

## 주의사항

1. GitHub CLI (`gh`)가 설치되어 있어야 합니다
2. GitHub 저장소에 푸시 권한이 있어야 합니다
3. 이슈 생성 전 현재 브랜치가 올바른지 확인하세요
