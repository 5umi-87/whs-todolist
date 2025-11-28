-- ============================================
-- WHS-TodoList Database Schema
-- ============================================
-- 버전: 1.0
-- 작성일: 2025-11-26
-- DBMS: PostgreSQL 15+
-- 참조: docs/6-erd.md
-- ============================================

-- ============================================
-- 1. UUID 확장 활성화
-- ============================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 2. 테이블 생성
-- ============================================

-- --------------------------------------------
-- 2.1 User 테이블 (사용자)
-- --------------------------------------------
CREATE TABLE users (
  user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  username VARCHAR(100) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'user',
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX idx_users_role ON users(role);

-- 코멘트 추가
COMMENT ON TABLE users IS '사용자 정보 테이블';
COMMENT ON COLUMN users.user_id IS '사용자 고유 ID';
COMMENT ON COLUMN users.email IS '로그인 이메일 (고유)';
COMMENT ON COLUMN users.password IS 'bcrypt 해시된 비밀번호';
COMMENT ON COLUMN users.username IS '사용자 이름';
COMMENT ON COLUMN users.role IS '사용자 역할 (user, admin) - VARCHAR(20) 타입 사용';
COMMENT ON COLUMN users.created_at IS '가입일시';
COMMENT ON COLUMN users.updated_at IS '최종 수정일시';

-- --------------------------------------------
-- 2.2 Todo 테이블 (할일)
-- --------------------------------------------
CREATE TABLE todos (
  todo_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  content TEXT,
  start_date DATE,
  due_date DATE,
  status VARCHAR(20) NOT NULL DEFAULT 'active',
  is_completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMP,
  CONSTRAINT chk_due_date CHECK (due_date IS NULL OR start_date IS NULL OR due_date >= start_date)
);

-- 인덱스 생성
CREATE INDEX idx_todos_user_status ON todos(user_id, status);
CREATE INDEX idx_todos_due_date ON todos(due_date);
CREATE INDEX idx_todos_deleted_at ON todos(deleted_at);

-- 코멘트 추가
COMMENT ON TABLE todos IS '할일 정보 테이블';
COMMENT ON COLUMN todos.todo_id IS '할일 고유 ID';
COMMENT ON COLUMN todos.user_id IS '소유자 ID (외래키)';
COMMENT ON COLUMN todos.title IS '할일 제목 (필수)';
COMMENT ON COLUMN todos.content IS '할일 상세 내용';
COMMENT ON COLUMN todos.start_date IS '시작일';
COMMENT ON COLUMN todos.due_date IS '만료일';
COMMENT ON COLUMN todos.status IS '할일 상태 (active, completed, deleted) - VARCHAR(20) 타입 사용';
COMMENT ON COLUMN todos.is_completed IS '완료 여부';
COMMENT ON COLUMN todos.created_at IS '생성일시';
COMMENT ON COLUMN todos.updated_at IS '최종 수정일시';
COMMENT ON COLUMN todos.deleted_at IS '삭제일시 (소프트 삭제)';

-- --------------------------------------------
-- 2.3 Holiday 테이블 (국경일)
-- --------------------------------------------
CREATE TABLE holidays (
  holiday_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(100) NOT NULL,
  date DATE NOT NULL,
  description TEXT,
  is_recurring BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX idx_holidays_date ON holidays(date);

-- 코멘트 추가
COMMENT ON TABLE holidays IS '국경일 정보 테이블';
COMMENT ON COLUMN holidays.holiday_id IS '국경일 고유 ID';
COMMENT ON COLUMN holidays.title IS '국경일 이름';
COMMENT ON COLUMN holidays.date IS '국경일 날짜';
COMMENT ON COLUMN holidays.description IS '국경일 설명';
COMMENT ON COLUMN holidays.is_recurring IS '매년 반복 여부';
COMMENT ON COLUMN holidays.created_at IS '생성일시';
COMMENT ON COLUMN holidays.updated_at IS '최종 수정일시';

-- ============================================
-- 3. 트리거 함수 및 트리거 생성
-- ============================================

-- --------------------------------------------
-- 3.1 updated_at 자동 업데이트 함수
-- --------------------------------------------
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION update_updated_at_column() IS 'updated_at 컬럼을 현재 시각으로 자동 업데이트';

-- --------------------------------------------
-- 3.2 트리거 생성
-- --------------------------------------------

-- User 테이블 트리거
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Todo 테이블 트리거
CREATE TRIGGER update_todos_updated_at
    BEFORE UPDATE ON todos
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Holiday 테이블 트리거
CREATE TRIGGER update_holidays_updated_at
    BEFORE UPDATE ON holidays
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 4. 초기 데이터 삽입
-- ============================================

-- --------------------------------------------
-- 4.1 관리자 계정 생성
-- --------------------------------------------
-- 비밀번호: admin123 (bcrypt 해시: $2b$10$7Z9QXZvZQ3ZxZ3Z3Z3Z3ZOY5gZQJ8Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3)
-- 실제 운영 환경에서는 bcrypt로 해시된 비밀번호를 사용해야 합니다.
INSERT INTO users (email, password, username, role)
VALUES (
  'admin@whs-todolist.com',
  '$2b$10$YourActualBcryptHashHere',  -- 실제 bcrypt 해시로 교체 필요
  '관리자',
  'admin'
);

-- --------------------------------------------
-- 4.2 국경일 초기 데이터 (2025년 기준)
-- --------------------------------------------
INSERT INTO holidays (title, date, description, is_recurring) VALUES
('신정', '2025-01-01', '새해 첫날', true),
('설날 연휴', '2025-01-28', '설날 전날', true),
('설날', '2025-01-29', '음력 1월 1일', true),
('설날 연휴', '2025-01-30', '설날 다음날', true),
('삼일절', '2025-03-01', '3.1 독립운동 기념일', true),
('어린이날', '2025-05-05', '어린이날', true),
('부처님오신날', '2025-05-05', '음력 4월 8일', true),
('현충일', '2025-06-06', '현충일', true),
('광복절', '2025-08-15', '광복절', true),
('개천절', '2025-10-03', '개천절', true),
('추석 연휴', '2025-10-05', '추석 전날', true),
('추석', '2025-10-06', '음력 8월 15일', true),
('추석 연휴', '2025-10-07', '추석 다음날', true),
('한글날', '2025-10-09', '한글날', true),
('성탄절', '2025-12-25', '크리스마스', true);

-- ============================================
-- 5. Row Level Security (RLS) 설정
-- ============================================

-- --------------------------------------------
-- 5.1 RLS 활성화
-- --------------------------------------------

-- users 테이블 RLS 활성화
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- todos 테이블 RLS 활성화
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;

-- holidays 테이블 RLS 활성화
ALTER TABLE holidays ENABLE ROW LEVEL SECURITY;

-- --------------------------------------------
-- 5.2 Users 테이블 RLS 정책
-- --------------------------------------------

-- 사용자는 자신의 정보만 조회 가능
CREATE POLICY users_select_policy ON users
    FOR SELECT
    USING (user_id = current_setting('app.current_user_id')::UUID);

-- 사용자는 자신의 정보만 수정 가능
CREATE POLICY users_update_policy ON users
    FOR UPDATE
    USING (user_id = current_setting('app.current_user_id')::UUID);

-- 신규 사용자 생성은 모두 허용 (회원가입)
CREATE POLICY users_insert_policy ON users
    FOR INSERT
    WITH CHECK (true);

-- --------------------------------------------
-- 5.3 Todos 테이블 RLS 정책
-- --------------------------------------------

-- 사용자는 자신의 할일만 조회 가능
CREATE POLICY todos_select_policy ON todos
    FOR SELECT
    USING (user_id = current_setting('app.current_user_id')::UUID);

-- 사용자는 자신의 할일만 생성 가능
CREATE POLICY todos_insert_policy ON todos
    FOR INSERT
    WITH CHECK (user_id = current_setting('app.current_user_id')::UUID);

-- 사용자는 자신의 할일만 수정 가능
CREATE POLICY todos_update_policy ON todos
    FOR UPDATE
    USING (user_id = current_setting('app.current_user_id')::UUID);

-- 사용자는 자신의 할일만 삭제 가능
CREATE POLICY todos_delete_policy ON todos
    FOR DELETE
    USING (user_id = current_setting('app.current_user_id')::UUID);

-- --------------------------------------------
-- 5.4 Holidays 테이블 RLS 정책
-- --------------------------------------------

-- 모든 인증된 사용자가 국경일 조회 가능
CREATE POLICY holidays_select_policy ON holidays
    FOR SELECT
    USING (true);

-- 관리자만 국경일 생성 가능
CREATE POLICY holidays_insert_policy ON holidays
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM users
            WHERE user_id = current_setting('app.current_user_id')::UUID
            AND role = 'admin'
        )
    );

