# Task DB-1: 데이터베이스 스키마 및 테이블 생성 (완료됨 - closed)
$body1 = @"
## Todo (해야할 일)
- [x] ``users`` 테이블 생성
- [x] ``todos`` 테이블 생성
- [x] ``holidays`` 테이블 생성
- [x] 각 테이블에 필요한 제약조건(PK, FK, UNIQUE, CHECK) 및 인덱스 설정
- [x] RLS(Row Level Security) 정책 설정 (사용자는 자신의 데이터만 접근)

## 완료 조건
- ``database/schema.sql`` 파일에 최종 DDL 스크립트가 작성됨
- Supabase 프로젝트에 해당 스크립트가 오류 없이 적용되어 모든 테이블과 관계, 정책이 정상적으로 생성됨

## 기술적 고려사항
- PostgreSQL 15+ 문법 사용
- UUID 타입 사용 (uuid_generate_v4())
- 적절한 인덱스 생성으로 성능 최적화
- CHECK 제약조건: dueDate >= startDate
- FOREIGN KEY: userId REFERENCES User(userId) ON DELETE CASCADE
- RLS 정책: 사용자는 자신의 데이터만 접근 가능

## 의존성
- 없음 (프로젝트의 가장 우선적인 작업)

## 선행 작업
- 없음

## 후행 작업
- Task BE-3: 사용자 인증 API 구현
- Task BE-4: 할일(Todo) CRUD API 구현
- Task BE-6: 국경일 API 구현
"@

gh issue create --title "[DB] 데이터베이스 스키마 및 테이블 생성" --label "feature,database,complexity:medium" --body $body1
$issueNumber = gh issue list --limit 1 --json number --jq '.[0].number'
gh issue close $issueNumber

# Task BE-1: 백엔드 프로젝트 설정
$body2 = @"
## Todo (해야할 일)
- [ ] Node.js, Express 프로젝트 초기화 (``package.json``)
- [ ] ``src`` 디렉토리 및 ``controllers``, ``services``, ``repositories``, ``middlewares``, ``routes``, ``utils``, ``config`` 폴더 구조 생성
- [ ] ``ESLint``, ``Prettier`` 설정
- [ ] 필수 라이브러리 설치 (``express``, ``jsonwebtoken``, ``bcrypt``, ``cors``, ``helmet``, ``express-validator``, ``pg``)

## 완료 조건
- ``npm install`` 명령어로 모든 의존성 설치가 정상적으로 완료됨
- ``npm run dev`` 명령어로 Express 서버가 로컬에서 실행됨
- ``lint`` 및 ``format`` 스크립트가 정상 동작함

## 기술적 고려사항
- Node.js 18+ 사용
- Express.js 4.x
- TypeScript는 선택사항 (시간 여유 시 적용)
- nodemon을 사용하여 개발 서버 자동 재시작
- 환경 변수 관리를 위한 dotenv 설정

## 의존성
- 없음

## 선행 작업
- 없음

## 후행 작업
- Task BE-2: 핵심 미들웨어 구현
"@

gh issue create --title "[Backend] 백엔드 프로젝트 설정" --label "feature,backend,setup,complexity:low" --body $body2

# Task BE-2: 핵심 미들웨어 구현
$body3 = @"
## Todo (해야할 일)
- [ ] **인증 미들웨어**: JWT 토큰을 검증하고 ``req.user``에 사용자 정보를 주입하는 미들웨어 구현
- [ ] **에러 핸들링 미들웨어**: 모든 에러를 일관된 JSON 형식으로 처리하는 미들웨어 구현
- [ ] **CORS 및 보안 미들웨어**: ``cors``, ``helmet`` 설정

## 완료 조건
- 각 미들웨어 함수가 ``src/middlewares`` 폴더에 작성됨
- ``app.js``에 미들웨어가 순서에 맞게 적용됨
- 의도적으로 발생시킨 에러가 에러 핸들링 미들웨어에 의해 정상 처리됨

