## Todo (해야할 일)
- [ ] 모든 페이지 및 컴포넌트에 Tailwind CSS를 사용해 반응형 스타일 적용 (모바일/데스크톱)
- [ ] `uiStore`와 `localStorage`를 활용해 다크모드/라이트모드 전환 기능 구현

## 완료 조건
- 브라우저 창 크기를 조절했을 때 레이아웃이 깨지지 않고 자연스럽게 변경됨
- 다크모드 전환 버튼 클릭 시 전체 테마가 즉시 변경되며, 새로고침해도 유지됨

## 기술적 고려사항
- Tailwind CSS 반응형 유틸리티: sm:, md:, lg:, xl:
- 모바일 우선 디자인 (Mobile First)
- 브레이크포인트: mobile(480px), tablet(768px), desktop(1024px)
- 다크모드: Tailwind CSS dark: 유틸리티 사용
- 시스템 설정 감지: window.matchMedia('(prefers-color-scheme: dark)')
- localStorage에 테마 설정 저장
- Header에 다크모드 토글 버튼 추가
- 다크모드 색상: 배경 #1A1A1A, 텍스트 #E5E5E5

## 의존성
- Task FE-6
- Task FE-7

## 선행 작업
- Task FE-6: 할일 관리 화면 구현
- Task FE-7: 휴지통 화면 구현

## 후행 작업
- 없음
