## Todo (해야할 일)
- [x] `users` 테이블 생성
- [x] `todos` 테이블 생성
- [x] `holidays` 테이블 생성
- [x] 각 테이블에 필요한 제약조건(PK, FK, UNIQUE, CHECK) 및 인덱스 설정
- [x] RLS(Row Level Security) 정책 설정 (사용자는 자신의 데이터만 접근)

## 완료 조건
- `database/schema.sql` 파일에 최종 DDL 스크립트가 작성됨
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