## 기술적 고려사항
- JWT 검증: jsonwebtoken 라이브러리 사용
- 에러 응답 형식: ``{ success: false, error: { code, message } }``
- CORS 설정: 허용된 Origin만 접근 가능
- Helmet을 사용한 보안 헤더 설정
- Rate Limiting 미들웨어 (선택사항, P1)

## 의존성
- Task BE-1

## 선행 작업
- Task BE-1: 백엔드 프로젝트 설정

## 후행 작업
- Task BE-3: 사용자 인증 API 구현
- Task BE-4: 할일(Todo) CRUD API 구현
- Task BE-6: 국경일 API 구현
"@

gh issue create --title "[Backend] 핵심 미들웨어 구현" --label "feature,backend,middleware,complexity:medium" --body $body3

# Task BE-3: 사용자 인증 API 구현
$body4 = @"
## Todo (해야할 일)
- [ ] **회원가입 API**: ``POST /api/auth/register`` (비밀번호 ``bcrypt`` 해싱)
- [ ] **로그인 API**: ``POST /api/auth/login`` (JWT Access/Refresh Token 발급)
- [ ] **토큰 갱신 API**: ``POST /api/auth/refresh``
- [ ] **로그아웃 API**: ``POST /api/auth/logout`` (Refresh Token 무효화 처리 - 선택)
- [ ] **사용자 프로필 조회/수정 API**: ``GET /api/users/me``, ``PATCH /api/users/me``

## 완료 조건
- Postman 또는 Thunder Client를 통해 모든 인증 API 엔드포인트가 PRD 명세대로 동작함을 확인
- 회원가입 시 비밀번호가 암호화되어 DB에 저장됨
- 로그인 시 유효한 JWT 토큰이 발급됨

## 기술적 고려사항
- bcrypt salt rounds: 10
- JWT Access Token 만료시간: 15분
- JWT Refresh Token 만료시간: 7일
- 이메일 중복 체크 (UNIQUE 제약조건)
- 비밀번호 검증 (최소 8자 이상)
- express-validator를 사용한 입력값 검증
- 에러 코드: EMAIL_EXISTS, INVALID_CREDENTIALS, TOKEN_EXPIRED 등

## 의존성
- Task DB-1
- Task BE-2

## 선행 작업
- Task DB-1: 데이터베이스 스키마 및 테이블 생성
- Task BE-2: 핵심 미들웨어 구현

## 후행 작업
- Task FE-5: 사용자 인증 화면 구현
"@

gh issue create --title "[Backend] 사용자 인증 API 구현" --label "feature,backend,auth,complexity:high" --body $body4

# Task BE-4: 할일(Todo) CRUD API 구현
$body5 = @"
## Todo (해야할 일)
- [ ] **할일 생성/조회/수정 API**: ``POST /api/todos``, ``GET /api/todos``, ``GET /api/todos/:id``, ``PUT /api/todos/:id``
- [ ] **할일 완료/복원 API**: ``PATCH /api/todos/:id/complete``, ``PATCH /api/todos/:id/restore``
- [ ] **할일 삭제(소프트 삭제) API**: ``DELETE /api/todos/:id``
- [ ] **비즈니스 로직 적용**: 자신의 할일만 접근, 날짜 유효성 검사 등

## 완료 조건
- Postman을 통해 모든 할일 API가 명세대로 동작함을 확인
- 다른 사용자의 할일 접근 시 403 Forbidden 에러가 반환됨
- 삭제 시 ``status``가 ``deleted``로 변경되고 ``deleted_at``이 기록됨

## 기술적 고려사항
- 소프트 삭제 구현 (status='deleted', deletedAt 기록)
- 비즈니스 규칙: dueDate >= startDate 검증
- 권한 체크: userId 일치 여부 확인
- 쿼리 파라미터: status, search, sortBy, order 지원
- 페이지네이션 (선택사항, P1)
- 할일 완료 시: isCompleted=true, status='completed'

## 의존성
- Task DB-1
- Task BE-2

## 선행 작업
- Task DB-1: 데이터베이스 스키마 및 테이블 생성
- Task BE-2: 핵심 미들웨어 구현

## 후행 작업
- Task BE-5: 휴지통 API 구현
- Task FE-6: 할일 관리 화면 구현
"@

