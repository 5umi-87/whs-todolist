const { jsonParser } = require('../src/middlewares/jsonParser');

// Mock Express request and response objects
const createReqRes = () => {
  const req = {
    headers: {},
    on: jest.fn((event, callback) => {
      if (event === 'data') req._dataCallback = callback;
      if (event === 'end') req._endCallback = callback;
    }),
    emit: jest.fn((event, data) => {
      if (event === 'data' && req._dataCallback) req._dataCallback(data);
      if (event === 'end' && req._endCallback) req._endCallback();
    }),
  };
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
  const next = jest.fn();
  return { req, res, next };
};

describe('JSON Parser Middleware', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should parse valid JSON in request body', (done) => {
    const { req, res, next } = createReqRes();
    req.headers = { 'content-type': 'application/json' };
    
    const middleware = jsonParser();
    middleware(req, res, next);
    
    // Simulate receiving JSON data
    req.emit('data', Buffer.from('{"name": "test", "value": 123}'));
    req.emit('end');
    
    setImmediate(() => {
      expect(req.body).toEqual({ name: 'test', value: 123 });
      expect(next).toHaveBeenCalled();
      done();
    });
  });

  test('should handle empty JSON body', (done) => {
    const { req, res, next } = createReqRes();
    req.headers = { 'content-type': 'application/json' };
    
    const middleware = jsonParser();
    middleware(req, res, next);
    
    // Simulate receiving no data
    req.emit('end');
    
    setImmediate(() => {
      expect(req.body).toEqual({});
      expect(next).toHaveBeenCalled();
      done();
    });
  });

  test('should return 400 for invalid JSON', (done) => {
    const { req, res, next } = createReqRes();
    req.headers = { 'content-type': 'application/json' };
    
    const middleware = jsonParser();
    middleware(req, res, next);
    
    // Simulate receiving invalid JSON
    req.emit('data', Buffer.from('{ invalid json }'));
    req.emit('end');
    
    setImmediate(() => {
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: {
          code: 'INVALID_JSON',
          message: 'Invalid JSON format in request body'
        }
      });
      expect(next).not.toHaveBeenCalled();
      done();
    });
  });

  test('should handle non-JSON content type', () => {
    const { req, res, next } = createReqRes();
    req.headers = { 'content-type': 'text/plain' };
    
    const middleware = jsonParser();
    middleware(req, res, next);
    
    // No data event should be triggered for non-JSON content
    expect(req.body).toEqual({});
    expect(next).toHaveBeenCalled();
  });

  test('should return 413 for payload too large', (done) => {
    const { req, res, next } = createReqRes();
    req.headers = { 'content-type': 'application/json' };
    
    const middleware = jsonParser({ limit: '10b' }); // 10 bytes limit
    middleware(req, res, next);
    
    // Send data larger than the limit (10 bytes)
    req.emit('data', Buffer.from('a'.repeat(11))); // 11 bytes
    req.emit('end');
    
    setImmediate(() => {
      expect(res.status).toHaveBeenCalledWith(413);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: {
          code: 'PAYLOAD_TOO_LARGE',
          message: 'Request payload is too large'
        }
      });
      expect(next).not.toHaveBeenCalled();
      done();
    });
  });
});