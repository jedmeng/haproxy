const ControllableDevice = require('./controllable');
const {formatNumber} = require('../utils');
const {
  ATTR_UNIT_OF_MEASUREMENT, ATTR_MAX_TEMPERATURE, ATTR_MIN_TEMPERATURE,
  ATTR_CURRENT_TEMPERATURE, ATTR_TEMPERATURE, ATTR_TEMPERATURE_HIGH, ATTR_TEMPERATURE_LOW,
  ATTR_MAX_HUMIDITY, ATTR_MIN_HUMIDITY, ATTR_CURRENT_HUMIDITY, ATTR_HUMIDITY,
  ATTR_FAN_MODE_LIST, ATTR_FAN_MODE, ATTR_OPTION_MODE_LIST, ATTR_OPTION_MODE,
  ATTR_SWING_MODE_LIST, ATTR_SWING_MODE, ATTR_AWAY_MODE, ATTR_HOLD_MODE, ATTR_AUX_HEAT,

  FEATURE_ON_OFF, FEATURE_TOGGLE, FEATURE_TEMPERATURE, FEATURE_TEMPERATURE_RANGE,
  FEATURE_HUMIDITY, FEATURE_FAN_MODE, FEATURE_OPTION_MODE,
  FEATURE_SWING_MODE, FEATURE_AWAY_MODE, FEATURE_HOLD_MODE, FEATURE_AUX_HEAT,

  SERVICE_SET_TEMPERATURE, SERVICE_SET_HUMIDITY, SERVICE_SET_FAN_MODE, SERVICE_SET_OPTION_MODE,
  SERVICE_SET_SWING_MODE, SERVICE_SET_AWAY_MODE, SERVICE_SET_HOLD_MODE, SERVICE_SET_AUX_HEAT,

  STATE_ON
} = require('../../const');

const SUPPORT_TARGET_TEMPERATURE = 1;
const SUPPORT_TARGET_TEMPERATURE_HIGH = 2;
const SUPPORT_TARGET_TEMPERATURE_LOW = 4;
const SUPPORT_TARGET_HUMIDITY = 8;
const SUPPORT_TARGET_HUMIDITY_HIGH = 16;
const SUPPORT_TARGET_HUMIDITY_LOW = 32;
const SUPPORT_FAN_MODE = 64;
const SUPPORT_OPERATION_MODE = 128;
const SUPPORT_HOLD_MODE = 256;
const SUPPORT_SWING_MODE = 512;
const SUPPORT_AWAY_MODE = 1024;
const SUPPORT_AUX_HEAT = 2048;
const SUPPORT_ON_OFF = 4096;


/**
 * 环境控制类设备
 * 如：空调、加湿器
 */
class Climate extends ControllableDevice {

  /**
   * @inheritDoc
   */
  init() {
    this.featureMasks = {
      [FEATURE_TEMPERATURE]: SUPPORT_TARGET_TEMPERATURE,
      [FEATURE_HUMIDITY]: SUPPORT_TARGET_HUMIDITY,
      [FEATURE_FAN_MODE]: SUPPORT_FAN_MODE,
      [FEATURE_OPTION_MODE]: SUPPORT_OPERATION_MODE,
      [FEATURE_SWING_MODE]: SUPPORT_SWING_MODE,
      [FEATURE_AWAY_MODE]: SUPPORT_AWAY_MODE,
      [FEATURE_HOLD_MODE]: SUPPORT_HOLD_MODE,
      [FEATURE_AUX_HEAT]: SUPPORT_AUX_HEAT,
    };
  }

  /**
   * @inheritDoc
   * @param {object} state
   */
  parseState(state) {
    super.parseState(state);

    const attributes = [
      ATTR_UNIT_OF_MEASUREMENT, ATTR_MAX_TEMPERATURE, ATTR_MIN_TEMPERATURE,
      ATTR_CURRENT_TEMPERATURE, ATTR_TEMPERATURE, ATTR_TEMPERATURE_HIGH, ATTR_TEMPERATURE_LOW,
      ATTR_MAX_HUMIDITY, ATTR_MIN_HUMIDITY, ATTR_CURRENT_HUMIDITY, ATTR_HUMIDITY,
      ATTR_FAN_MODE_LIST, ATTR_FAN_MODE, ATTR_OPTION_MODE_LIST, ATTR_OPTION_MODE,
      ATTR_SWING_MODE_LIST, ATTR_SWING_MODE, ATTR_AWAY_MODE, ATTR_HOLD_MODE, ATTR_AUX_HEAT
    ];
    this.copyAttribute(attributes, state.attributes);
  }

