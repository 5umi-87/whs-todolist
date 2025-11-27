const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();

// 보안 미들웨어
app.use(helmet());

// CORS 설정
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
};
app.use(cors(corsOptions));

// Rate limiting middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests from this IP, please try again later.'
    }
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
app.use(limiter);

// Body parser 미들웨어
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Import routes
const authRoutes = require('./routes/auth');
const todoRoutes = require('./routes/todos');
const trashRoutes = require('./routes/trash');

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

// Mount routes - authRoutes already includes full path (e.g. /api/auth/*, /api/users/*)
app.use('/api', authRoutes);
// Todo routes mounted at /api/todos to handle paths like /api/todos, /api/todos/:id
app.use('/api/todos', todoRoutes);
// Trash routes mounted at /api/trash to handle paths like /api/trash, /api/trash/:id
app.use('/api/trash', trashRoutes);

// Import error handler middleware
const { errorHandler } = require('./middlewares/errorHandler');

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

// 에러 핸들러 - should be the last middleware
app.use(errorHandler);

module.exports = app;
