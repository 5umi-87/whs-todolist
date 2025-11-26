## Todo (해야할 일)
- [ ] **라우터 설정**: `react-router-dom`을 사용해 페이지 라우트(`/`, `/login`, `/register`, `/trash` 등) 설정
- [ ] **인증 라우트 가드**: 로그인해야 접근 가능한 페이지(Private Route)와 비로그인 시 접근하는 페이지(Public Route) 구현
- [ ] **공통 레이아웃**: `Header`, `Main` 영역을 포함하는 `MainLayout` 컴포넌트 구현

## 완료 조건
- URL에 따라 지정된 페이지 컴포넌트가 렌더링됨
- 로그인 상태에 따라 페이지 접근이 제어됨 (예: 비로그인 시 `/` 접근하면 `/login`으로 리다이렉트)
- 모든 페이지에 공통 헤더가 표시됨

## 기술적 고려사항
- React Router v6 문법 사용
- PrivateRoute 컴포넌트: authStore의 isAuthenticated 체크
- PublicRoute 컴포넌트: 로그인 시 메인으로 리다이렉트
- 레이아웃 컴포넌트: Outlet을 사용한 중첩 라우팅
- 404 페이지 구현

## 의존성
- Task FE-1

## 선행 작업
- Task FE-1: 프론트엔드 프로젝트 설정

## 후행 작업
- Task FE-3: 전역 상태 관리(Zustand) 및 API 서비스 설정
- Task FE-4: 공통 컴포넌트 구현
