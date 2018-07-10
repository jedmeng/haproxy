const {Property, Action, Mode, TypeMap, FeatureMap, QueryToProperty} = require('./const');
const DeviceConst = require('../../device/const');
const {DeviceNotSupportError, InvalidateControlError} = require('./error');
const {formatNumber} = require('../../utils');

const MAX_VALUE = 'max';
const MIN_VALUE = 'min';


class AliDevice {

  /**
   *
   * @param {BaseDevice|Light|Fan|Climate} device
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
  }

  async init() {
    await this.initProperties();
    this.initActions();
    this.initIcon();
  }

  async initProperties() {
    if (this.device.isSupport(DeviceConst.FEATURE_ON_OFF)) {
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

    // 风速 [fan, aircondition]
    if (this.device.isSupport(DeviceConst.FEATURE_SPEED)) {
      let list = await this.device.getSpeedList();
      const speed = await this.device.getSpeed();
      const index = list.index.indexOf(speed);

      if (this.type === 'fan') {
        const level = Math.round((index / list.length) * 4);
        this.properties.set(Property.WIND_SPEED, level);
      } else if (this.type === 'aircondition') {
        //@todo 空调风速
        this.properties.set(Property.WIND_SPEED, ACSpeedList[level]);
      }
    }

    // 风向
    if (this.device.isSupport(DeviceConst.FEATURE_DIRECTION)) {
      this.properties.set(Property.DIRECTION, this.device.getDirection());
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
    await this.initProperties();
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
        throw new DeviceNotSupportError();
      }
    }

    return Array.from(properties).map(([name, value]) => ({name, value}));
  }

  async control(name, payload) {
    let current = null;

    switch (name) {
      // 开关相关
      case Action.TURN_ON:
        return await this.device.turnOn();
      case Action.TURN_OFF:
        return await this.device.turnOff();

      // 温度相关
      case Action.ADJUST_UP_TEMPERATURE:
        current = await this.device.getCurrenTemperature();
        return await this.setTemperature(current - payload.value);
      case Action.ADJUST_DOWN_TEMPERATURE:
        current = await this.device.getCurrenTemperature();
        return await this.setTemperature(current + payload.value);
      case Action.SET_TEMPERATURE:
        return await this.setTemperature(payload.value);

      // 湿度相关
      case Action.SET_HUMIDITY:
        current = await this.device.getCurrentHumidity();
        return await this.setHumidity(current - payload.value);
      case Action.ADJUST_UP_HUMIDITY:
        current = await this.device.getCurrentHumidity();
        return await this.setHumidity(current + payload.value);
      case Action.ADJUST_DOWN_HUMIDITY:
        return await this.setHumidity(payload.value);

      // 风速相关
      case Action.ADJUST_UP_WIND_SPEED:
        return await this.setWindSpeed(0, - payload.value);
      case Action.ADJUST_DOWN_WIND_SPEED:
        return await this.setWindSpeed(0, payload.value);
      case Action.SET_WIND_SPEED:
        return await this.setWindSpeed(payload.value);

      // 摆风相关
      case Action.OPEN_SWING:
        return await this.setSwing(true);
      case Action.CLOSE_SWING:
        return await this.setSwing(false);
      case Action.OPEN_UP_SWING:
      case Action.OPEN_DOWN_SWING:
      case Action.OPEN_UP_AND_DOWN_SWING:
      case Action.OPEN_LEFT_SWING:
      case Action.OPEN_RIGHT_SWING:
      case Action.OPEN_LEFT_AND_RIGHT_SWING:
      case Action.OPEN_FORWARD_SWING:
      case Action.OPEN_BACK_SWING:
      case Action.OPEN_FORWARD_AND_BACK_SWING:
        const direction = name.substr(0, name.length - 5).replace('And', ',').toLowerCase();
        return await this.setDirection(direction);

      // 音量相关
      case Action.ADJUST_UP_VOLUME:
      case Action.ADJUST_DOWN_VOLUME:
      case Action.SET_VOLUME:
      case Action.SET_MUTE:
      case Action.CANCEL_MUTE:

      // 播放相关
      case Action.PLAY:
      case Action.PAUSE:
      case Action.CONTINUE:
      case Action.FAST_FORWARD:
      case Action.NEXT:
      case Action.PREVIOUS:
      case Action.SELECT_CHANNEL:

      // 亮度相关
      case Action.ADJUST_UP_BRIGHTNESS:
        current = await this.device.getBrightness();
        return await this.setBrightness(current - payload.value);
      case Action.ADJUST_DOWN_BRIGHTNESS:
        current = await this.device.getBrightness();
        return await this.setBrightness(current + payload.value);
      case Action.SET_BRIGHTNESS:
        return await this.setBrightness(payload.value);

      // 色彩相关
      case Action.SET_COLOR:

      // 其他
      case Action.SET_MODE:
        return await this.setMode(payload.value);
      case Action.CANCEL_MODE:
      case Action.OPEN_FUNCTION:
      case Action.CLOSE_FUNCTION:
      case Action.CANCEL:

      default:
        throw InvalidateControlError();
    }

  }

  /**
   * 设置温度
   * @param {number} value
   * @returns {Promise.<boolean>}
   */
  async setTemperature(value) {
    const min = this.device.getMinTemperature();
    const max = this.device.getMaxTemperature();
    value = formatNumber(value, 0, min, max);

    if (this.device.isSupport(DeviceConst.FEATURE_TEMPERATURE)) {
      return await this.device.setTemperature(value);
    } else if (this.device.isSupport(DeviceConst.FEATURE_TEMPERATURE_RANGE)) {
      // 有些设备只支持温度区间的形式
      const r1 = await this.device.setTemperatureLow(value);
      const r2 = await this.device.setTemperatureHigh(value);
      return r1 && r2;
    }
  }

