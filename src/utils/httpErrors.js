function createHttpError(statusCode, message, details) {
  const error = new Error(message);
  error.statusCode = statusCode;

  if (details) {
    error.details = details;
  }

  return error;
}

function badRequestError(message) {
  return createHttpError(400, message);
}

function notFoundError(message) {
  return createHttpError(404, message);
}

function internalServerError(message, details) {
  return createHttpError(500, message, details);
}

module.exports = {
  badRequestError,
  notFoundError,
  internalServerError,
};
