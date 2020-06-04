class ExtendableError extends Error {
  constructor(message, status, isPublic, errors) {
    super(message);
    this.name = this.constructor.name;
    this.message = message;
    this.status = status;
    this.errors = errors;
    this.isPublic = isPublic;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor.name);
  }
}

class APIError extends ExtendableError {
  constructor(message, status = 500, isPublic = false, errors) {
    super(message, status, isPublic, errors);
  }
}

module.exports = APIError;
