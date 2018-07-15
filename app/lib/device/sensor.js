const BaseDevice = require('./base');


class Sensor extends BaseDevice {
  constructor(ha, state) {
    super(ha, state);
  }

}

module.exports = Sensor;