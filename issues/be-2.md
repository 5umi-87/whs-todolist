## Todo (해야할 일)
- [ ] **인증 미들웨어**: JWT 토큰을 검증하고 `req.user`에 사용자 정보를 주입하는 미들웨어 구현
- [ ] **에러 핸들링 미들웨어**: 모든 에러를 일관된 JSON 형식으로 처리하는 미들웨어 구현
- [ ] **CORS 및 보안 미들웨어**: `cors`, `helmet` 설정

## 완료 조건
- 각 미들웨어 함수가 `src/middlewares` 폴더에 작성됨
- `app.js`에 미들웨어가 순서에 맞게 적용됨
- 의도적으로 발생시킨 에러가 에러 핸들링 미들웨어에 의해 정상 처리됨

## 기술적 고려사항
- JWT 검증: jsonwebtoken 라이브러리 사용
- 에러 응답 형식: `{ success: false, error: { code, message } }`
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
