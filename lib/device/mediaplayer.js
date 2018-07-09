const Controllable = require('./controllable');
const {
  ATTR_MEDIA_VOLUME_LEVEL, ATTR_MEDIA_VOLUME_MUTED, ATTR_MEDIA_SEEK_POSITION, ATTR_MEDIA_CONTENT_ID,
  ATTR_MEDIA_CONTENT_TYPE, ATTR_MEDIA_DURATION, ATTR_MEDIA_POSITION, ATTR_MEDIA_POSITION_UPDATED_AT,
  ATTR_MEDIA_TITLE, ATTR_MEDIA_ARTIST, ATTR_MEDIA_ALBUM_NAME, ATTR_MEDIA_ALBUM_ARTIST, ATTR_MEDIA_TRACK,
  ATTR_MEDIA_SERIES_TITLE, ATTR_MEDIA_SEASON, ATTR_MEDIA_EPISODE, ATTR_MEDIA_CHANNEL, ATTR_MEDIA_PLAYLIST,
  ATTR_MEDIA_ENQUEUE, ATTR_MEDIA_SHUFFLE, ATTR_INPUT_SOURCE, ATTR_INPUT_SOURCE_LIST, ATTR_SOUND_MODE,
  ATTR_SOUND_MODE_LIST,
  FEATURE_ON_OFF, FEATURE_TOGGLE, FEATURE_PAUSE, FEATURE_STOP, FEATURE_RETURN_HOME, FEATURE_FAN_SPEED,
  FEATURE_BATTERY, FEATURE_STATUS, FEATURE_SEND_COMMAND, FEATURE_LOCATE, FEATURE_CLEAN_SPOT,
  SERVICE_SET_FAN_SPEED, SERVICE_START_PAUSE, SERVICE_STOP, SERVICE_CLEAN_SPOT,
  SERVICE_LOCATE, SERVICE_RETURN_TO_BASE, SERVICE_SEND_COMMAND,
} = require('./const');

const SUPPORT_PAUSE = 1;
const SUPPORT_SEEK = 2;
const SUPPORT_VOLUME_SET = 4;
const SUPPORT_VOLUME_MUTE = 8;
const SUPPORT_PREVIOUS_TRACK = 16;
const SUPPORT_NEXT_TRACK = 32;
const SUPPORT_TURN_ON = 128;
const SUPPORT_TURN_OFF = 256;
const SUPPORT_PLAY_MEDIA = 512;
const SUPPORT_VOLUME_STEP = 1024;
const SUPPORT_SELECT_SOURCE = 2048;
const SUPPORT_STOP = 4096;
const SUPPORT_CLEAR_PLAYLIST = 8192;
const SUPPORT_PLAY = 16384;
const SUPPORT_SHUFFLE_SET = 32768;
const SUPPORT_SELECT_SOUND_MODE = 65536;


/**
 * 媒体类设备
 * 如：电视、音乐播放器
 */
class MediaPlayer extends Controllable {

  /**
   * @inheritDoc
   */
  init() {
    this.featureMasks = {
      [FEATURE_PAUSE]: SUPPORT_PAUSE,
      [FEATURE_STOP]: SUPPORT_STOP,
      [FEATURE_RETURN_HOME]: SUPPORT_RETURN_HOME,
      [FEATURE_FAN_SPEED]: SUPPORT_FAN_SPEED,
      [FEATURE_BATTERY]: SUPPORT_BATTERY,
      [FEATURE_STATUS]: SUPPORT_STATUS,
      [FEATURE_SEND_COMMAND]: SUPPORT_SEND_COMMAND,
      [FEATURE_LOCATE]: SUPPORT_LOCATE,
      [FEATURE_CLEAN_SPOT]: SUPPORT_CLEAN_SPOT,
    };
  }