-- 관리자만 국경일 수정 가능
CREATE POLICY holidays_update_policy ON holidays
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE user_id = current_setting('app.current_user_id')::UUID
            AND role = 'admin'
        )
    );

-- 국경일 삭제는 불가 (요구사항에 따라 삭제 정책 없음)

-- ============================================
-- 6. 데이터베이스 확인 쿼리
-- ============================================

-- 테이블 목록 조회
-- SELECT tablename FROM pg_tables WHERE schemaname = 'public';

-- 테이블 구조 확인
-- \d users
-- \d todos
-- \d holidays

-- 인덱스 확인
-- SELECT indexname, tablename FROM pg_indexes WHERE schemaname = 'public';

-- 외래키 제약 확인
-- SELECT
--     tc.table_name,
--     kcu.column_name,
--     ccu.table_name AS foreign_table_name,
--     ccu.column_name AS foreign_column_name
-- FROM information_schema.table_constraints AS tc
-- JOIN information_schema.key_column_usage AS kcu
--     ON tc.constraint_name = kcu.constraint_name
-- JOIN information_schema.constraint_column_usage AS ccu
--     ON ccu.constraint_name = tc.constraint_name
-- WHERE tc.constraint_type = 'FOREIGN KEY';

-- ============================================
-- 7. 스키마 삭제 (개발용)
-- ============================================
-- 주의: 모든 데이터가 삭제됩니다!
-- DROP TABLE IF EXISTS todos CASCADE;
-- DROP TABLE IF EXISTS holidays CASCADE;
-- DROP TABLE IF EXISTS users CASCADE;
-- DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- ============================================
-- 문서 종료
-- ============================================
