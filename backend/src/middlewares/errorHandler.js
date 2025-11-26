const errorHandler = (err, req, res, next) => {
  // Log error for debugging
  console.error(err.stack);

  // Determine status code based on error properties
  const statusCode = err.status || err.statusCode || 500;

  // Format error response according to API specification
  const errorResponse = {
    success: false,
    error: {
      code: err.code || 'INTERNAL_ERROR',
      message: err.message || 'Internal server error'
    }
  };

  // Set status and send JSON response
  res.status(statusCode).json(errorResponse);
};

module.exports = { errorHandler };