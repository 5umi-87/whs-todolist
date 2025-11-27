/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          main: '#00C73C',      // 네이버 그린
          light: '#00E047',     // 밝은 그린 (다크모드)
          dark: '#00A032',      // 어두운 그린 (호버)
        },
        status: {
          active: '#FF7043',    // 진행중 (주황)
          completed: '#66BB6A', // 완료 (초록)
          deleted: '#BDBDBD',   // 삭제 (회색)
          overdue: '#E53935',   // 만료 (빨강)
        },
        holiday: '#E53935',     // 빨강
        dark: {
          background: '#1A1A1A',
          surface: '#2A2A2A',
          text: '#E5E5E5',
          textSecondary: '#A0A0A0',
        },
      }
    },
  },
  plugins: [],
}