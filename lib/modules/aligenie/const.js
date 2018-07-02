const DeviceConst = require('../../device/const');

module.exports.TypeMap = {
  light: 'light',
  switch: 'switch'
};

module.exports.FeatureMap = {
  [DeviceConst.FEATURE_TURN_ON]: ['TurnOn'],
  [DeviceConst.FEATURE_TURN_OFF]: ['TurnOff'],
  [DeviceConst.FEATURE_BRIGHTNESS]: ['SetBrightness', 'AdjustUpBrightness', 'AdjustDownBrightness'],
  [DeviceConst.FEATURE_COLOR]: ['SetColor'],

  // '': 'SelectChannel',
  // '': 'AdjustUpVolume',
  // '': 'AdjustDownVolume',
  // '': 'SetVolume',
  // '': 'SetMute',
  // '': 'CancelMute',
  // '': 'Play',
  // '': 'Pause',
  // '': 'Continue',
  // '': 'Next',
  // '': 'Previous',
  // '': 'FastForward',
  //
  // '': 'SetTemperature',
  // '': 'AdjustUpTemperature',
  // '': 'AdjustDownTemperature',
  // '': 'SetHumidity',
  // '': 'AdjustUpHumidity',
  // '': 'AdjustDownHumidity',
  // '': 'SetWindSpeed',
  // '': 'AdjustUpWindSpeed',
  // '': 'AdjustDownWindSpeed',
  // '': 'OpenSwing',
  // '': 'CloseSwing',
  // '': 'OpenUpAndDownSwing',
  // '': 'OpenUpSwing',
  // '': 'OpenLeftAndRightSwing',
  // '': 'OpenLeftSwing',
  // '': 'OpenRightSwing',
  // '': 'OpenForwardAndBackSwing',
  // '': 'OpenForwardSwing',
  // '': 'OpenBackSwing',
  // '': 'SetMode',
  // '': 'SetColor',
  // '': 'OpenFunction',
  // '': 'CloseFunction',
  // '': 'Cancel',
  // '': 'CancelMode'
};

module.exports.propertyMap = {
  [DeviceConst.FEATURE_TOGGLE]: 'powerstate',
  [DeviceConst.FEATURE_COLOR]: 'color',
  [DeviceConst.FEATURE_COLOR_TEMP]: 'colorTemperature',
  // '': 'temperature',
  // '': 'windspeed',
  // '': 'brightness',
  // '': 'fog',
  // '': 'humidity',
  // '': 'pm2.5',
  // '': 'channel',
  // '': 'number',
  // '': 'direction',
  // '': 'angle',
  // '': 'anion',
  // '': 'effluent',
  // '': 'mode',
  // '': 'lefttime',
  // '': 'remotestatus',
  // '': 'onlinestate',
};

module.exports.PropertyRMap = {
  QueryColor: DeviceConst.FEATURE_COLOR,
  QueryPowerState: DeviceConst.FEATURE_TOGGLE,
  // QueryTemperature: '',
  // QueryHumidity: '',
  // QueryWindSpeed: '',
  // QueryBrightness: '',
  // QueryFog: '',
  // QueryMode: '',
  // QueryPM25: '',
  // QueryDirection: '',
  // QueryAngle: '',
};