gh issue create --title "[Backend] 할일(Todo) CRUD API 구현" --label "feature,backend,todo,complexity:high" --body $body5

# Task BE-5: 휴지통 API 구현
$body6 = @"
## Todo (해야할 일)
- [ ] **휴지통 조회 API**: ``GET /api/trash``
- [ ] **영구 삭제 API**: ``DELETE /api/trash/:id``

## 완료 조건
- ``status``가 ``deleted``인 할일만 휴지통 조회 API에서 반환됨
- 영구 삭제 API 호출 시 DB에서 데이터가 완전히 제거됨

## 기술적 고려사항
- 휴지통 조회: WHERE status='deleted' AND userId={currentUser}
- 영구 삭제: DELETE FROM todos WHERE todoId={id}
- 영구 삭제 전 상태 확인: status='deleted'인지 체크
- 권한 검증: 자신의 할일만 삭제 가능

## 의존성
- Task BE-4

## 선행 작업
- Task BE-4: 할일(Todo) CRUD API 구현

## 후행 작업
- Task FE-7: 휴지통 화면 구현
"@

gh issue create --title "[Backend] 휴지통 API 구현" --label "feature,backend,trash,complexity:low" --body $body6

# Task BE-6: 국경일 API 구현
$body7 = @"
## Todo (해야할 일)
- [ ] **국경일 조회 API**: ``GET /api/holidays`` (연도/월별 필터링)
- [ ] **국경일 추가/수정 API**: ``POST /api/holidays``, ``PUT /api/holidays/:id`` (관리자 권한 체크)

## 완료 조건
- 모든 사용자가 국경일 조회를 할 수 있음
- 관리자(``role='admin'``)만 국경일 추가/수정이 가능하며, 일반 사용자 접근 시 403 에러가 반환됨

## 기술적 고려사항
- 쿼리 파라미터: year, month (선택)
- 관리자 권한 미들웨어 구현: req.user.role === 'admin' 체크
- 국경일은 삭제 불가 (비즈니스 규칙)
- isRecurring: 매년 반복되는 국경일 지원
- 초기 데이터: 한국 법정 공휴일 수동 입력

## 의존성
- Task DB-1
- Task BE-2

## 선행 작업
- Task DB-1: 데이터베이스 스키마 및 테이블 생성
- Task BE-2: 핵심 미들웨어 구현

## 후행 작업
- Task FE-6: 할일 관리 화면 구현
"@

gh issue create --title "[Backend] 국경일 API 구현" --label "feature,backend,holiday,complexity:medium" --body $body7

# Task FE-1: 프론트엔드 프로젝트 설정
$body8 = @"
## Todo (해야할 일)
- [ ] React, Vite, Tailwind CSS 프로젝트 초기화
- [ ] ``src`` 디렉토리 및 ``components``, ``pages``, ``stores``, ``services``, ``hooks``, ``utils``, ``constants`` 폴더 구조 생성
- [ ] ``ESLint``, ``Prettier`` 설정
- [ ] 필수 라이브러리 설치 (``react-router-dom``, ``axios``, ``zustand``, ``react-hook-form``, ``zod``, ``lucide-react``)

## 완료 조건
- ``npm install`` 명령어로 모든 의존성 설치가 정상적으로 완료됨
- ``npm run dev`` 명령어로 Vite 개발 서버가 실행되고 기본 페이지가 렌더링됨
- Tailwind CSS 유틸리티 클래스가 정상적으로 적용됨

## 기술적 고려사항
- React 18.x
- Vite 최신 버전
- Tailwind CSS 설정 파일 구성
- PostCSS 설정
- ESLint + Prettier 통합 설정
- 절대 경로 임포트 설정 (@/ 별칭)

## 의존성
- 없음

## 선행 작업
- 없음

## 후행 작업
- Task FE-2: 라우팅 및 레이아웃 구현
"@

gh issue create --title "[Frontend] 프론트엔드 프로젝트 설정" --label "feature,frontend,setup,complexity:low" --body $body8

