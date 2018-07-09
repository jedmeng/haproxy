class HAError extends Error {}

class UnsupportedFeatureError extends HAError {}

class IllegalValueError extends HAError {}

class InvalidateControlError extends HAError {}

module.exports = {
  HAError,
  IllegalValueError,
  InvalidateControlError,
  UnsupportedFeatureError
};