  /**
   * @inheritDoc
   * @param {string} feature
   * @returns {boolean}
   */
  isSupport(feature) {
    if ([FEATURE_ON_OFF, FEATURE_TOGGLE].includes(feature)) {
      return !!(this.supportedFeatures & SUPPORT_ON_OFF);
    } else if (feature === FEATURE_TEMPERATURE_RANGE) {
      return !!(this.supportedFeatures & (SUPPORT_TARGET_TEMPERATURE_HIGH | SUPPORT_TARGET_TEMPERATURE_LOW));
    } else {
      return super.isSupport(feature);
    }
  }

  /**
   * 获取温度单位
   * @returns {Promise.<string>}
   */
  async getTemperatureUnit() {
    return await this.getAttribute(ATTR_UNIT_OF_MEASUREMENT, false);
  }

  /**
   * 获取温度最大值
   * @returns {Promise.<number>}
   */
  async getMaxTemperature() {
    return await this.getAttribute(ATTR_MAX_TEMPERATURE, false);
  }

  /**
   * 获取温度最小值
   * @returns {Promise.<number>}
   */
  async getMinTemperature() {
    return await this.getAttribute(ATTR_MIN_TEMPERATURE, false);
  }

  /**
   * 获取当前温度
   * @returns {Promise.<number>}
   */
  async getCurrentTemperature() {
    return await this.getAttribute(ATTR_CURRENT_TEMPERATURE);
  }

  /**
   * 获取目标温度
   * @returns {Promise.<number>}
   */
  async getTemperature() {
    return await this.getAttribute(ATTR_TEMPERATURE);
  }

  /**
   * 设置目标温度
   * @param {number} value
   * @returns {Promise.<boolean>}
   */
  async setTemperature(value) {
    this.assertSupport(FEATURE_TEMPERATURE);
    const max = await this.getMaxHumidity();
    const min = await this.getMinHumidity();
    value = formatNumber(value, 0, min, max);
    return await this.control(SERVICE_SET_TEMPERATURE, {[ATTR_TEMPERATURE]: value});
  }

  /**
   * 获取目标温度区间左边界
   * @returns {Promise.<number>}
   */
  async getTemperatureLow() {
    return await this.getAttribute(ATTR_TEMPERATURE_LOW);
  }

  /**
   * 设置目标温度区间左边界
   * @param {number} value
   * @returns {Promise.<boolean>}
   */
  async setTemperatureLow(value) {
    this.assertSupport(FEATURE_TEMPERATURE_RANGE);
    const high = await this.getTemperatureHigh();
    const min = await this.getMinHumidity();
    return await this.control(SERVICE_SET_TEMPERATURE, {
      [ATTR_TEMPERATURE_LOW]: formatNumber(value, 0, min, high),
      [ATTR_TEMPERATURE_HIGH]: high
    });
  }

  /**
   * 获取目标温度区间右边界
   * @returns {Promise.<number>}
   */
  async getTemperatureHigh() {
    return await this.getAttribute(ATTR_TEMPERATURE_HIGH);
  }

  /**
   * 设置目标温度区间有边界
   * @param {number} value
   * @returns {Promise.<boolean>}
   */
  async setTemperatureHigh(value) {
    this.assertSupport(FEATURE_TEMPERATURE_RANGE);
    const low = await this.getTemperatureLow();
    const max = await this.getMaxHumidity();
    return await this.control(SERVICE_SET_TEMPERATURE, {
      [ATTR_TEMPERATURE_LOW]: low,
      [ATTR_TEMPERATURE_HIGH]: formatNumber(value, 0, low, max)
    });
  }

  /**
   * 获取湿度最大值
   * @returns {Promise.<number>}
   */
  async getMaxHumidity() {
    return await this.getAttribute(ATTR_MAX_HUMIDITY, false);
  }

  /**
   * 获取湿度最小值
   * @returns {Promise.<number>}
   */
  async getMinHumidity() {
    return await this.getAttribute(ATTR_MIN_HUMIDITY, false);
  }

  /**
   * 获取当前湿度
   * @returns {Promise.<number>}
   */
  async getCurrentHumidity() {
    return await this.getAttribute(ATTR_CURRENT_HUMIDITY);
  }

