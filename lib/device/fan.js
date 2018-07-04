const ControllableDevice = require('./controllableDevice');
const {
  ATTR_SPEED, ATTR_SPEED_LIST, ATTR_OSCILLATING, ATTR_DIRECTION,
  SERVICE_OSCILLATE, SERVICE_TURN_ON, SERVICE_SET_DIRECTION,
  FEATURE_SPEED, FEATURE_OSCILLATE, FEATURE_DIRECTION
} = require('./const');
const {IllegalValueError} = require('../error');

const SUPPORT_SET_SPEED = 1;
const SUPPORT_OSCILLATE = 2;
const SUPPORT_DIRECTION = 4;

const DIRECTION_LEFT = 'left';
const DIRECTION_RIGHT = 'right';


class Fan extends ControllableDevice {
  init() {
    this.featureMasks = {
      [FEATURE_SPEED]: SUPPORT_SET_SPEED,
      [FEATURE_OSCILLATE]: SUPPORT_OSCILLATE,
      [FEATURE_DIRECTION]: SUPPORT_DIRECTION
    };
  }

  parseState(state) {
    super.parseState(state);

    const attributes = [ATTR_SPEED, ATTR_SPEED_LIST, ATTR_OSCILLATING, ATTR_DIRECTION];
    this.setAttribute(attributes, state.attributes);
  }

  async getSpeed() {
    return await this.getAttribute(ATTR_SPEED);
  }

  async setSpeed(value) {
    this.assertSupport(FEATURE_SPEED);
    await this.update();

    const list = await this.getSpeedList();
    if (!list.includes(value)) {
      throw new IllegalValueError();
    }

    return await this.control(SERVICE_TURN_ON, {[ATTR_SPEED]: value});
  }

  async getSpeedList() {
    return await this.getAttribute(ATTR_SPEED_LIST, false);
  }

  async getOscillating() {
    return await this.getAttribute(ATTR_OSCILLATING);
  }

  async setOscillating(value) {
    this.assertSupport(FEATURE_OSCILLATE);
    value = !!value;
    return await this.control(SERVICE_OSCILLATE, {[ATTR_OSCILLATING]: value});
  }

  async getDirection() {
    return await this.getAttribute(ATTR_DIRECTION);
  }

  async setDitection(value) {
    if (value !== DIRECTION_LEFT && value !== DIRECTION_RIGHT) {
      throw new IllegalValueError();
    }

    return await this.control(SERVICE_SET_DIRECTION, {[ATTR_DIRECTION]: value});
  }
}

module.exports = Fan;