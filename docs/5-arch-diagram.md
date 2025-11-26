# WHS-TodoList 기술 아키텍처 다이어그램

**버전**: 1.0
**작성일**: 2025-11-26
**작성자**: Technical Writer
**참조 문서**: [PRD v1.0](./3-prd.md)

---

## 시스템 아키텍처 개요

WHS-TodoList는 3-Tier 아키텍처를 기반으로 한 웹 애플리케이션입니다.
- **프론트엔드**: React + Vite로 구성된 SPA (Single Page Application)
- **백엔드**: Express.js 기반 REST API 서버
- **데이터베이스**: Supabase PostgreSQL

---

## 전체 시스템 아키텍처

```mermaid
graph TB
    subgraph "클라이언트"
        User[사용자]
        Browser[웹 브라우저]
    end

    subgraph "프론트엔드 - Vercel"
        React[React 18 + Vite]
        Zustand[Zustand 상태관리]
        Axios[Axios HTTP Client]
        TailwindCSS[Tailwind CSS]
    end

    subgraph "백엔드 - Vercel Serverless"
        Express[Express.js API Server]

        subgraph "미들웨어"
            Auth[JWT 인증]
            RateLimit[Rate Limiting]
            CORS[CORS 설정]
            Validator[요청 검증]
        end

        subgraph "API 레이어"
            AuthAPI[인증 API]
            TodoAPI[할일 API]
            TrashAPI[휴지통 API]
            HolidayAPI[국경일 API]
            UserAPI[사용자 API]
        end
    end

    subgraph "데이터베이스 - Supabase"
        PostgreSQL[(PostgreSQL 15+)]

        subgraph "테이블"
            Users[Users 테이블]
            Todos[Todos 테이블]
            Holidays[Holidays 테이블]
        end
    end

    User -->|HTTP/HTTPS| Browser
    Browser -->|라우팅| React
    React --> Zustand
    React --> TailwindCSS
    Zustand -->|API 호출| Axios
    Axios -->|REST API| Express

    Express --> Auth
    Auth --> CORS
    CORS --> RateLimit
    RateLimit --> Validator

    Validator --> AuthAPI
    Validator --> TodoAPI
    Validator --> TrashAPI
    Validator --> HolidayAPI
    Validator --> UserAPI

    AuthAPI --> PostgreSQL
    TodoAPI --> PostgreSQL
    TrashAPI --> PostgreSQL
    HolidayAPI --> PostgreSQL
    UserAPI --> PostgreSQL

    PostgreSQL --> Users
    PostgreSQL --> Todos
    PostgreSQL --> Holidays

    Users -.1:N.-> Todos
```

---

## 인증 흐름

```mermaid
sequenceDiagram
    participant U as 사용자
    participant F as 프론트엔드
    participant B as 백엔드 API
    participant DB as PostgreSQL

    Note over U,DB: 회원가입 플로우
    U->>F: 회원가입 정보 입력
    F->>B: POST /api/auth/register
    B->>B: 비밀번호 bcrypt 해싱
    B->>DB: 사용자 정보 저장
    DB-->>B: 저장 완료
    B-->>F: 201 Created (userId, email, username)
    F-->>U: 회원가입 성공

    Note over U,DB: 로그인 플로우
    U->>F: 로그인 정보 입력
    F->>B: POST /api/auth/login
    B->>DB: 이메일로 사용자 조회
    DB-->>B: 사용자 정보 반환
    B->>B: 비밀번호 검증
    B->>B: JWT Access Token 생성 (15분)
    B->>B: JWT Refresh Token 생성 (7일)
    B-->>F: 200 OK (accessToken, refreshToken, user)
    F->>F: 토큰을 LocalStorage에 저장
    F-->>U: 로그인 성공 → 메인 화면 이동

    Note over U,DB: 인증된 API 호출
    U->>F: 할일 목록 조회 요청
    F->>B: GET /api/todos + Authorization: Bearer {accessToken}
    B->>B: JWT 토큰 검증
    B->>DB: userId로 할일 조회
    DB-->>B: 할일 목록 반환
    B-->>F: 200 OK (할일 데이터)
    F-->>U: 할일 목록 표시

    Note over U,DB: 토큰 갱신 플로우
    U->>F: API 호출 (만료된 토큰)
    F->>B: GET /api/todos + Authorization: Bearer {expired-token}
    B-->>F: 401 Unauthorized (TOKEN_EXPIRED)
    F->>B: POST /api/auth/refresh {refreshToken}
    B->>B: Refresh Token 검증
    B->>B: 새 Access Token 생성
    B-->>F: 200 OK (new accessToken)
    F->>F: 새 토큰 저장
    F->>B: 원래 요청 재시도
    B-->>F: 200 OK (데이터)
    F-->>U: 화면 표시
```

