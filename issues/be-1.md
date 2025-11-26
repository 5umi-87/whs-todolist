## Todo (해야할 일)
- [ ] Node.js, Express 프로젝트 초기화 (`package.json`)
- [ ] `src` 디렉토리 및 `controllers`, `services`, `repositories`, `middlewares`, `routes`, `utils`, `config` 폴더 구조 생성
- [ ] `ESLint`, `Prettier` 설정
- [ ] 필수 라이브러리 설치 (`express`, `jsonwebtoken`, `bcrypt`, `cors`, `helmet`, `express-validator`, `pg`)

## 완료 조건
- `npm install` 명령어로 모든 의존성 설치가 정상적으로 완료됨
- `npm run dev` 명령어로 Express 서버가 로컬에서 실행됨
- `lint` 및 `format` 스크립트가 정상 동작함

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
