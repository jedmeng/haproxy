const Controllable = require('./controllable');
const {ATTR_POWER, ATTR_TODAY_ENERGY} = require('../../const');

const SUPPORT_POWER = 1;
const SUPPORT_TODAY_ENERGY = 2;


class Switch extends Controllable {

  init() {
    this.featureMasks = {
      'power': SUPPORT_POWER,
      'todayEnergy': SUPPORT_TODAY_ENERGY
    };
  }

  parseState(state) {
    super.parseState(state);

    if (ATTR_POWER in state.attributes) {
      this.supportedFeatures |= SUPPORT_POWER;
      this.attributes[ATTR_POWER] = state.attributes[ATTR_POWER];
    }

    if (ATTR_TODAY_ENERGY in state.attributes) {
      this.supportedFeatures |= SUPPORT_TODAY_ENERGY;
      this.attributes[ATTR_TODAY_ENERGY] = state.attributes[ATTR_TODAY_ENERGY];
    }
  }

  async getPower() {
    await this.updateAndCheck();
    return this.attributes[ATTR_POWER];
  }


  async getTodayEnergy() {
    await this.updateAndCheck();
    return this.attributes[ATTR_TODAY_ENERGY];
  }
}

module.exports = Switch;