const BaseDevice = require('./base');
const {
  FEATURE_TURN_ON, FEATURE_TURN_OFF, FEATURE_TOGGLE,
  STATE_ON, STATE_OFF, SERVICE_TOGGLE,
  SERVICE_TURN_ON, SERVICE_TURN_OFF,
} = require('./const');


class ControllableDevice extends BaseDevice {
  constructor(ha, state) {
    super(ha, state);
  }

  isSupport(feature) {
    if ([FEATURE_TURN_ON, FEATURE_TURN_OFF, FEATURE_TOGGLE].includes(feature)) {
      return true;
    } else {
      return super.isSupport(feature);
    }
  }

  async turnOn() {
    await this.control(SERVICE_TURN_ON);
  }

  async turnOff() {
    await this.control(SERVICE_TURN_OFF);
  }

  async toggle() {
    await this.control(SERVICE_TOGGLE);
  }

  async isOn() {
    await this.updateAndCheck();

    return this.state !== STATE_OFF;
  }
}

module.exports = ControllableDevice;