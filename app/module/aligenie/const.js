const DeviceConst = require('../../const');

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

const Action = {
  TURN_ON: 'TurnOn',
  TURN_OFF: 'TurnOff',

  SET_TEMPERATURE: 'SetTemperature',
  ADJUST_UP_TEMPERATURE: 'AdjustUpTemperature',
  ADJUST_DOWN_TEMPERATURE: 'AdjustDownTemperature',

  SET_HUMIDITY: 'SetHumidity',
  ADJUST_UP_HUMIDITY: 'AdjustUpHumidity',
  ADJUST_DOWN_HUMIDITY: 'AdjustDownHumidity',

  SET_WIND_SPEED: 'SetWindSpeed',
  ADJUST_UP_WIND_SPEED: 'AdjustUpWindSpeed',
  ADJUST_DOWN_WIND_SPEED: 'AdjustDownWindSpeed',

  OPEN_SWING: 'OpenSwing',
  CLOSE_SWING: 'CloseSwing',
  OPEN_UP_SWING: 'OpenUpSwing',
  OPEN_DOWN_SWING: 'OpenDownSwing',
  OPEN_UP_AND_DOWN_SWING: 'OpenUpAndDownSwing',
  OPEN_LEFT_SWING: 'OpenLeftSwing',
  OPEN_RIGHT_SWING: 'OpenRightSwing',
  OPEN_LEFT_AND_RIGHT_SWING: 'OpenLeftAndRightSwing',
  OPEN_FORWARD_SWING: 'OpenForwardSwing',
  OPEN_BACK_SWING: 'OpenBackSwing',
  OPEN_FORWARD_AND_BACK_SWING: 'OpenForwardAndBackSwing',

  ADJUST_UP_VOLUME: 'AdjustUpVolume',
  ADJUST_DOWN_VOLUME: 'AdjustDownVolume',
  SET_VOLUME: 'SetVolume',
  SET_MUTE: 'SetMute',
  CANCEL_MUTE: 'CancelMute',
  PLAY: 'Play',
  PAUSE: 'Pause',
  CONTINUE: 'Continue',
  FAST_FORWARD: 'FastForward',
  NEXT: 'Next',
  PREVIOUS: 'Previous',
  SELECT_CHANNEL: 'SelectChannel',

  SET_BRIGHTNESS: 'SetBrightness',
  ADJUST_DOWN_BRIGHTNESS: 'AdjustUpBrightness',
  ADJUST_UP_BRIGHTNESS: 'AdjustDownBrightness',
  SET_COLOR: 'SetColor',

  SET_MODE: 'SetMode',
  CANCEL_MODE: 'CancelMode',
  OPEN_FUNCTION: 'OpenFunction',
  CLOSE_FUNCTION: 'CloseFunction',
  CANCEL: 'Cancel'
};

const Mode = {
  AUTO: 'auto',
  COLD: 'cold',
  HEAT: 'heat',
  VENTILATE: 'ventilate',
  AIRSUPPLY: 'airsupply',
  DEHUMIDIFICATION: 'dehumidification',
  READING: 'reading',
  MOVIE: 'movie',
  SLEEP: 'sleep',
  LIVE: 'live',
  MANUAL: 'manual',
  SILENT: 'silent',
  ENERGY: 'energy',
  NORMAL_WIND: 'normalWind',
  NATURE_WIND: 'natureWind',
  SLEEP_WIND: 'sleepWind',
  QUIET_WIND: 'quietWind',
  COMFORTABLE_WIND: 'comfortableWind',
  BABY_WIND: 'babyWind',
  COTTONS: 'cottons',
  SYNTHETICS: 'synthetics',
  WOOL: 'wool',
  HYGIENE: 'hygiene',
  DRUM_CLEAN: 'drumClean',
  SILK: 'silk',
  HOLIDAY: 'holiday',
  SMART: 'smart',
  MUSIC: 'music',
  ZERO_GRAVITY: 'zeroGravity',
  SNORE_STOP: 'snoreStop',
  DIFFUSE: 'diffuse',
  SWING: 'swing',
  POWER: 'power',
  COMMON: 'common',
  WORK: 'work',
  COOL: 'cool',
  FROZEN: 'frozen',
  MICRO_DRY: 'microDry',
  FULL_DRY: 'fullDry',
  SUPER_DRY: 'superDry',
  SUMMER: 'summer',
  WINTER: 'winter',
  STANDARD: 'standard',
  FAST_WASH: 'fastWash',
  BABY_WASH: 'babyWash',
  SINGLE_DEHYDRATION: 'singleDehydration',
  ENERGY_SAVE_WASH: 'energySaveWash'
};

const Color = {};

const TypeMap = {
  light: ['light'],
  switch: ['switch', 'outlet'],
  media_player: ['television', 'STB', 'telecontroller'],
  fan: ['fan', 'airpurifier'],
  climate: ['aircondition', 'humidifier'],
  cover: ['curtain'],
  vacuum: ['roboticvacuum']
};

