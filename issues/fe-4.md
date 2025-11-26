## Todo (해야할 일)
- [ ] `Button`, `Input`, `Modal`, `LoadingSpinner` 등 재사용 가능한 UI 컴포넌트 구현
- [ ] 각 컴포넌트는 다양한 상태(variant, size, disabled 등)를 지원

## 완료 조건
- Storybook 또는 별도 테스트 페이지에서 모든 공통 컴포넌트의 상태와 기능이 정상적으로 동작함을 확인

## 기술적 고려사항
- Tailwind CSS를 사용한 스타일링
- 컴포넌트 Props 타입 정의 (PropTypes 또는 TypeScript)
- variant 지원: primary, secondary, outline, ghost 등
- size 지원: sm, md, lg
- disabled, loading 상태 지원
- 접근성: aria-label, role 속성 추가
- lucide-react 아이콘 사용

**구현할 컴포넌트:**
- Button: 다양한 variant와 size
- Input: text, email, password, date 타입
- Modal: 헤더, 본문, 푸터 영역
- LoadingSpinner: 로딩 상태 표시
- Card: 할일 카드 레이아웃
- Badge: 상태 표시 배지

## 의존성
- Task FE-1

## 선행 작업
- Task FE-1: 프론트엔드 프로젝트 설정

## 후행 작업
- Task FE-5: 사용자 인증 화면 구현
- Task FE-6: 할일 관리 화면 구현
- Task FE-7: 휴지통 화면 구현
