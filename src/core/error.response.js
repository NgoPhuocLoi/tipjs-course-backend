const STATUS_CODE = {
  BAD_REQUEST: 400,
  FORBIDDEN: 403,
  CONFLICT: 409,
};

const REASON_STATUS_CODE = {
  BAD_REQUEST: "Bad Request",
  FORBIDDEN: "Forbidden",
  CONFLICT: "Conflict",
};

class ErrorResponse extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

class BadRequest extends ErrorResponse {
  constructor(
    message = REASON_STATUS_CODE.BAD_REQUEST,
    statusCode = STATUS_CODE.BAD_REQUEST
  ) {
    super(message, statusCode);
  }
}

class ConflictRequest extends ErrorResponse {
  constructor(
    message = REASON_STATUS_CODE.CONFLICT,
    statusCode = STATUS_CODE.CONFLICT
  ) {
    super(message, statusCode);
  }
}

module.exports = {
  BadRequest,
  ConflictRequest,
};