const ActionMap = {
  [Action.TURN_ON]: [DeviceConst.FEATURE_ON_OFF],
  [Action.TURN_OFF]: [DeviceConst.FEATURE_ON_OFF],

  [Action.SET_TEMPERATURE]: [DeviceConst.FEATURE_TEMPERATURE, DeviceConst.FEATURE_TEMPERATURE_RANGE],
  [Action.ADJUST_UP_TEMPERATURE]: [DeviceConst.FEATURE_TEMPERATURE, DeviceConst.FEATURE_TEMPERATURE_RANGE],
  [Action.ADJUST_DOWN_TEMPERATURE]: [DeviceConst.FEATURE_TEMPERATURE, DeviceConst.FEATURE_TEMPERATURE_RANGE],

  [Action.SET_HUMIDITY]: [DeviceConst.FEATURE_HUMIDITY],
  [Action.ADJUST_UP_HUMIDITY]: [DeviceConst.FEATURE_HUMIDITY],
  [Action.ADJUST_DOWN_HUMIDITY]: [DeviceConst.FEATURE_HUMIDITY],

  [Action.SET_WIND_SPEED]: [DeviceConst.FEATURE_FAN_MODE, DeviceConst.FEATURE_FAN_SPEED],
  [Action.ADJUST_UP_WIND_SPEED]: [DeviceConst.FEATURE_FAN_MODE, DeviceConst.FEATURE_FAN_SPEED],
  [Action.ADJUST_DOWN_WIND_SPEED]: [DeviceConst.FEATURE_FAN_MODE, DeviceConst.FEATURE_FAN_SPEED],

  [Action.OPEN_SWING]: [DeviceConst.FEATURE_SWING_MODE, DeviceConst.FEATURE_OSCILLATE],
  [Action.OPEN_UP_SWING]: [DeviceConst.FEATURE_SWING_MODE, DeviceConst.FEATURE_OSCILLATE],
  [Action.OPEN_DOWN_SWING]: [DeviceConst.FEATURE_SWING_MODE],
  [Action.OPEN_UP_AND_DOWN_SWING]: [DeviceConst.FEATURE_SWING_MODE],
  [Action.OPEN_LEFT_SWING]: [DeviceConst.FEATURE_SWING_MODE],
  [Action.OPEN_RIGHT_SWING]: [DeviceConst.FEATURE_SWING_MODE],
  [Action.OPEN_LEFT_AND_RIGHT_SWING]: [DeviceConst.FEATURE_SWING_MODE],
  [Action.OPEN_FORWARD_SWING]: [DeviceConst.FEATURE_SWING_MODE],
  [Action.OPEN_BACK_SWING]: [DeviceConst.FEATURE_SWING_MODE],
  [Action.OPEN_FORWARD_AND_BACK_SWING]: [DeviceConst.FEATURE_SWING_MODE],

  [Action.ADJUST_UP_VOLUME]: [DeviceConst.FEATURE_VOLUME],
  [Action.ADJUST_DOWN_VOLUME]: [DeviceConst.FEATURE_VOLUME],
  [Action.SET_VOLUME]: [DeviceConst.FEATURE_VOLUME],
  [Action.SET_MUTE]: [DeviceConst.FEATURE_VOLUME_MUTE],
  [Action.CANCEL_MUTE]: [DeviceConst.FEATURE_VOLUME_MUTE],
  [Action.PLAY]: [DeviceConst.FEATURE_PLAY],
  [Action.PAUSE]: [DeviceConst.FEATURE_PAUSE],
  [Action.CONTINUE]: [DeviceConst.FEATURE_PAUSE],
  [Action.FAST_FORWARD]: [DeviceConst.FEATURE_SEEK],
  [Action.NEXT]: [DeviceConst.FEATURE_NEXT],
  [Action.PREVIOUS]: [DeviceConst.FEATURE_PREVIOUS],
  [Action.SELECT_CHANNEL]: [],

  [Action.SET_BRIGHTNESS]: [DeviceConst.FEATURE_BRIGHTNESS],
  [Action.ADJUST_DOWN_BRIGHTNESS]: [DeviceConst.FEATURE_BRIGHTNESS],
  [Action.ADJUST_UP_BRIGHTNESS]: [DeviceConst.FEATURE_BRIGHTNESS],
  [Action.SET_COLOR]: [DeviceConst.FEATURE_COLOR],

  [Action.SET_MODE]: [DeviceConst.FEATURE_OPTION_MODE],
  [Action.CANCEL_MODE]: [],
  [Action.OPEN_FUNCTION]: [],
  [Action.CLOSE_FUNCTION]: [],
  [Action.CANCEL]: [],
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
  Property,
  Action,
  Mode,
  TypeMap,
  ActionMap,
  QueryToProperty
};

