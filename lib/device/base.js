const {ACTION_QUERY, ACTION_CONTROL, STATE_UNAVAILABLE} = require('./const');

class BaseDevice {
  constructor(ha, state) {
    this.ha = ha;

    this.id = '';
    this.state = STATE_UNAVAILABLE;
    this.name = '';
    this.domain = '';
    this.attributes = {};
    this.supportedFeatures = 0;
    this.featureMasks = {};

    this.parseState(state);
    this.init();
  }

  init() {}

  parseState(state) {
      this.id = state.entity_id;
      this.name = state.name;
      this.state = state.state;
      this.rawName = state.name;
      this.domain = state.domain;

      if ('friendly_name' in state.attributes) {
        this.name = state.attributes.friendly_name;
      }

      if ('supported_features' in state.attributes) {
        this.supportedFeatures = state.attributes.supported_features;
      }
  }

  setAttribute(key, source) {
    if (Array.isArray(key)) {
      return key.every(k => this.setAttribute(k, source));
    } else if (key in source) {
      this.attributes[key] = source[key];
      return true;
    } else {
      return false;
    }
  }

  isSupport(feature) {
    if (this.featureMasks[feature]) {
      return !!this.featureMasks[feature] && this.supportedFeatures;
    } else {
      return feature in this.attributes;
    }
  }

  isAvailable() {
    return this.state.state !== STATE_UNAVAILABLE;
  }

  checkAvailable() {
    if (!this.isAvailable()) {
      throw new Error();//@todo
    }
  }


  async control(service, data = {}) {
    await this.checkAvailable();
    await this.sendRequest(ACTION_CONTROL, {
      'domain': this.domain,
      'service': service,
      'data': data
    });
  }

  async update() {
    if (this.updateThrottling) {
      return;
    } else {
      this.updateThrottling = true;
      setTimeout(() => this.updateThrottling = false, 1000);
    }

    const state = await this.sendRequest(ACTION_QUERY);
    this.parseState(state);
  }

  async updateAndCheck() {
    await this.update();
    this.checkAvailable();
  }

  async sendRequest(action, data = {}) {
    return await this.ha.sendRequest(action, this.id, data);
  }

  getExtraAttribute(key) {}

  setExtraAttribute(key, value) {}
}

module.exports = BaseDevice;