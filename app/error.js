class HAError extends Error {}
class IllegalValueError extends HAError {}
class DeviceUnavailableError extends HAError {}
class InvalidateControlError extends HAError {}
class UnsupportedFeatureError extends HAError {}

module.exports = {
  HAError,
  IllegalValueError,
  DeviceUnavailableError,
  InvalidateControlError,
  UnsupportedFeatureError,
};