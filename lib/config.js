const _ = require('lodash');

class Config {
  constructor(config, defaultConfig) {
    this.data = _.merge({}, config, defaultConfig);
  }

  get(key, defaultValue) {
    const value = key.split('.').reduce((r, k) => r && r[k] !== undefined ? r[k] : undefined, this.data);
    return value === undefined ? defaultValue : value;
  }

  set(key, value) {
    key.split('.').reduce((o, k) => {
      if (key.endsWith(k)) {
        return o[k] = value;
      } else if (o[k] === undefined) {
        return o[k] = {};
      } else if (o[k] !== null) {
        return o[k];
      } else {
        throw new Error();//@todo
      }
    }, this.data)
  }

  exists(...keys) {
    return keys.every(key => this.get(key) !== undefined);
  }
}

module.exports = Config;