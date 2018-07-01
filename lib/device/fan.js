const BaseDevice = require('./base');


class Fan extends BaseDevice {
  constructor(ha, state) {
    super(ha, state);
  }
}

module.exports = Fan;