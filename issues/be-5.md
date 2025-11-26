## Todo (해야할 일)
- [ ] **휴지통 조회 API**: `GET /api/trash`
- [ ] **영구 삭제 API**: `DELETE /api/trash/:id`

## 완료 조건
- `status`가 `deleted`인 할일만 휴지통 조회 API에서 반환됨
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
