class HAError extends Error {}

class UnsupportedFeatureError extends HAError {}

class IllegalValueError extends HAError {}

module.exports = {
  HAError,
  IllegalValueError,
  UnsupportedFeatureError
};