# Task FE-2: 라우팅 및 레이아웃 구현
$body9 = @"
## Todo (해야할 일)
- [ ] **라우터 설정**: ``react-router-dom``을 사용해 페이지 라우트(``/``, ``/login``, ``/register``, ``/trash`` 등) 설정
- [ ] **인증 라우트 가드**: 로그인해야 접근 가능한 페이지(Private Route)와 비로그인 시 접근하는 페이지(Public Route) 구현
- [ ] **공통 레이아웃**: ``Header``, ``Main`` 영역을 포함하는 ``MainLayout`` 컴포넌트 구현

## 완료 조건
- URL에 따라 지정된 페이지 컴포넌트가 렌더링됨
- 로그인 상태에 따라 페이지 접근이 제어됨 (예: 비로그인 시 ``/`` 접근하면 ``/login``으로 리다이렉트)
- 모든 페이지에 공통 헤더가 표시됨

## 기술적 고려사항
- React Router v6 문법 사용
- PrivateRoute 컴포넌트: authStore의 isAuthenticated 체크
- PublicRoute 컴포넌트: 로그인 시 메인으로 리다이렉트
- 레이아웃 컴포넌트: Outlet을 사용한 중첩 라우팅
- 404 페이지 구현

## 의존성
- Task FE-1

## 선행 작업
- Task FE-1: 프론트엔드 프로젝트 설정

## 후행 작업
- Task FE-3: 전역 상태 관리(Zustand) 및 API 서비스 설정
- Task FE-4: 공통 컴포넌트 구현
"@

gh issue create --title "[Frontend] 라우팅 및 레이아웃 구현" --label "feature,frontend,routing,complexity:medium" --body $body9

# Task FE-3: 전역 상태 관리(Zustand) 및 API 서비스 설정
$body10 = @"
## Todo (해야할 일)
- [ ] **인증 스토어 ``authStore``**: 사용자 정보, 토큰, 로그인/로그아웃 액션 정의
- [ ] **할일 스토어 ``todoStore``**: 할일 목록, 로딩/에러 상태, CRUD 액션 정의
- [ ] **API 서비스 ``axios`` 인스턴스**: ``baseURL`` 설정, 요청/응답 인터셉터 구현 (토큰 자동 주입 및 401 에러 처리)

## 완료 조건
- 로그인 시 ``authStore``에 사용자 정보와 토큰이 저장됨
- API 호출 시 ``axios`` 인터셉터가 자동으로 헤더에 토큰을 추가함
- 토큰 만료(401) 시 토큰 갱신 로직이 트리거되거나 로그인 페이지로 이동함

## 기술적 고려사항
- Zustand persist 미들웨어: localStorage에 인증 정보 저장
- axios.create()로 인스턴스 생성
- 요청 인터셉터: Authorization 헤더에 토큰 자동 추가
- 응답 인터셉터: 401 에러 시 토큰 갱신 로직
- 토큰 갱신 실패 시 로그아웃 처리
- uiStore (선택): 다크모드, 모달 상태 관리

## 의존성
- Task FE-1
- Task BE-3 (API 명세)

## 선행 작업
- Task FE-1: 프론트엔드 프로젝트 설정

## 후행 작업
- Task FE-5: 사용자 인증 화면 구현
- Task FE-6: 할일 관리 화면 구현
"@

gh issue create --title "[Frontend] 전역 상태 관리(Zustand) 및 API 서비스 설정" --label "feature,frontend,state-management,complexity:high" --body $body10

# Task FE-4: 공통 컴포넌트 구현
$body11 = @"
## Todo (해야할 일)
- [ ] ``Button``, ``Input``, ``Modal``, ``LoadingSpinner`` 등 재사용 가능한 UI 컴포넌트 구현
- [ ] 각 컴포넌트는 다양한 상태(variant, size, disabled 등)를 지원

## 완료 조건
- Storybook 또는 별도 테스트 페이지에서 모든 공통 컴포넌트의 상태와 기능이 정상적으로 동작함을 확인

## 기술적 고려사항
- Tailwind CSS를 사용한 스타일링
- 컴포넌트 Props 타입 정의 (PropTypes 또는 TypeScript)
- variant 지원: primary, secondary, outline, ghost 등
- size 지원: sm, md, lg
- disabled, loading 상태 지원
- 접근성: aria-label, role 속성 추가
- lucide-react 아이콘 사용