  /**
   * 获取目标湿度
   * @returns {Promise.<number>}
   */
  async getHumidity() {
    return await this.getAttribute(ATTR_HUMIDITY);
  }

  /**
   * 设置目标湿度
   * @param {number} value
   * @returns {Promise.<boolean>}
   */
  async setHumidity(value) {
    this.assertSupport(FEATURE_HUMIDITY);
    const max = await this.getMaxHumidity();
    const min = await this.getMinHumidity();
    value = formatNumber(value, 0, min, max);
    return await this.control(SERVICE_SET_HUMIDITY, {[ATTR_HUMIDITY]: value});
  }

  /**
   * 获取风量列表
   * @returns {Promise.<string[]>}
   */
  async getFanModeList() {
    return await this.getAttribute(ATTR_FAN_MODE_LIST, false);
  }

  /**
   * 获取风量
   * @returns {Promise.<string>}
   */
  async getFanMode() {
    return await this.getAttribute(ATTR_FAN_MODE);
  }

  /**
   * 设置风量
   * @param {string} value
   * @returns {Promise.<boolean>}
   */
  async setFanMode(value) {
    this.assertSupport(FEATURE_FAN_MODE);
    return await this.control(SERVICE_SET_FAN_MODE, {[ATTR_FAN_MODE]: value});
  }

  /**
   * 获取运行模式列表
   * @returns {Promise.<Array<string>>}
   */
  async getOptionModeList() {
    return await this.getAttribute(ATTR_OPTION_MODE_LIST, false);
  }

  /**
   * 获取运行模式
   * @returns {Promise.<string>}
   */
  async getOptionMode() {
    return await this.getAttribute(ATTR_OPTION_MODE);
  }

  /**
   * 设置运行模式
   * @param {string} value
   * @returns {Promise.<boolean>}
   */
  async setOptionMode(value) {
    this.assertSupport(FEATURE_OPTION_MODE);
    return await this.control(SERVICE_SET_OPTION_MODE, {[ATTR_OPTION_MODE]: value});
  }

  /**
   * 获取扫风模式列表
   * @returns {Promise.<Array<string>>}
   */
  async getSwingModeList() {
    return await this.getAttribute(ATTR_SWING_MODE_LIST, false);
  }

  /**
   * 获取扫风模式
   * @returns {Promise.<string>}
   */
  async getSwingMode() {
    return await this.getAttribute(ATTR_SWING_MODE);
  }

  /**
   * 设置扫风模式
   * @param {string} value
   * @returns {Promise.<boolean>}
   */
  async setSwingMode(value) {
    this.assertSupport(FEATURE_AWAY_MODE);
    return await this.control(SERVICE_SET_SWING_MODE, {[ATTR_SWING_MODE]: value});
  }

  /**
   * 获取离家模式状态
   * @returns {Promise.<boolean>}
   */
  async getAwayMode() {
    const state = await this.getAttribute(ATTR_AWAY_MODE);
    return state === STATE_ON;
  }

  /**
   * 设置离家模式
   * @param {boolean} value
   * @returns {Promise.<boolean>}
   */
  async setAwayMode(value) {
    this.assertSupport(FEATURE_HOLD_MODE);
    return await this.control(SERVICE_SET_AWAY_MODE, {[ATTR_AWAY_MODE]: value});
  }

  /**
   * 获取情景模式
   * @returns {Promise.<string>}
   */
  async getHoldMode() {
    return await this.getAttribute(ATTR_HOLD_MODE);
  }

  /**
   * 设置情景模式
   * @param {string} value
   * @returns {Promise.<boolean>}
   */
  async setHoldMode(value) {
    this.assertSupport(FEATURE_HOLD_MODE);
    return await this.control(SERVICE_SET_HOLD_MODE, {[ATTR_HOLD_MODE]: value});
  }

  /**
   * 获取辅热状态状态
   * @returns {Promise.<boolean>}
   */
  async getAuxiliaryHeater() {
    const state = await this.getAttribute(ATTR_AUX_HEAT);
    return state === STATE_ON;
  }

  /**
   * 设置辅热开关
   * @param {boolean} value
   * @returns {Promise.<boolean>}
   */
  async setAuxiliaryHeater(value) {
    this.assertSupport(FEATURE_AUX_HEAT);
    return await this.control(SERVICE_SET_AUX_HEAT, {[ATTR_AUX_HEAT]: value});
  }
}

module.exports = Climate;