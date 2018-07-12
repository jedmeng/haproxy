const {ACTION_QUERY, ACTION_CONTROL, STATE_UNAVAILABLE} = require('../const');
const {UnsupportedFeatureError, IllegalValueError} = require('../error');

/**
 * 设备
 */
class BaseDevice {
  /**
   * 创建一个设备
   * @param {HA} ha
   * @param {object} state
   */
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

    this.updateThrottling = true;
    setTimeout(() => this.updateThrottling = false, 1000);
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

  async getAttribute(key, needUpdate = true) {
    this.assertSupport(key);
    if (needUpdate) {
      await this.update();
    }
    return this.attributes[key];
  }

  /**
   * 是否支持功能
   * @param {string|string[]} feature
   * @returns {boolean}
   */
  isSupport(feature) {
    if (Array.isArray(feature)) {
      return feature.some(f => this.isSupport(f));
    } else if (this.featureMasks[feature]) {
      return !!(this.featureMasks[feature] & this.supportedFeatures);
    } else {
      return feature in this.attributes;
    }
  }

  assertSupport(feature) {
    if (!this.isSupport(feature)) {
      throw new UnsupportedFeatureError(feature);
    }
  }

  assertValue(value, type, min, max) {
    if (typeof value !== type) {
      throw new IllegalValueError();
    }
    if (type === 'number' && (value < min || value > max)) {
      throw new IllegalValueError();
    }
  }

  assertInList(value, list) {
    if (!list.includes(value)) {
      throw new IllegalValueError();
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


  /**
   *
   * @param {string} service
   * @param {object} data
   * @returns {Promise.<boolean>}
   */
  async control(service, data = {}) {
    this.checkAvailable();
    await this.sendRequest(ACTION_CONTROL, {
      'domain': this.domain,
      'service': service,
      'data': data
    });
    return true;//@todo
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