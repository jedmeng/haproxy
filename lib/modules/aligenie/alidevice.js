const {Property, TypeMap, FeatureMap, PropertyMap, QueryToProperty} = require('./const');
const DeviceConst = require('../../device/const');
const {DeviceNotSupportError, InvalidateControlError} = require('./error');

class AliDevice {

  /**
   *
   * @param {BaseDevice} device
   */
  constructor(device) {
    this.device = device;
    this.id = this.device.id;
    this.name = this.device.name;
    this.icon = '';
    this.zone = '';
    this.brand = '';
    this.model = '';
    this.isVisible = true;
    this.enabledActions = new Set();
    this.type = TypeMap[device.domain];

    this.isSupported = !!this.type;
    this.properties = new Map();
    this.actions = new Set();

    if (this.isSupported) {
      this.init();
    }
  }

  init() {
    this.initProperties();
    this.initActions();
    this.initIcon();
  }

  initProperties() {
    if (this.device.isSupport(DeviceConst.FEATURE_TOGGLE)) {
      this.properties.set(Property.POWER_STATE, this.device.isAvailable() ? 'on' : 'off');
    }

    if (this.device.isSupport(DeviceConst.FEATURE_COLOR)) {
      //@todo 颜色映射
    }

    if (this.device.isSupport(DeviceConst.FEATURE_COLOR_TEMP)) {
      //@todo 单位待定
    }

    if (this.device.isSupport(DeviceConst.FEATURE_BRIGHTNESS)) {
      //@todo 单位待定
    }


    this.properties.set(Property.ONLINE_STATE, this.device.isAvailable() ? 'online' : 'offline');
    this.properties.set(Property.REMOTE_STATUS, 'on');

  }

  initActions() {
    Object.keys(FeatureMap)
      .filter(feature => this.device.isSupport(feature))
      .map(key => FeatureMap[key])
      .forEach(actions =>
        actions.forEach(item => this.actions.add(item))
      );
  }

  initIcon() {}

  isSupport() {
    return this.isSupported;
  }

  serialize() {
    if (!this.isSupported) {
      throw new DeviceNotSupportError();
    }

    return {
      deviceId: this.id,
      deviceName: this.name,
      deviceType: this.type,
      zone: this.zone,
      brand: this.brand,
      model: this.model,
      icon: this.icon,
      properties: Array.from(this.properties).map(([name, value]) => ({name, value})),
      actions: Array.from(this.actions)
    };
  }

  async update() {
    await this.device.update();
    this.initProperties();
  }

  async query(type) {
    await this.update();

    let properties;

    if (type === 'Query') {
      properties = this.properties;
    } else {
      const property = QueryToProperty[type];
      if (property && this.properties.has(property)) {
        properties = new Map([[property, this.properties.get(property)]]);
      } else {
        throw new InvalidateControlError();
      }
    }

    return Array.from(properties).map(([name, value]) => ({name, value}));
  }

}

module.exports = AliDevice;