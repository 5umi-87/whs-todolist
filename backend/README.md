# WHS-TodoList Backend

백엔드 API 서버 for WHS-TodoList 애플리케이션

## 기술 스택

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: PostgreSQL (Supabase)
- **Authentication**: JWT (jsonwebtoken)
- **Security**: bcrypt, helmet, cors
- **Validation**: express-validator
- **Development**: nodemon, ESLint, Prettier

## 프로젝트 구조

```
backend/
├── src/
│   ├── controllers/      # HTTP 요청/응답 처리
│   ├── services/         # 비즈니스 로직
│   ├── repositories/     # 데이터베이스 액세스
│   ├── middlewares/      # 미들웨어 (인증, 검증, 에러 처리)
│   ├── routes/           # 라우트 정의
│   ├── utils/            # 유틸리티 함수
│   ├── config/           # 설정 파일
│   ├── app.js            # Express 앱 설정
│   └── server.js         # 서버 진입점
├── .env                  # 환경 변수 (Git 제외)
├── .env.example          # 환경 변수 예시
├── .eslintrc.json        # ESLint 설정
├── .prettierrc           # Prettier 설정
└── package.json
```

## 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env.example` 파일을 복사하여 `.env` 파일을 생성하고 필요한 값을 설정합니다.

```bash
cp .env.example .env
```

필수 환경 변수:
- `PORT`: 서버 포트 (기본: 3000)
- `DATABASE_URL`: PostgreSQL 연결 문자열
- `JWT_SECRET`: JWT 서명 키 (최소 32자)
- `CORS_ORIGIN`: CORS 허용 Origin

### 3. 서버 실행

#### 개발 모드 (nodemon 자동 재시작)
```bash
npm run dev
```

#### 프로덕션 모드
```bash
npm start
```

### 4. 헬스 체크

서버가 정상적으로 실행되면 다음 엔드포인트로 확인할 수 있습니다:

- Health Check: `http://localhost:3000/health`
- API Info: `http://localhost:3000/api`

## 개발 스크립트

| 스크립트 | 설명 |
|---------|------|
| `npm start` | 프로덕션 서버 실행 |
| `npm run dev` | 개발 서버 실행 (nodemon) |
| `npm run lint` | ESLint 코드 검사 |
| `npm run lint:fix` | ESLint 자동 수정 |
| `npm run format` | Prettier 포맷팅 |
| `npm run format:check` | Prettier 검증 |

## API 명세

API 상세 명세는 `swagger/swagger.json` 파일을 참조하세요.

### 주요 엔드포인트

- **인증**: `/api/auth/*`
  - `POST /api/auth/register` - 회원가입
  - `POST /api/auth/login` - 로그인
  - `POST /api/auth/refresh` - 토큰 갱신
  - `POST /api/auth/logout` - 로그아웃

- **할일**: `/api/todos/*`
  - `GET /api/todos` - 할일 목록 조회
  - `POST /api/todos` - 할일 생성
  - `GET /api/todos/:id` - 할일 상세 조회
  - `PUT /api/todos/:id` - 할일 수정
  - `DELETE /api/todos/:id` - 할일 삭제 (휴지통 이동)
  - `PATCH /api/todos/:id/complete` - 할일 완료
  - `PATCH /api/todos/:id/restore` - 할일 복원

- **휴지통**: `/api/trash/*`
  - `GET /api/trash` - 휴지통 조회
  - `DELETE /api/trash/:id` - 영구 삭제

- **국경일**: `/api/holidays/*`
  - `GET /api/holidays` - 국경일 조회
  - `POST /api/holidays` - 국경일 추가 (관리자)
  - `PUT /api/holidays/:id` - 국경일 수정 (관리자)

- **사용자**: `/api/users/*`
  - `GET /api/users/me` - 프로필 조회
  - `PATCH /api/users/me` - 프로필 수정

## 보안

- HTTPS 통신 권장
- JWT 토큰 기반 인증
- bcrypt 비밀번호 해싱 (salt rounds: 10)
- helmet을 통한 보안 헤더 설정
- CORS 정책 적용
- SQL Injection 방어 (Prepared Statements)
- XSS 방어 (입력 검증)

## 라이선스

ISC
