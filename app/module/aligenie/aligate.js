const AliDevice = require('./alidevice');
const {TypeMap, FeatureMap} = require('./const');
const {AliGenieError, DeviceNotExistError, DeviceNotSupportError, ServerOfflineError, UnknownError} = require('./error');


class AliGate {
  constructor(app, ha) {
    this.app = app;
    this.ha = ha;

    this.devices = new Map();

    this.initDevices();
  }

  /**
   * 初始化设备
   */
  initDevices() {
    this.ha.getDevices()
      .filter(device => AliDevice.isSupport(device))
      .map(device => new AliDevice(this.app, device))
      .forEach(async aliDevice => {
        await aliDevice.init();
        this.devices.set(aliDevice.id, aliDevice);
      });
  }

  /**
   * 获取设备
   * @param id {string}
   * @returns {AliDevice}
   */
  getDevice(id) {
    const device = this.devices.get(id);
    if (device) {
      return device;
    } else {
      throw new DeviceNotExistError();
    }
  }

  /**
   * 获取全部设备列表
   * @returns {AliDevice[]}
   */
  getDevices() {
    return Array.from(this.devices.values());
  }

  /**
   * 序列化设备
   * @returns {object[]}
   */
  serializeDevices() {
    return this.getDevices()
      .filter(device => device.isEnable())
      .map(device => device.serialize());
  }

  /**
   * 序列化设备
   * @returns {object[]}
   */
  serializeDevicesForApi() {
    return this.getDevices()
      .map(device => device.serializeForApi());
  }

  /**
   * 查询设备信息
   * @param {string} id
   * @param {string} name
   * @returns {Promise<object>}
   */
  async queryDevice(id, name) {
    return await this.getDevice(id).query(name);
  }

  /**
   * 控制设备
   * @param {string} id
   * @param {string} name
   * @param {object} payload
   * @returns {Promise<boolean>}
   */
  async controlDevice(id, name, payload = {}) {
    return await this.getDevice(id).control(name, payload);
  }

  /**
   * 修改设备配置
   * @param {string} id
   * @param {object} config
   * @returns {Promise<void>}
   */
  async setDeviceConfig(id, config) {

    this.getDevice(id).setConfig(config);
  }


  checkHAAviable() {
    if (!this.ha || !this.ha.online) {
      throw new ServerOfflineError();
    }
  }


}

module.exports = AliGate;