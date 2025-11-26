## Todo (해야할 일)
- [ ] **할일 생성/조회/수정 API**: `POST /api/todos`, `GET /api/todos`, `GET /api/todos/:id`, `PUT /api/todos/:id`
- [ ] **할일 완료/복원 API**: `PATCH /api/todos/:id/complete`, `PATCH /api/todos/:id/restore`
- [ ] **할일 삭제(소프트 삭제) API**: `DELETE /api/todos/:id`
- [ ] **비즈니스 로직 적용**: 자신의 할일만 접근, 날짜 유효성 검사 등

## 완료 조건
- Postman을 통해 모든 할일 API가 명세대로 동작함을 확인
- 다른 사용자의 할일 접근 시 403 Forbidden 에러가 반환됨
- 삭제 시 `status`가 `deleted`로 변경되고 `deleted_at`이 기록됨

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
