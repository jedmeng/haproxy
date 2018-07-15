const {ACTION_QUERY, ACTION_CONTROL, STATE_UNAVAILABLE} = require('../../const');
const {UnsupportedFeatureError, IllegalValueError, DeviceUnavailableError} = require('../../error');

/**
 * @typedef {{entity_id: string, domain: string, state: string, name: string, attributes: object}} StateObject
 */

/**
 * 设备
 */
class BaseDevice {
  /**
   * @param {HA} ha
   * @param {StateObject} state
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

    this.update(state)
      .then(() => this.init());
  }

  /**
   * 设备初始化
   */
  init() {}

  /**
   * 更新设备状态
   * @param {StateObject?} state
   * @returns {Promise<void>}
   */
  async update(state) {
    if (!state && this.updateThrottling) {
      return;
    } else {
      this.updateThrottling = true;
      setTimeout(() => this.updateThrottling = false, 1000);
    }

    if (!state) {
      state = await this.sendRequest(ACTION_QUERY);
    }

    this.parseState(state);
  }

  /**
   * 解析设备属性
   * @param {StateObject} state
   */
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

  /**
   * 获取设备属性
   * @param {string} key
   * @param {boolean} update
   * @returns {Promise<*>}
   */
  async getAttribute(key, update = true) {
    this.assertSupport(key);
    await this.assertAvailable(update);
    return this.attributes[key];
  }

  /**
   * 复制到设备属性
   * @param {string|string[]} key
   * @param {object} source
   * @returns {*}
   */
  copyAttribute(key, source) {
    if (Array.isArray(key)) {
      return key.every(k => this.copyAttribute(k, source));
    } else if (key in source) {
      this.attributes[key] = source[key];
      return true;
    } else {
      return false;
    }
  }

  /**
   * 设备是否在线
   * @returns {boolean}
   */
  isAvailable() {
    return this.state.state !== STATE_UNAVAILABLE;
  }

  /**
   * 判断设备是否支持单个或多个功能
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

  /**
   * 校验设备支持属性
   * @param feature
   */
  assertSupport(feature) {
    if (!this.isSupport(feature)) {
      throw new UnsupportedFeatureError();
    }
  }

  /**
   * 数据合法性校验
   * @param {*} value
   * @param {string} type
   * @param {number} min
   * @param {number} max
   */
  assertValue(value, type, min, max) {
    if (typeof value !== type) {
      throw new IllegalValueError();
    }
    if (type === 'number' && (value < min || value > max)) {
      throw new IllegalValueError();
    }
  }

  /**
   * 校验数据是否在列表中
   * @template T
   * @param {T} value
   * @param {T[]} list
   */
  assertInList(value, list) {
    if (!list.includes(value)) {
      throw new IllegalValueError();
    }
  }

  /**
   * 检查设备可用性
   */
  async assertAvailable(update = true) {
    if (update) {
      await this.update();
    }
    if (!this.isAvailable()) {
      throw new DeviceUnavailableError();
    }
  }

  /**
   * 控制设备
   * @param {string} service
   * @param {object} data
   * @returns {Promise.<boolean>}
   */
  async control(service, data = {}) {
    // @todo 是否需要检查设备可用性
    return await this.ha.sendRequest(ACTION_CONTROL, this.id, {
      'domain': this.domain,
      'service': service,
      'data': data
    });
  }
}

module.exports = BaseDevice;