---

## 할일 관리 플로우

```mermaid
flowchart TD
    Start([사용자]) --> Login{로그인 상태?}
    Login -->|No| LoginPage[로그인 페이지]
    LoginPage --> AuthAPI[POST /api/auth/login]
    AuthAPI --> SaveToken[토큰 저장]
    SaveToken --> MainPage

    Login -->|Yes| MainPage[할일 목록 화면]

    MainPage --> Action{사용자 액션}

    Action -->|조회| GetTodos[GET /api/todos]
    GetTodos --> DisplayList[할일 목록 표시]
    DisplayList --> MainPage

    Action -->|추가| CreateModal[할일 추가 모달]
    CreateModal --> ValidateInput{입력 검증}
    ValidateInput -->|실패| ShowError[에러 메시지 표시]
    ShowError --> CreateModal
    ValidateInput -->|성공| PostTodo[POST /api/todos]
    PostTodo --> DBInsert[(DB INSERT)]
    DBInsert --> RefreshList[목록 새로고침]
    RefreshList --> MainPage

    Action -->|수정| EditModal[할일 수정 모달]
    EditModal --> PutTodo[PUT /api/todos/:id]
    PutTodo --> DBUpdate[(DB UPDATE)]
    DBUpdate --> RefreshList

    Action -->|완료| CompleteTodo[PATCH /api/todos/:id/complete]
    CompleteTodo --> UpdateStatus[(status='completed', isCompleted=true)]
    UpdateStatus --> RefreshList

    Action -->|삭제| DeleteConfirm{삭제 확인}
    DeleteConfirm -->|취소| MainPage
    DeleteConfirm -->|확인| SoftDelete[DELETE /api/todos/:id]
    SoftDelete --> MoveToTrash[(status='deleted', deletedAt 기록)]
    MoveToTrash --> RefreshList

    Action -->|휴지통| TrashPage[휴지통 화면]
    TrashPage --> GetTrash[GET /api/trash]
    GetTrash --> DisplayTrash[삭제된 할일 표시]

    DisplayTrash --> TrashAction{휴지통 액션}
    TrashAction -->|복원| RestoreTodo[PATCH /api/todos/:id/restore]
    RestoreTodo --> RestoreStatus[(status='active', deletedAt=null)]
    RestoreStatus --> MainPage

    TrashAction -->|영구삭제| PermanentDelete[DELETE /api/trash/:id]
    PermanentDelete --> HardDelete[(DB DELETE)]
    HardDelete --> TrashPage
```

---

## 데이터 모델 관계도

```mermaid
erDiagram
    USERS ||--o{ TODOS : owns

    USERS {
        uuid user_id PK
        varchar email UK
        varchar password
        varchar username
        varchar role
        timestamp created_at
        timestamp updated_at
    }

    TODOS {
        uuid todo_id PK
        uuid user_id FK
        varchar title
        text content
        date start_date
        date due_date
        varchar status
        boolean is_completed
        timestamp created_at
        timestamp updated_at
        timestamp deleted_at
    }

    HOLIDAYS {
        uuid holiday_id PK
        varchar title
        date date
        text description
        boolean is_recurring
        timestamp created_at
        timestamp updated_at
    }
```

---

## API 엔드포인트 구조

```mermaid
graph LR
    subgraph "인증 API - /api/auth"
        A1[POST /register<br/>회원가입]
        A2[POST /login<br/>로그인]
        A3[POST /refresh<br/>토큰 갱신]
        A4[POST /logout<br/>로그아웃]
    end

    subgraph "할일 API - /api/todos"
        T1[GET /<br/>목록 조회]
        T2[POST /<br/>할일 추가]
        T3[GET /:id<br/>상세 조회]
        T4[PUT /:id<br/>할일 수정]
        T5[PATCH /:id/complete<br/>완료 처리]
        T6[DELETE /:id<br/>휴지통 이동]
        T7[PATCH /:id/restore<br/>복원]
    end

    subgraph "휴지통 API - /api/trash"
        TR1[GET /<br/>휴지통 조회]
        TR2[DELETE /:id<br/>영구 삭제]
    end

    subgraph "국경일 API - /api/holidays"
        H1[GET /<br/>국경일 조회]
        H2[POST /<br/>국경일 추가*]
        H3[PUT /:id<br/>국경일 수정*]
    end

    subgraph "사용자 API - /api/users"
        U1[GET /me<br/>프로필 조회]
        U2[PATCH /me<br/>프로필 수정]
    end

    style A1 fill:#e1f5ff
    style A2 fill:#e1f5ff
    style T1 fill:#fff4e1
    style T2 fill:#fff4e1
    style H2 fill:#ffe1e1
    style H3 fill:#ffe1e1
```

