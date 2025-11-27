# 스타일 가이드

> 구글 캘린더 UI를 참고한 디자인 시스템

## 1. 색상 팔레트

### 주요 색상
```css
--primary-green: #0B8043;      /* 이벤트 박스 주 색상 */
--primary-green-dark: #0A6E37; /* hover 상태 */
--primary-green-light: #E6F4EA; /* 배경 강조 */
```

### 기본 색상
```css
--background-white: #FFFFFF;   /* 메인 배경 */
--background-gray: #F8F9FA;    /* 사이드바 배경 */
--border-gray: #DADCE0;        /* 테두리/구분선 */
--border-light: #E8EAED;       /* 연한 구분선 */
```

### 텍스트 색상
```css
--text-primary: #202124;       /* 주 텍스트 */
--text-secondary: #5F6368;     /* 보조 텍스트 */
--text-disabled: #9AA0A6;      /* 비활성 텍스트 */
--text-white: #FFFFFF;         /* 흰색 텍스트 (이벤트 박스 내) */
```

### 인터랙티브 색상
```css
--hover-gray: #F1F3F4;         /* hover 배경 */
--active-blue: #1A73E8;        /* 선택/활성 상태 */
--focus-outline: #1A73E8;      /* 포커스 아웃라인 */
```

## 2. 타이포그래피

### 폰트 패밀리
```css
--font-primary: 'Roboto', 'Noto Sans KR', sans-serif;
--font-display: 'Google Sans', 'Noto Sans KR', sans-serif;
```

### 폰트 크기
```css
--font-size-xs: 11px;          /* 보조 정보 */
--font-size-sm: 12px;          /* 작은 텍스트 */
--font-size-base: 14px;        /* 기본 텍스트 */
--font-size-md: 16px;          /* 중간 제목 */
--font-size-lg: 20px;          /* 큰 제목 */
--font-size-xl: 24px;          /* 월/년도 표시 */
```

### 폰트 굵기
```css
--font-weight-regular: 400;    /* 일반 텍스트 */
--font-weight-medium: 500;     /* 강조 텍스트 */
--font-weight-bold: 700;       /* 제목 */
```

### 행간
```css
--line-height-tight: 1.2;      /* 제목 */
--line-height-normal: 1.5;     /* 본문 */
--line-height-relaxed: 1.75;   /* 여유 있는 본문 */
```

## 3. 간격 시스템

### 기본 간격
```css
--spacing-xs: 4px;
--spacing-sm: 8px;
--spacing-md: 12px;
--spacing-base: 16px;
--spacing-lg: 20px;
--spacing-xl: 24px;
--spacing-2xl: 32px;
--spacing-3xl: 48px;
```

### 컴포넌트별 패딩
```css
--padding-button: 8px 24px;
--padding-card: 16px;
--padding-section: 24px;
```

## 4. 레이아웃

### 컨테이너
```css
.calendar-container {
  display: grid;
  grid-template-columns: 256px 1fr;
  height: 100vh;
}
```

### 사이드바
```css
.sidebar {
  width: 256px;
  background: var(--background-gray);
  padding: var(--spacing-base);
  border-right: 1px solid var(--border-gray);
}
```

### 캘린더 그리드
```css
.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0;
  border: 1px solid var(--border-gray);
}

.calendar-cell {
  min-height: 120px;
  border: 1px solid var(--border-light);
  padding: var(--spacing-sm);
}
```

## 5. 컴포넌트

### 버튼

#### 주요 버튼
```css
.btn-primary {
  background: var(--primary-green);
  color: var(--text-white);
  padding: var(--padding-button);
  border-radius: 24px;
  font-weight: var(--font-weight-medium);
  border: none;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-primary:hover {
  background: var(--primary-green-dark);
}
```

#### 보조 버튼
```css
.btn-secondary {
  background: transparent;
  color: var(--text-primary);
  padding: var(--padding-button);
  border-radius: 4px;
  border: 1px solid var(--border-gray);
  cursor: pointer;
}

.btn-secondary:hover {
  background: var(--hover-gray);
}
```

#### 아이콘 버튼
```css
.btn-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-icon:hover {
  background: var(--hover-gray);
}
```