  /**
   * 设置湿度
   * @param {number} value
   * @returns {Promise.<boolean>}
   */
  async setHumidity(value) {
    const min = this.device.getMinHumidity();
    const max = this.device.getMaxHumidity();
    value = formatNumber(value, 0, min, max);
    return await this.device.setHumidity(value);
  }

  /**
   * 设置摆风的状态
   * @param value
   * @returns {Promise.<boolean>}
   */
  async setSwing(value) {
    if (this.device.domain === DeviceConst.DOMAIN_FAN) {
      await this.device.setOscillating(value);
    } else if (this.device.domain === DeviceConst.DOMAIN_CLIMATE) {
      const swingList = await this.device.getSwingModeList();

      // 从模式列表中模糊查找关闭选项
      const swingOffModeIndex = swingList.findIndex(item => item.toLowerCase().includes('off'));

      if (swingOffModeIndex === -1) {
        throw new DeviceNotSupportError();
      } else if (!value) {
        return await this.device.setSwingMode(swingList[swingOffModeIndex]);
      } else if (swingOffModeIndex === 0) {
        // 当开启摆风时，默认使用第一个非停止的选项
        return await this.device.setSwingMode(swingList[1]);
      } else {
        return await this.device.setSwingMode(swingList[0]);
      }
    }
  }

  /**
   * 设置风速
   * @param {number|string} value
   * @param {number|undefined} [offset]
   * @returns {Promise.<boolean>}
   */
  async setWindSpeed(value, offset) {
    if (![DeviceConst.DOMAIN_FAN, DeviceConst.DOMAIN_CLIMATE].includes(this.device.domain)) {
      throw new DeviceNotSupportError();
    }

    const isFan = this.device.domain === DeviceConst.DOMAIN_FAN;

    let list = isFan ?
      await this.device.getSpeedList() :
      await this.device.getFanModeList();

    // 过滤掉关闭选项
    list = list.filter(item => item.toLowerCase().includes('off'));

    if (offset) {
      const current = isFan ?
        await this.device.getSpeed() :
        await this.device.getFanMode();

      const valueIndex = formatNumber(list.indexOf(current) + offset, 0, 0, list.length - 1);
      value = list[valueIndex];
    } else if (value === MAX_VALUE) {
      value = list[list.length - 1];
    } else if (value === MIN_VALUE) {
      value = list[0];
    } else if (isFan) {
      value = list[formatNumber(value / 4 * list.length)];
    } else {
      // 模糊匹配auto
      const auto = list.find(item => item.toLowerCase().includes('auto'));

      if (value === 'auto') {
        // 用index做映射
        const index = ['low', 'middle', 'high'].indexOf(value);
        const newList = list.filter(item => item !== auto);
        value = newList[formatNumber(index / 3 * newList.length)];
      } else if (auto) {
        value = auto;
      } else {
        throw new DeviceNotSupportError();
      }

    }
    return await this.device.setSpeed(value);
  }

  /**
   * 设置摆风的方向
   * @param {string} direction
   * @returns {Promise.<boolean>}
   */
  async setDirection(direction) {
    if (this.device.domain === DeviceConst.DOMAIN_FAN) {
      if (direction === 'left' || direction === 'right') {
        return await this.device.setDirection(direction);
      } else {
        throw new InvalidateControlError();
      }
    } else if (this.device.domain === DeviceConst.DOMAIN_CLIMATE) {
      const swingList = this.device.getSwingModeList();
      let mode = swingList.find(m => m === direction);
      if (!mode) {
        mode = swingList.find(m => direction.includes(m));
      }
      if (!mode) {
        mode = swingList.find(m => m.includes(direction));
      }
      if (mode) {
        return await this.device.setSwingMode(mode);
      } else {
        throw new InvalidateControlError();
      }
    }
  }

  /**
   * 设置亮度
   * @param {number} value
   * @returns {Promise.<boolean>}
   */
  async setBrightness(value) {
    const min = this.device.getMinHumidity();
    const max = this.device.getMaxHumidity();
    value = formatNumber(value, 0, min, max);
    return await this.device.setHumidity(value);
  }

  /**
   * 设置模式
   * @param {string} value
   * @returns {Promise.<boolean>}
   */
  async setMode(value) {
    const domain = this.device.domain;

    if (domain === DeviceConst.DOMAIN_CLIMATE) {
      const list = this.device.getOptionModeList();
      if (list.includes(value)) {
        return await this.device.setOptionMode(value);
      } else {
        throw new InvalidateControlError();
      }
    }
  }
}

module.exports = AliDevice;