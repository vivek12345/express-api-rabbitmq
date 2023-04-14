// responseHelper.js

function successResponse(data, statusCode = 200) {
  return {
    status: 'success',
    statusCode,
    data,
  };
}

function errorResponse(errors, statusCode = 400) {
  return {
    status: 'error',
    statusCode,
    errors,
  };
}

function sendErrorResponse(res, errors, statusCode = 400) {
  const response = errorResponse(errors, statusCode);
  res.status(statusCode).json(response);
}

module.exports = {
  successResponse,
  errorResponse,
  sendErrorResponse,
};
