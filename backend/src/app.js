const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const app = express();

// 보안 미들웨어
app.use(helmet());

// CORS 설정
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
};
app.use(cors(corsOptions));

// Body parser 미들웨어
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check 엔드포인트
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// API 기본 라우트
app.get('/api', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'WHS-TodoList API Server',
    version: '1.0.0',
  });
});

// 404 핸들러
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: 'Requested resource not found',
    },
  });
});

// 에러 핸들러
app.use((err, req, res, _next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    error: {
      code: err.code || 'INTERNAL_ERROR',
      message: err.message || 'Internal server error',
    },
  });
});

module.exports = app;
