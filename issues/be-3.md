## Todo (해야할 일)
- [ ] **회원가입 API**: `POST /api/auth/register` (비밀번호 `bcrypt` 해싱)
- [ ] **로그인 API**: `POST /api/auth/login` (JWT Access/Refresh Token 발급)
- [ ] **토큰 갱신 API**: `POST /api/auth/refresh`
- [ ] **로그아웃 API**: `POST /api/auth/logout` (Refresh Token 무효화 처리 - 선택)
- [ ] **사용자 프로필 조회/수정 API**: `GET /api/users/me`, `PATCH /api/users/me`

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
