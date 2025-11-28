/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enable dark mode with class strategy
  theme: {
    extend: {
      colors: {
        // 구글 캘린더 색상 체계
        primary: {
          main: '#0B8043',      // 구글 캘린더 그린
          light: '#E6F4EA',     // 밝은 그린 (배경 강조)
          dark: '#0A6E37',      // 어두운 그린 (호버)
        },
        // 기본 색상
        background: {
          white: '#FFFFFF',
          gray: '#F8F9FA',
        },
        border: {
          gray: '#DADCE0',
          light: '#E8EAED',
        },
        // 텍스트 색상
        text: {
          primary: '#202124',
          secondary: '#5F6368',
          disabled: '#9AA0A6',
          white: '#FFFFFF',
        },
        // 인터랙티브 색상
        hover: {
          gray: '#F1F3F4',
        },
        active: {
          blue: '#1A73E8',
        },
        // 상태 색상
        status: {
          active: '#FF7043',    // 진행중 (주황)
          completed: '#66BB6A', // 완료 (초록)
          deleted: '#BDBDBD',   // 삭제 (회색)
          overdue: '#E53935',   // 만료 (빨강)
        },
        holiday: '#E53935',     // 빨강
        // 다크모드
        dark: {
          background: '#1A1A1A',
          surface: '#2A2A2A',
          text: '#E5E5E5',
          textSecondary: '#A0A0A0',
        },
      },
      boxShadow: {
        // 구글 캘린더 그림자 스타일
        'google-sm': '0 1px 2px 0 rgba(60, 64, 67, 0.3)',
        'google-md': '0 1px 3px 0 rgba(60, 64, 67, 0.3), 0 4px 8px 3px rgba(60, 64, 67, 0.15)',
        'google-lg': '0 2px 6px 2px rgba(60, 64, 67, 0.15), 0 8px 16px 4px rgba(60, 64, 67, 0.15)',
      },
    },
  },
  plugins: [],
}