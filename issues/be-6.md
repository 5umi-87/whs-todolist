## Todo (해야할 일)
- [ ] **국경일 조회 API**: `GET /api/holidays` (연도/월별 필터링)
- [ ] **국경일 추가/수정 API**: `POST /api/holidays`, `PUT /api/holidays/:id` (관리자 권한 체크)

## 완료 조건
- 모든 사용자가 국경일 조회를 할 수 있음
- 관리자(`role='admin'`)만 국경일 추가/수정이 가능하며, 일반 사용자 접근 시 403 에러가 반환됨

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
