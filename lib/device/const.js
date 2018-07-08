module.exports = {
  DOMAIN_CLIMATE: 'climate',
  DOMAIN_FAN: 'fan',
  DOMAIN_LIGHT: 'light',
  DOMAIN_SWITCH: 'switch',

  ACTION_QUERY: 'query',
  ACTION_CONTROL: 'control',
  ACTION_SYNC: 'sync',

  // switch
  ATTR_POWER: 'current_power_w',
  ATTR_TODAY_ENERGY: 'today_energy_kwh',
  // light
  ATTR_BRIGHTNESS: 'brightness',
  ATTR_HS_COLOR: 'hs_color',
  ATTR_COLOR_TEMP: 'color_temp',
  ATTR_MIN_MIREDS: 'min_mireds',
  ATTR_MAX_MIREDS: 'max_mireds',
  ATTR_WHITE_VALUE: 'white_value',
  ATTR_EFFECT: 'effect',
  ATTR_EFFECT_LIST: 'effect_list',
  // fan
  ATTR_SPEED: 'speed',
  ATTR_SPEED_LIST: 'speed_list',
  ATTR_OSCILLATING: 'oscillating',
  ATTR_DIRECTION: 'direction',
  // climate
  ATTR_MAX_TEMPERATURE: 'max_temp',
  ATTR_MIN_TEMPERATURE: 'min_temp',
  ATTR_CURRENT_TEMPERATURE: 'current_temperature',
  ATTR_TEMPERATURE: 'temperature',
  ATTR_TEMPERATURE_HIGH: 'target_temp_high',
  ATTR_TEMPERATURE_LOW: 'target_temp_low',
  ATTR_MAX_HUMIDITY: 'max_humidity',
  ATTR_MIN_HUMIDITY: 'min_humidity',
  ATTR_CURRENT_HUMIDITY: 'current_humidity',
  ATTR_HUMIDITY: 'humidity',
  ATTR_FAN_MODE_LIST: 'fan_list',
  ATTR_FAN_MODE: 'fan_mode',
  ATTR_OPTION_MODE_LIST: 'operation_list',
  ATTR_OPTION_MODE: 'operation_mode',
  ATTR_SWING_MODE_LIST: 'swing_list',
  ATTR_SWING_MODE: 'swing_mode',
  ATTR_AWAY_MODE: 'away_mode',
  ATTR_HOLD_MODE: 'hold_mode',
  ATTR_AUX_HEAT: 'aux_heat',


  FEATURE_ON_OFF: 'onOff',
  FEATURE_TOGGLE: 'toggle',

  FEATURE_BRIGHTNESS: 'brightness',
  FEATURE_COLOR_TEMP: 'colorTemp',
  FEATURE_EFFECT: 'effect',
  FEATURE_FLASH: 'flash',
  FEATURE_COLOR: 'color',
  FEATURE_TRANSITION: 'transition',
  FEATURE_WHITE_VALUE: 'whiteValue',

  FEATURE_SPEED: 'speed',
  FEATURE_OSCILLATE: 'oscillate',
  FEATURE_DIRECTION: 'direction',

  FEATURE_TEMPERATURE: 'temperature',
  FEATURE_TEMPERATURE_RANGE: 'temperature_range',
  FEATURE_HUMIDITY: 'humidity',
  FEATURE_FAN_MODE: 'fan_mode',
  FEATURE_OPTION_MODE: 'operation_mode',
  FEATURE_SWING_MODE: 'swing_mode',
  FEATURE_AWAY_MODE: 'away_mode',
  FEATURE_HOLD_MODE: 'hold_mode',
  FEATURE_AUX_HEAT: 'aux_heat',


  STATE_ON: 'on',
  STATE_OFF: 'off',
  STATE_UNAVAILABLE : 'unavailable',


  SERVICE_TOGGLE: 'toggle',
  SERVICE_TURN_ON: 'turn_on',
  SERVICE_TURN_OFF: 'turn_off',
  SERVICE_OSCILLATE: 'oscillate',
  SERVICE_SET_SPEED: 'set_speed',
  SERVICE_SET_DIRECTION: 'set_direction',

  SERVICE_SET_TEMPERATURE: 'set_temperature',
  SERVICE_SET_HUMIDITY: 'set_humidity',
  SERVICE_SET_FAN_MODE: 'set_fan_mode',
  SERVICE_SET_OPTION_MODE: 'set_operation_mode',
  SERVICE_SET_SWING_MODE: 'set_swing_mode',
  SERVICE_SET_AWAY_MODE: 'set_away_mode',
  SERVICE_SET_HOLD_MODE: 'set_hold_mode',
  SERVICE_SET_AUX_HEAT: 'set_aux_heat'
};