const { auth } = require('../src/middlewares/auth');
const jwt = require('jsonwebtoken');

// Mock Express request and response objects
const createReqRes = () => {
  const req = {};
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
  const next = jest.fn();
  return { req, res, next };
};

describe('Auth Middleware', () => {
  const mockUser = {
    userId: 'test-user-id',
    email: 'test@example.com',
    username: 'Test User',
    role: 'user',
  };

  const validToken = jwt.sign(
    { 
      userId: mockUser.userId, 
      email: mockUser.email, 
      username: mockUser.username,
      role: mockUser.role
    },
    process.env.JWT_SECRET || 'default_secret',
    { expiresIn: '1h' }
  );

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = 'default_secret';
  });

  test('should allow request with valid Bearer token', async () => {
    const { req, res, next } = createReqRes();
    req.headers = { authorization: `Bearer ${validToken}` };

    await auth(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.user).toEqual(mockUser);
  });

  test('should return 401 if no authorization header is provided', async () => {
    const { req, res, next } = createReqRes();
    req.headers = {};

    await auth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Authorization token is required'
      }
    });
    expect(next).not.toHaveBeenCalled();
  });

  test('should return 401 if authorization header does not start with Bearer', async () => {
    const { req, res, next } = createReqRes();
    req.headers = { authorization: 'InvalidToken' };

    await auth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Authorization token is required'
      }
    });
    expect(next).not.toHaveBeenCalled();
  });

  test('should return 401 for invalid token', async () => {
    const { req, res, next } = createReqRes();
    req.headers = { authorization: 'Bearer invalid.token.here' };

    await auth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: {
        code: 'INVALID_TOKEN',
        message: 'Invalid authorization token'
      }
    });
    expect(next).not.toHaveBeenCalled();
  });

  test('should return 401 for expired token', async () => {
    // Create an expired token
    const expiredToken = jwt.sign(
      { 
        userId: mockUser.userId, 
        email: mockUser.email, 
        username: mockUser.username,
        role: mockUser.role
      },
      process.env.JWT_SECRET || 'default_secret',
      { expiresIn: '-1h' } // Expired token
    );

    const { req, res, next } = createReqRes();
    req.headers = { authorization: `Bearer ${expiredToken}` };

    await auth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: {
        code: 'TOKEN_EXPIRED',
        message: 'Token has expired'
      }
    });
    expect(next).not.toHaveBeenCalled();
  });
});