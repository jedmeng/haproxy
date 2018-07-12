const ControllableDevice = require('./controllable');
const {formatNumber} = require('../utils');
const {
  ATTR_BRIGHTNESS, ATTR_HS_COLOR, ATTR_COLOR_TEMP, ATTR_WHITE_VALUE,
  ATTR_MIN_MIREDS, ATTR_MAX_MIREDS, ATTR_EFFECT, ATTR_EFFECT_LIST,
  FEATURE_BRIGHTNESS, FEATURE_COLOR_TEMP, FEATURE_EFFECT, FEATURE_FLASH,
  FEATURE_COLOR, FEATURE_TRANSITION, FEATURE_WHITE_VALUE,
  SERVICE_TURN_ON
} = require('../const');

const SUPPORT_BRIGHTNESS = 1;
const SUPPORT_COLOR_TEMP = 2;
const SUPPORT_EFFECT = 4;
const SUPPORT_FLASH = 8;
const SUPPORT_COLOR = 16;
const SUPPORT_TRANSITION = 32;
const SUPPORT_WHITE_VALUE = 128;


class Light extends ControllableDevice {

  init() {
    this.featureMasks = {
      [FEATURE_BRIGHTNESS]: SUPPORT_BRIGHTNESS,
      [FEATURE_COLOR_TEMP]: SUPPORT_COLOR_TEMP,
      [FEATURE_EFFECT]: SUPPORT_EFFECT,
      [FEATURE_FLASH]: SUPPORT_FLASH,
      [FEATURE_COLOR]: SUPPORT_COLOR,
      [FEATURE_TRANSITION]: SUPPORT_TRANSITION,
      [FEATURE_WHITE_VALUE]: SUPPORT_WHITE_VALUE
    };
  }

  parseState(state) {
    super.parseState(state);

    const attributes = [
      ATTR_BRIGHTNESS, ATTR_HS_COLOR, ATTR_COLOR_TEMP, ATTR_WHITE_VALUE,
      ATTR_MIN_MIREDS, ATTR_MAX_MIREDS, ATTR_EFFECT, ATTR_EFFECT_LIST
    ];

    this.setAttribute(attributes, state.attributes);
  }

  async getBrightness() {
    await this.update();
    const isOn = await this.isOn();
    return isOn ? (this.attributes[ATTR_BRIGHTNESS] || -1) : 0;
  }

  async setBrightness(value) {
    value = formatNumber(value, 0, 0, 255);
    return await this.control(SERVICE_TURN_ON, {[ATTR_BRIGHTNESS]: value});
  }

  async getColorTemp() {
    await this.update();
    return this.attributes[ATTR_COLOR_TEMP] || -1;
  }

  async setColorTemp(value) {
    value = formatNumber(value, 0, this.attributes[ATTR_MIN_MIREDS], this.attributes[ATTR_MAX_MIREDS]);
    return await this.control(SERVICE_TURN_ON, {[ATTR_BRIGHTNESS]: value});
  }

  getColor() {

  }

  async setColor() {

  }


}

module.exports = Light;