**구현할 컴포넌트:**
- Button: 다양한 variant와 size
- Input: text, email, password, date 타입
- Modal: 헤더, 본문, 푸터 영역
- LoadingSpinner: 로딩 상태 표시
- Card: 할일 카드 레이아웃
- Badge: 상태 표시 배지

## 의존성
- Task FE-1

## 선행 작업
- Task FE-1: 프론트엔드 프로젝트 설정

## 후행 작업
- Task FE-5: 사용자 인증 화면 구현
- Task FE-6: 할일 관리 화면 구현
- Task FE-7: 휴지통 화면 구현
"@

gh issue create --title "[Frontend] 공통 컴포넌트 구현" --label "feature,frontend,components,complexity:medium" --body $body11

# Task FE-5: 사용자 인증 화면 구현
$body12 = @"
## Todo (해야할 일)
- [ ] **로그인 페이지**: 이메일, 비밀번호 입력 폼 및 로그인 API 연동
- [ ] **회원가입 페이지**: 이메일, 비밀번호, 이름 입력 폼 및 회원가입 API 연동
- [ ] ``react-hook-form``과 ``zod``를 이용한 클라이언트 측 유효성 검사 구현

## 완료 조건
- 유효성 검사(이메일 형식, 비밀번호 길이 등)가 정상 동작함
- 회원가입 및 로그인 기능이 실제 API와 연동되어 정상적으로 완료됨
- 로그인 성공 시 메인 페이지로 이동하고, ``authStore`` 상태가 업데이트됨

## 기술적 고려사항
- react-hook-form의 useForm 훅 사용
- zod 스키마 검증: 이메일 형식, 비밀번호 최소 8자
- 에러 메시지 표시: 각 필드 하단에 빨간색으로 표시
- 로딩 상태: 제출 중 버튼 비활성화 및 스피너 표시
- 회원가입 성공 시 로그인 페이지로 리다이렉트
- 로그인 성공 시 토큰을 authStore에 저장

## 의존성
- Task FE-2
- Task FE-3
- Task FE-4
- Task BE-3

## 선행 작업
- Task FE-2: 라우팅 및 레이아웃 구현
- Task FE-3: 전역 상태 관리(Zustand) 및 API 서비스 설정
- Task FE-4: 공통 컴포넌트 구현
- Task BE-3: 사용자 인증 API 구현

## 후행 작업
- 없음
"@

gh issue create --title "[Frontend] 사용자 인증 화면 구현" --label "feature,frontend,auth,complexity:medium" --body $body12

# Task FE-6: 할일 관리 화면 구현
$body13 = @"
## Todo (해야할 일)
- [ ] **할일 목록 페이지**: ``todoStore``와 연동하여 할일 목록 및 국경일 표시
- [ ] **할일 카드 ``TodoCard``**: 개별 할일 정보 표시 (완료 체크박스, 수정/삭제 버튼 포함)
- [ ] **할일 추가/수정 모달**: ``TodoForm``을 사용해 할일 생성 및 수정 API 연동
- [ ] **필터링/정렬 UI**: 날짜, 상태 기준 필터 및 정렬 기능 구현

## 완료 조건
- 페이지 진입 시 할일 목록과 국경일이 API를 통해 정상적으로 조회됨
- 할일 추가, 수정, 완료, 삭제 기능이 모달 및 카드 컴포넌트를 통해 정상적으로 동작함
- 필터링 및 정렬 기능이 UI와 연동되어 목록을 다시 렌더링함

## 기술적 고려사항
- 할일 목록 조회: useEffect에서 todoStore.fetchTodos() 호출
- 국경일 표시: 할일 목록과 함께 표시 (다른 색상으로 구분)
- 완료 체크박스: 클릭 시 PATCH /api/todos/:id/complete 호출
- 삭제: 확인 모달 후 DELETE /api/todos/:id (소프트 삭제)
- 필터링: 드롭다운으로 상태 선택 (전체, 진행중, 완료)
- 정렬: 날짜 순, 생성일 순
- 만료일 지난 할일: 빨간색으로 시각적 구분

