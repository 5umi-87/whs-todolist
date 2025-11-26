const jsonParser = (options = {}) => {
  // Use Express built-in JSON parser with custom error handling
  return (req, res, next) => {
    // Set a default limit if not specified
    const limit = options.limit || '100kb';

    // Create a buffer to hold the request data
    let data = '';
    let receivedLength = 0;
    let hasError = false;

    // Only apply to JSON content type
    if (req.headers['content-type'] && req.headers['content-type'].includes('application/json')) {
      req.on('data', chunk => {
        receivedLength += chunk.length;

        // Check if we exceed the limit
        if (receivedLength > (typeof limit === 'string' ? parseBytes(limit) : limit)) {
          hasError = true;
          return res.status(413).json({
            success: false,
            error: {
              code: 'PAYLOAD_TOO_LARGE',
              message: 'Request payload is too large'
            }
          });
        }

        data += chunk.toString();
      });

      req.on('end', () => {
        if (hasError) return; // Don't proceed if we already responded with an error

        try {
          // Attempt to parse JSON
          if (data) {
            req.body = JSON.parse(data);
          } else {
            req.body = {};
          }
          next();
        } catch (error) {
          // Handle JSON parsing errors
          if (error instanceof SyntaxError) {
            hasError = true;
            return res.status(400).json({
              success: false,
              error: {
                code: 'INVALID_JSON',
                message: 'Invalid JSON format in request body'
              }
            });
          }
          next(error);
        }
      });
    } else {
      // If not JSON content type, proceed to next middleware
      req.body = {};
      next();
    }
  };
};

// Helper function to parse a byte string to bytes
function parseBytes(bytesString) {
  const matches = /^(\d+)(b|kb|mb|gb)$/.exec(bytesString.toLowerCase());
  if (!matches) return parseInt(bytesString, 10) || 0;

  const size = parseInt(matches[1], 10);
  const unit = matches[2];

  switch (unit) {
    case 'kb': return size * 1024;
    case 'mb': return size * 1024 * 1024;
    case 'gb': return size * 1024 * 1024 * 1024;
    default: return size;
  }
}

module.exports = { jsonParser };