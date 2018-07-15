const BaseDevice = require('./base');


class Lock extends BaseDevice {
  constructor(ha, state) {
    super(ha, state);
  }

}

module.exports = Lock;