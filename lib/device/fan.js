const ControllableDevice = require('./controllableDevice');
const {
  ATTR_SPEED, ATTR_SPEED_LIST, ATTR_OSCILLATING, ATTR_DIRECTION,
  FEATURE_SPEED, FEATURE_OSCILLATE, FEATURE_DIRECTION,
  SERVICE_OSCILLATE, SERVICE_TURN_ON, SERVICE_SET_DIRECTION,
  STATE_ON, STATE_OFF
} = require('./const');
const {IllegalValueError} = require('../error');

const SUPPORT_SET_SPEED = 1;
const SUPPORT_OSCILLATE = 2;
const SUPPORT_DIRECTION = 4;

const DIRECTION_LEFT = 'left';
const DIRECTION_RIGHT = 'right';

/**
 * 风扇类设备
 */
class Fan extends ControllableDevice {
  init() {
    this.featureMasks = {
      [FEATURE_SPEED]: SUPPORT_SET_SPEED,
      [FEATURE_OSCILLATE]: SUPPORT_OSCILLATE,
      [FEATURE_DIRECTION]: SUPPORT_DIRECTION
    };
  }

  /**
   * @inheritDoc
   * @param {object} state
   */
  parseState(state) {
    super.parseState(state);

    const attributes = [ATTR_SPEED, ATTR_SPEED_LIST, ATTR_OSCILLATING, ATTR_DIRECTION];
    this.setAttribute(attributes, state.attributes);
  }

  /**
   * 获取风速列表
   * @returns {Promise.<Array<string>>}
   */
  async getSpeedList() {
    return await this.getAttribute(ATTR_SPEED_LIST, false);
  }

  /**
   * 获取风速
   * @returns {Promise.<string>}
   */
  async getSpeed() {
    await this.update();
    return await this.getAttribute(ATTR_SPEED);
  }

  /**
   * 设置风速
   * @param {string} value
   * @returns {Promise.<boolean>}
   */
  async setSpeed(value) {
    this.assertSupport(FEATURE_SPEED);

    const list = await this.getSpeedList();
    if (!list.includes(value)) {
      throw new IllegalValueError();
    }

    return await this.control(SERVICE_TURN_ON, {[ATTR_SPEED]: value});
  }

  /**
   * 获取摇头状态
   * @returns {Promise.<boolean>}
   */
  async getOscillating() {
    const value = await this.getAttribute(ATTR_OSCILLATING);
    return value === STATE_ON;
  }

  /**
   * 设置摇头状态
   * @param {boolean} value
   * @returns {Promise.<boolean>}
   */
  async setOscillating(value) {
    this.assertSupport(FEATURE_OSCILLATE);
    return await this.control(SERVICE_OSCILLATE, {[ATTR_OSCILLATING]: value});
  }

  /**
   * 获取摇头方向
   * @returns {Promise.<string>}
   */
  async getDirection() {
    return await this.getAttribute(ATTR_DIRECTION);
  }

  /**
   * 设置摇头方向
   * @param {string} value
   * @returns {Promise.<boolean>}
   */
  async setDirection(value) {
    if (value !== DIRECTION_LEFT && value !== DIRECTION_RIGHT) {
      throw new IllegalValueError();
    }

    return await this.control(SERVICE_SET_DIRECTION, {[ATTR_DIRECTION]: value});
  }
}

module.exports = Fan;