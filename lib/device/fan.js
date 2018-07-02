const ControllableDevice = require('./controllableDevice');
const {FEATURE_SPEED, FEATURE_OSCILLATE, FEATURE_DIRECTION} = require('./const');

const SUPPORT_SET_SPEED = 1;
const SUPPORT_OSCILLATE = 2;
const SUPPORT_DIRECTION = 4;


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


  }

  async getSpeed() {
    await this.update();

  }
}

module.exports = Fan;