function notFoundHandler(_request, _response, next) {
  const error = new Error("Route not found");
  error.statusCode = 404;
  next(error);
}

function errorHandler(error, _request, response, _next) {
  const statusCode = Number(error.statusCode || 500);

  response.status(statusCode).json({
    success: false,
    error: error.message || "Internal server error",
    statusCode,
    ...(error.details ? { details: error.details } : {}),
  });
}

module.exports = {
  notFoundHandler,
  errorHandler,
};
