const DeviceConst = require('../../device/const');

const Property = {
  POWER_STATE: 'powerstate',
  COLOR: 'color',
  COLOR_TEMP: 'colorTemperature',
  BRIGHTNESS: 'brightness',
  TEMPERATURE: 'temperature',
  HUMIDITY: 'humidity',
  PM25: 'pm2.5',
  WIND_SPEED: 'windspeed',
  FOG: 'fog',
  CHANNEL: 'channel',
  NUMBER: 'number',
  DIRECTION: 'direction',
  ANGLE: 'angle',
  ANION: 'anion',
  EFFLUENT: 'effluent',
  MODE: 'mode',
  LEFT_TIME: 'lefttime',
  ONLINE_STATE: 'onlinestate',
  REMOTE_STATUS: 'remotestatus'
};

const Action = {};

const TypeMap = {
  light: 'light',
  switch: 'switch'
};

const FeatureMap = {
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

const PropertyMap = {
  [DeviceConst.FEATURE_TOGGLE]: Property.POWER_STATE,
  [DeviceConst.FEATURE_COLOR]: Property.COLOR,
  [DeviceConst.FEATURE_COLOR_TEMP]: Property.COLOR_TEMP,
  [DeviceConst.FEATURE_BRIGHTNESS]: Property.BRIGHTNESS,
  // '': 'temperature',
  // '': 'humidity',
  // '': 'pm2.5',
  // '': 'windspeed',
  // '': 'fog',
  // '': 'channel',
  // '': 'number',
  // '': 'direction',
  // '': 'angle',
  // '': 'anion',
  // '': 'effluent',
  // '': 'mode',
  // '': 'lefttime',
};

const QueryToProperty = {
  QueryColor: Property.COLOR,
  QueryPowerState: Property.POWER_STATE,
  QueryTemperature: Property.TEMPERATURE,
  QueryHumidity: Property.HUMIDITY,
  QueryWindSpeed: Property.WIND_SPEED,
  QueryBrightness: Property.BRIGHTNESS,
  QueryFog: Property.FOG,
  QueryMode: Property.MODE,
  QueryPM25: Property.PM25,
  QueryDirection: Property.DIRECTION,
  QueryAngle: Property.ANGLE,
};


module.exports = {
  Properties: Property,
  Actions: Action,
  TypeMap,
  FeatureMap,
  PropertyMap,
  QueryToProperty
};