  /**
   * @inheritDoc
   * @param {object} state
   */
  parseState(state) {
    super.parseState(state);

    const attributes = [ATTR_MEDIA_VOLUME_LEVEL, ATTR_MEDIA_VOLUME_MUTED, ATTR_MEDIA_SEEK_POSITION,
      ATTR_MEDIA_CONTENT_ID, ATTR_MEDIA_CONTENT_TYPE, ATTR_MEDIA_DURATION, ATTR_MEDIA_POSITION,
      ATTR_MEDIA_POSITION_UPDATED_AT, ATTR_MEDIA_TITLE, ATTR_MEDIA_ARTIST, ATTR_MEDIA_ALBUM_NAME,
      ATTR_MEDIA_ALBUM_ARTIST, ATTR_MEDIA_TRACK, ATTR_MEDIA_SERIES_TITLE, ATTR_MEDIA_SEASON,
      ATTR_MEDIA_EPISODE, ATTR_MEDIA_CHANNEL, ATTR_MEDIA_PLAYLIST, ATTR_MEDIA_ENQUEUE, ATTR_MEDIA_SHUFFLE,
      ATTR_INPUT_SOURCE, ATTR_INPUT_SOURCE_LIST, ATTR_SOUND_MODE, ATTR_SOUND_MODE_LIST];
    this.setAttribute(attributes, state.attributes);
  }

  /**
   * @inheritDoc
   * @param {string} feature
   * @returns {boolean}
   */
  isSupport(feature) {
    if ([FEATURE_ON_OFF, FEATURE_TOGGLE].includes(feature)) {
      return !!(this.supportedFeatures & (SUPPORT_TURN_ON | SUPPORT_TURN_OFF));
    } else {
      return super.isSupport(feature);
    }
  }

  /**
   * 获取音量
   * @returns {Promise<string>}
   */
  async getVolume() {
    return await this.getAttribute(ATTR_STATUS);
  }

  /**
   * 获取电池数据
   * @returns {Promise<number>}
   */
  async getBattery() {
    this.assertSupport(FEATURE_BATTERY);
    return await this.getAttribute(ATTR_BATTERY_LEVEL);
  }

  /**
   * 获取吸力大小列表
   * @returns {Promise<string[]>}
   */
  async getFanSpeedList() {
    return await this.getAttribute(ATTR_FAN_SPEED_LIST, false);
  }

  /**
   * 获取吸力大小
   * @returns {Promise<string>}
   */
  async getFanSpeed() {
    return await this.getAttribute(ATTR_FAN_SPEED);
  }

  /**
   * 设置吸力大小
   * @param {string} value
   * @returns {Promise<boolean>}
   */
  async setFanSpeed(value) {
    this.assertSupport(FEATURE_FAN_SPEED);
    return await this.control(SERVICE_SET_FAN_SPEED, {[ATTR_FAN_SPEED]: value});
  }

  /**
   * 开始
   * @returns {Promise<boolean>}
   */
  async start() {
    this.assertSupport(FEATURE_PAUSE);
    if (await this.isOn()) {
      return true;
    } else {
      return await this.control(SERVICE_START_PAUSE);
    }
  }

  /**
   * 暂停
   * @returns {Promise<boolean>}
   */
  async pause() {
    this.assertSupport(FEATURE_PAUSE);
    if (await this.isOn()) {
      return await this.control(SERVICE_START_PAUSE);
    } else {
      return true;
    }
  }

  /**
   * 停止
   * @returns {Promise<boolean>}
   */
  async stop() {
    this.assertSupport(FEATURE_STOP);
    return await this.control(SERVICE_STOP);
  }

  /**
   * 定点清扫
   * @returns {Promise<boolean>}
   */
  async cleanSpot() {
    this.assertSupport(FEATURE_CLEAN_SPOT);
    return await this.control(SERVICE_CLEAN_SPOT);
  }

  /**
   * 定位
   * @returns {Promise<boolean>}
   */
  async locate() {
    this.assertSupport(FEATURE_LOCATE);
    return await this.control(SERVICE_LOCATE);
  }

  /**
   * 回充
   * @returns {Promise<boolean>}
   */
  async returnToBase() {
    this.assertSupport(FEATURE_RETURN_HOME);
    return await this.control(SERVICE_RETURN_TO_BASE);
  }

  /**
   * 发送指令
   * @param {string} value
   * @returns {Promise<boolean>}
   */
  async sendCommand(value) {
    this.assertSupport(FEATURE_SEND_COMMAND);
    return await this.control(SERVICE_SEND_COMMAND, {[ATTR_COMMAND]: value});
  }
}

module.exports = MediaPlayer;