_* 관리자 전용 API_

---

## 프론트엔드 컴포넌트 구조

```mermaid
graph TD
    App[App.jsx] --> Router[React Router]

    Router --> PublicRoute[공개 라우트]
    Router --> PrivateRoute[인증 라우트]

    PublicRoute --> Login[LoginPage]
    PublicRoute --> Register[RegisterPage]

    PrivateRoute --> Layout[Layout]

    Layout --> Header[Header]
    Layout --> Main[Main Content]

    Main --> TodoList[TodoListPage]
    Main --> Trash[TrashPage]
    Main --> Holidays[HolidaysPage]
    Main --> Profile[ProfilePage]
    Main --> AdminHolidays[AdminHolidaysPage*]

    TodoList --> TodoCard[TodoCard 컴포넌트]
    TodoList --> TodoModal[TodoModal 컴포넌트]
    TodoList --> FilterBar[FilterBar 컴포넌트]

    TodoCard --> Button[Button 컴포넌트]
    TodoModal --> Input[Input 컴포넌트]
    TodoModal --> Button

    subgraph "상태 관리 - Zustand"
        AuthStore[authStore<br/>사용자, 토큰]
        TodoStore[todoStore<br/>할일 목록]
        UIStore[uiStore<br/>모달, 테마]
    end

    Login -.사용.-> AuthStore
    TodoList -.사용.-> TodoStore
    TodoList -.사용.-> UIStore

    style AdminHolidays fill:#ffe1e1
```

_* 관리자 전용 화면_

---

## 배포 아키텍처

```mermaid
graph TB
    subgraph "개발 환경"
        Dev[개발자]
        Git[GitHub Repository]
    end

    subgraph "CI/CD"
        GHA[GitHub Actions]
    end

    subgraph "프로덕션 환경"
        Vercel[Vercel]

        subgraph "프론트엔드"
            FE[React App<br/>CDN 배포]
        end

        subgraph "백엔드"
            BE[Express API<br/>Serverless Functions]
        end

        Supabase[Supabase<br/>PostgreSQL DB]
    end

    subgraph "사용자"
        Browser[웹 브라우저]
    end

    Dev -->|git push| Git
    Git -->|webhook| GHA
    GHA -->|자동 배포| Vercel
    Vercel --> FE
    Vercel --> BE
    BE -->|Connection Pool| Supabase

    Browser -->|HTTPS| FE
    FE -->|API 호출| BE

    style Vercel fill:#e1f5ff
    style Supabase fill:#e1ffe1
```

---

## 보안 레이어

```mermaid
graph TB
    Client[클라이언트 요청] -->|HTTPS| CloudFlare[Vercel Edge Network]
    CloudFlare -->|SSL/TLS| Express[Express.js]

    Express --> Helmet[Helmet<br/>보안 헤더]
    Helmet --> CORS[CORS 미들웨어<br/>Origin 검증]
    CORS --> RateLimit[Rate Limiting<br/>100 req/min]
    RateLimit --> JWTAuth[JWT 인증<br/>Bearer Token 검증]

    JWTAuth -->|인증 실패| Unauthorized[401 Unauthorized]
    JWTAuth -->|인증 성공| Authorization[권한 검증]

    Authorization -->|권한 없음| Forbidden[403 Forbidden]
    Authorization -->|권한 있음| Validator[입력 검증<br/>express-validator]

    Validator -->|검증 실패| BadRequest[400 Bad Request]
    Validator -->|검증 성공| SQLSafe[SQL Injection 방어<br/>Prepared Statements]

    SQLSafe --> XSSSafe[XSS 방어<br/>Input Sanitization]
    XSSSafe --> Controller[컨트롤러 로직]

    Controller -->|bcrypt 해싱| PasswordHash[비밀번호 암호화 저장]
    PasswordHash --> Database[(PostgreSQL)]

    style Helmet fill:#ffe1e1
    style CORS fill:#ffe1e1
    style RateLimit fill:#ffe1e1
    style JWTAuth fill:#ffe1e1
    style SQLSafe fill:#ffe1e1
    style XSSSafe fill:#ffe1e1
```

