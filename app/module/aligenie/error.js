class AliGenieError extends Error {
  constructor(errorCode = 'SERVICE_ERROR', message = 'unknown service error') {
    super();
    this.message = message;
    this.errorCode = errorCode;
  }

  serialize() {
    return {
      errorCode: this.errorCode,
      message: this.message
    };
  }
}

class InvalidateControlError extends AliGenieError {
  constructor(message = 'invalidate control order') {
    super('INVALIDATE_CONTROL_ORDER', message);
  }
}

class InvalidParamsError extends AliGenieError {
  constructor(message = 'invalidate params') {
    super('INVALIDATE_PARAMS', message);
  }
}

class InvalidTokenError extends AliGenieError {
  constructor(message = 'access_token is invalidate') {
    super('ACCESS_TOKEN_INVALIDATE', message);
  }
}

class DeviceNotSupportError extends AliGenieError {
  constructor(message = 'device not support') {
    super('DEVICE_NOT_SUPPORT_FUNCTION', message);
  }
}

class DeviceNotExistError extends AliGenieError {
  constructor(message = 'device is not exist') {
    super('DEVICE_IS_NOT_EXIST', message);
  }
}

class DeviceNotAvailableError extends AliGenieError {
  constructor(message = 'device is offline') {
    super('IOT_DEVICE_OFFLINE', message);
  }
}

class ServerOfflineError extends AliGenieError {
  constructor(message = 'server is offline') {
    super('SERVICE_ERROR', message);
  }
}

class UnknownError extends AliGenieError {}

module.exports = {
  AliGenieError,
  InvalidateControlError,
  InvalidParamsError,
  InvalidTokenError,
  DeviceNotSupportError,
  DeviceNotExistError,
  DeviceNotAvailableError,
  ServerOfflineError,
  UnknownError
};