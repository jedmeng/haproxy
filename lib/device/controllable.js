const BaseDevice = require('./base');
const {
  FEATURE_ON_OFF, FEATURE_TOGGLE,
  SERVICE_TURN_ON, SERVICE_TURN_OFF, SERVICE_TOGGLE,
  STATE_ON, STATE_OFF,
} = require('../const');


/**
 * 操控类设备鸡肋
 */
class Controllable extends BaseDevice {

  /**
   * @inheritDoc
   * @param {string} feature
   * @returns {boolean}
   */
  isSupport(feature) {
    if ([FEATURE_ON_OFF, FEATURE_TOGGLE].includes(feature)) {
      return true;
    } else {
      return super.isSupport(feature);
    }
  }

  /**
   * 打开设备
   * @returns {Promise.<boolean>}
   */
  async turnOn() {
    this.assertSupport(FEATURE_ON_OFF);
    return await this.control(SERVICE_TURN_ON);
  }

  /**
   * 关闭设备
   * @returns {Promise.<boolean>}
   */
  async turnOff() {
    this.assertSupport(FEATURE_ON_OFF);
    return await this.control(SERVICE_TURN_OFF);
  }

  /**
   * 切换设备开关状态
   * @returns {Promise.<boolean>}
   */
  async toggle() {
    this.assertSupport(FEATURE_ON_OFF);

    if (this.isSupport(FEATURE_TOGGLE)) {
      return await this.control(SERVICE_TOGGLE);
    } else if (await this.isOn()) {
      return await this.turnOff();
    } else {
      return await this.turnOn();
    }
  }

  /**
   * 查询开关状态
   * @returns {Promise.<boolean>}
   */
  async isOn() {
    await this.updateAndCheck();

    return this.state !== STATE_OFF;
  }
}


module.exports = Controllable;