const ERROR_TYPE = {
  INVALIDATE_CONTROL_ORDER: 'INVALIDATE_CONTROL_ORDER',
  SERVICE_ERROR: 'SERVICE_ERROR',
  DEVICE_NOT_SUPPORT_FUNCTION: 'DEVICE_NOT_SUPPORT_FUNCTION',
  INVALIDATE_PARAMS: 'INVALIDATE_PARAMS',
  DEVICE_IS_NOT_EXIST: 'DEVICE_IS_NOT_EXIST',
  IOT_DEVICE_OFFLINE: 'IOT_DEVICE_OFFLINE',
  ACCESS_TOKEN_INVALIDATE: 'ACCESS_TOKEN_INVALIDATE'
}

const ERROR_MESSAGE = {
  INVALIDATE_CONTROL_ORDER: 'invalidate control order',
  SERVICE_ERROR: 'unknow service error',
  DEVICE_NOT_SUPPORT_FUNCTION: 'device not support',
  INVALIDATE_PARAMS: 'invalidate params',
  DEVICE_IS_NOT_EXIST: 'device is not exist',
  IOT_DEVICE_OFFLINE: 'device is offline',
  ACCESS_TOKEN_INVALIDATE: 'access_token is invalidate'
}

class TmbotError extends Error {
  constructor(type, message) {
    super();

    if (ERROR_TYPE[errorCode] === undefined) {
      errorCode = ERROR_TYPE.SERVICE_ERROR;
    }

    if (message === undefined) {
      message = ERROR_MESSAGE[errorCode];
    }

    this.deviceId = deviceId;
    this.errorCode = errorCode;
    this.message = message;
  }

  serialize() {
    return {
      errorCode: this.errorCode,
      message: this.message
    };
  }
}

class NotSupportError extends TmbotError {
  constructor(message = 'invalidate control order') {
    super('INVALIDATE_CONTROL_ORDER');
  }
}