### 이벤트 박스
```css
.event-box {
  background: var(--primary-green);
  color: var(--text-white);
  padding: 4px 8px;
  border-radius: 4px;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  margin-bottom: 2px;
  cursor: pointer;
  transition: background 0.2s;
}

.event-box:hover {
  background: var(--primary-green-dark);
}
```

### 체크박스
```css
.checkbox {
  width: 18px;
  height: 18px;
  border: 2px solid var(--border-gray);
  border-radius: 2px;
  cursor: pointer;
}

.checkbox:checked {
  background: var(--active-blue);
  border-color: var(--active-blue);
}
```

### 날짜 셀
```css
.date-cell {
  padding: var(--spacing-sm);
  position: relative;
}

.date-number {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  font-weight: var(--font-weight-medium);
}

.date-cell.today .date-number {
  background: var(--active-blue);
  color: white;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
```

## 6. 그림자

```css
--shadow-sm: 0 1px 2px 0 rgba(60, 64, 67, 0.3);
--shadow-md: 0 1px 3px 0 rgba(60, 64, 67, 0.3),
             0 4px 8px 3px rgba(60, 64, 67, 0.15);
--shadow-lg: 0 2px 6px 2px rgba(60, 64, 67, 0.15),
             0 8px 16px 4px rgba(60, 64, 67, 0.15);
```

### 적용 예시
```css
.dropdown {
  box-shadow: var(--shadow-md);
}

.modal {
  box-shadow: var(--shadow-lg);
}
```

## 7. 둥근 모서리

```css
--radius-sm: 4px;             /* 작은 요소 */
--radius-md: 8px;             /* 중간 요소 */
--radius-lg: 12px;            /* 큰 요소 */
--radius-full: 9999px;        /* 완전 둥근 (버튼, 뱃지) */
```

## 8. 애니메이션

### 전환 효과
```css
--transition-fast: 0.15s ease;
--transition-base: 0.2s ease;
--transition-slow: 0.3s ease;
```

### 적용 예시
```css
.interactive-element {
  transition: all var(--transition-base);
}

.hover-effect:hover {
  transform: translateY(-1px);
  transition: transform var(--transition-fast);
}
```

## 9. 반응형 브레이크포인트

```css
--breakpoint-sm: 640px;       /* 모바일 */
--breakpoint-md: 768px;       /* 태블릿 */
--breakpoint-lg: 1024px;      /* 데스크탑 */
--breakpoint-xl: 1280px;      /* 큰 데스크탑 */
```

### 미디어 쿼리 예시
```css
@media (max-width: 768px) {
  .calendar-container {
    grid-template-columns: 1fr;
  }

  .sidebar {
    display: none;
  }
}
```

## 10. 아이콘 시스템

### 아이콘 크기
```css
--icon-xs: 16px;
--icon-sm: 20px;
--icon-md: 24px;
--icon-lg: 32px;
--icon-xl: 48px;
```

### 권장 아이콘 라이브러리
- Material Icons (Google)
- Material Symbols

## 11. 접근성 가이드

### 포커스 스타일
```css
:focus-visible {
  outline: 2px solid var(--focus-outline);
  outline-offset: 2px;
}
```

### 최소 터치 영역
- 모든 인터랙티브 요소는 최소 44px × 44px 크기 유지

### 색상 대비
- 텍스트와 배경 간 최소 4.5:1 대비율 유지
- 큰 텍스트(18px 이상)는 최소 3:1 대비율 유지

## 12. 사용 예시

### HTML 구조
```html
<div class="calendar-container">
  <aside class="sidebar">
    <button class="btn-primary">+ 만들기</button>
    <div class="calendar-list">
      <label class="calendar-item">
        <input type="checkbox" class="checkbox" checked>
        <span>내 캘린더</span>
      </label>
    </div>
  </aside>

  <main class="calendar-main">
    <div class="calendar-grid">
      <div class="date-cell today">
        <span class="date-number">1</span>
        <div class="event-box">크리스마스</div>
      </div>
    </div>
  </main>
</div>
```

## 13. 주의사항

1. **일관성 유지**: 모든 페이지에서 동일한 스타일 변수 사용
2. **접근성 우선**: 키보드 내비게이션과 스크린 리더 지원
3. **성능 고려**: 불필요한 애니메이션과 그림자 최소화
4. **모바일 최적화**: 터치 친화적인 UI 요소 크기 유지
5. **단순함**: 오버엔지니어링 지양, 필요한 스타일만 적용
