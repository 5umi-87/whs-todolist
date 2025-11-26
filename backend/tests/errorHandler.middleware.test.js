const { errorHandler } = require('../src/middlewares/errorHandler');

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

describe('Error Handler Middleware', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    console.error = jest.fn(); // Mock console.error to avoid console output during tests
  });

  test('should handle error with default status code 500', () => {
    const { req, res, next } = createReqRes();
    const error = new Error('Test error');
    
    errorHandler(error, req, res, next);
    
    expect(console.error).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Test error'
      }
    });
  });

  test('should handle error with custom status code', () => {
    const { req, res, next } = createReqRes();
    const error = new Error('Not found error');
    error.status = 404;
    
    errorHandler(error, req, res, next);
    
    expect(console.error).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Not found error'
      }
    });
  });

  test('should handle error with custom status code using statusCode property', () => {
    const { req, res, next } = createReqRes();
    const error = new Error('Custom status error');
    error.statusCode = 422;
    
    errorHandler(error, req, res, next);
    
    expect(console.error).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(422);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Custom status error'
      }
    });
  });

  test('should handle error with custom code', () => {
    const { req, res, next } = createReqRes();
    const error = new Error('Database error');
    error.status = 500;
    error.code = 'DATABASE_ERROR';
    
    errorHandler(error, req, res, next);
    
    expect(console.error).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: {
        code: 'DATABASE_ERROR',
        message: 'Database error'
      }
    });
  });

  test('should handle error without message', () => {
    const { req, res, next } = createReqRes();
    const error = {};

    errorHandler(error, req, res, next);

    expect(console.error).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Internal server error'
      }
    });
  });
});