## 의존성
- Task FE-2
- Task FE-3
- Task FE-4
- Task BE-4
- Task BE-6

## 선행 작업
- Task FE-2: 라우팅 및 레이아웃 구현
- Task FE-3: 전역 상태 관리(Zustand) 및 API 서비스 설정
- Task FE-4: 공통 컴포넌트 구현
- Task BE-4: 할일(Todo) CRUD API 구현
- Task BE-6: 국경일 API 구현

## 후행 작업
- Task FE-8: 반응형 디자인 및 다크모드 적용
"@

gh issue create --title "[Frontend] 할일 관리 화면 구현" --label "feature,frontend,todo,complexity:high" --body $body13

# Task FE-7: 휴지통 화면 구현
$body14 = @"
## Todo (해야할 일)
- [ ] **휴지통 페이지**: 삭제된 할일 목록 조회 API 연동
- [ ] 삭제된 할일 카드에 '복원'과 '영구 삭제' 버튼 추가
- [ ] 각 버튼 클릭 시 복원 API 및 영구 삭제 API 연동

## 완료 조건
- 휴지통 페이지에 진입 시 삭제된 할일 목록이 정상적으로 조회됨
- 할일 복원 및 영구 삭제 기능이 API와 연동되어 정상 동작하고, 목록이 실시간으로 업데이트됨

## 기술적 고려사항
- GET /api/trash로 삭제된 할일 조회
- 복원 버튼: PATCH /api/todos/:id/restore 호출
- 영구 삭제 버튼: 확인 모달 후 DELETE /api/trash/:id 호출
- 영구 삭제는 되돌릴 수 없음을 경고 메시지로 표시
- 복원 성공 시 할일 목록으로 이동
- 회색 톤으로 삭제된 상태 시각화

## 의존성
- Task FE-2
- Task FE-3
- Task BE-5

## 선행 작업
- Task FE-2: 라우팅 및 레이아웃 구현
- Task FE-3: 전역 상태 관리(Zustand) 및 API 서비스 설정
- Task BE-5: 휴지통 API 구현

## 후행 작업
- Task FE-8: 반응형 디자인 및 다크모드 적용
"@

gh issue create --title "[Frontend] 휴지통 화면 구현" --label "feature,frontend,trash,complexity:low" --body $body14

# Task FE-8: 반응형 디자인 및 다크모드 적용
$body15 = @"
## Todo (해야할 일)
- [ ] 모든 페이지 및 컴포넌트에 Tailwind CSS를 사용해 반응형 스타일 적용 (모바일/데스크톱)
- [ ] ``uiStore``와 ``localStorage``를 활용해 다크모드/라이트모드 전환 기능 구현

## 완료 조건
- 브라우저 창 크기를 조절했을 때 레이아웃이 깨지지 않고 자연스럽게 변경됨
- 다크모드 전환 버튼 클릭 시 전체 테마가 즉시 변경되며, 새로고침해도 유지됨

## 기술적 고려사항
- Tailwind CSS 반응형 유틸리티: sm:, md:, lg:, xl:
- 모바일 우선 디자인 (Mobile First)
- 브레이크포인트: mobile(480px), tablet(768px), desktop(1024px)
- 다크모드: Tailwind CSS dark: 유틸리티 사용
- 시스템 설정 감지: window.matchMedia('(prefers-color-scheme: dark)')
- localStorage에 테마 설정 저장
- Header에 다크모드 토글 버튼 추가
- 다크모드 색상: 배경 #1A1A1A, 텍스트 #E5E5E5

## 의존성
- Task FE-6
- Task FE-7

## 선행 작업
- Task FE-6: 할일 관리 화면 구현
- Task FE-7: 휴지통 화면 구현

## 후행 작업
- 없음
"@

gh issue create --title "[Frontend] 반응형 디자인 및 다크모드 적용" --label "feature,frontend,ui,complexity:medium" --body $body15

Write-Host "모든 이슈가 생성되었습니다!"
Write-Host "생성된 이슈 목록:"
gh issue list --limit 20