---

## 주요 컴포넌트 설명

### 프론트엔드
- **React 18**: 사용자 인터페이스 구성
- **Zustand**: 경량 상태 관리 (인증, 할일, UI 상태)
- **Axios**: HTTP 클라이언트, 인터셉터로 토큰 자동 첨부
- **Tailwind CSS**: 유틸리티 우선 스타일링
- **React Router v6**: SPA 라우팅
- **React Hook Form + Zod**: 폼 관리 및 검증

### 백엔드
- **Express.js**: REST API 서버
- **JWT**: Access Token (15분) + Refresh Token (7일)
- **bcrypt**: 비밀번호 해싱 (salt rounds: 10)
- **express-validator**: 요청 데이터 검증
- **Helmet**: 보안 HTTP 헤더 설정
- **CORS**: Cross-Origin 요청 제어
- **Rate Limiting**: API 호출 제한 (100 req/min)

### 데이터베이스
- **PostgreSQL 15+**: 관계형 데이터베이스
- **Supabase**: PostgreSQL 호스팅 및 관리
- **Connection Pooling**: 효율적인 DB 연결 관리
- **인덱싱**: userId, status, dueDate, deletedAt
- **트랜잭션**: 데이터 무결성 보장

### 배포 및 인프라
- **Vercel**: 프론트엔드 및 백엔드 호스팅
- **Serverless Functions**: 백엔드 API 배포
- **Environment Variables**: 환경 변수 관리
- **Edge Network**: 전 세계 CDN 배포

---

## 데이터 흐름 예시

### 할일 추가 프로세스
1. 사용자가 할일 추가 모달에서 정보 입력
2. React Hook Form + Zod로 클라이언트 측 검증
3. Axios가 `POST /api/todos` 요청 (Authorization 헤더 자동 첨부)
4. Express 미들웨어: JWT 검증 → Rate Limit 확인 → 입력 검증
5. 컨트롤러: userId 추출, 비즈니스 로직 처리
6. PostgreSQL: INSERT INTO todos 실행
7. 응답 반환: 201 Created + 생성된 할일 데이터
8. Zustand 스토어 업데이트
9. UI 자동 리렌더링 → 새 할일 표시

### 토큰 갱신 프로세스
1. API 호출 시 Access Token 만료 (401 Unauthorized)
2. Axios 인터셉터가 자동으로 감지
3. `POST /api/auth/refresh` 호출 (Refresh Token 전송)
4. 백엔드: Refresh Token 검증 후 새 Access Token 발급
5. 새 토큰을 LocalStorage에 저장
6. 원래 API 요청 재시도
7. 성공 응답 반환

---

## 성능 최적화 전략

### 프론트엔드
- **코드 스플리팅**: React.lazy()로 페이지별 분할
- **Lazy Loading**: 이미지 및 컴포넌트 지연 로딩
- **번들 최적화**: Vite의 트리 쉐이킹 및 압축
- **메모이제이션**: React.memo, useMemo, useCallback 활용

### 백엔드
- **인덱싱**: 자주 조회되는 컬럼에 인덱스 생성
- **쿼리 최적화**: JOIN 최소화, 필요한 컬럼만 SELECT
- **Connection Pool**: DB 연결 재사용
- **캐싱**: 국경일 데이터 메모리 캐싱 (선택)

### 데이터베이스
- **인덱스 전략**:
  - `idx_todos_user_status`: 사용자별 할일 조회
  - `idx_todos_due_date`: 만료일 정렬
  - `idx_todos_deleted_at`: 휴지통 조회
- **제약 조건**: CHECK 제약으로 데이터 무결성 보장

---

## 확장 가능성

### 수평 확장
- Vercel Serverless Functions: 자동 스케일링
- Stateless 아키텍처: 서버 간 세션 공유 불필요
- JWT 토큰: 별도 세션 저장소 불필요

### 수직 확장
- Supabase PostgreSQL: 플랜 업그레이드로 성능 향상
- 인덱싱 및 쿼리 최적화로 대용량 데이터 처리

### 기능 확장 (2차 개발)
- 알림 기능 추가 (이메일/푸시)
- 캘린더 뷰 추가
- 협업 기능 (할일 공유)
- 통계 및 리포트
- 모바일 앱 (React Native)

---

**문서 종료**
