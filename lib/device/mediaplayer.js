const Controllable = require('./controllable');
const {
  ATTR_MEDIA_VOLUME_LEVEL, ATTR_MEDIA_VOLUME_MUTED, ATTR_MEDIA_SEEK_POSITION, ATTR_MEDIA_CONTENT_ID,
  ATTR_MEDIA_CONTENT_TYPE, ATTR_MEDIA_DURATION, ATTR_MEDIA_POSITION, ATTR_MEDIA_POSITION_UPDATED_AT,
  ATTR_MEDIA_TITLE, ATTR_MEDIA_ARTIST, ATTR_MEDIA_ALBUM_NAME, ATTR_MEDIA_ALBUM_ARTIST, ATTR_MEDIA_TRACK,
  ATTR_MEDIA_SERIES_TITLE, ATTR_MEDIA_SEASON, ATTR_MEDIA_EPISODE, ATTR_MEDIA_CHANNEL, ATTR_MEDIA_PLAYLIST,
  ATTR_MEDIA_SHUFFLE, ATTR_APP_ID, ATTR_APP_NAME, ATTR_INPUT_SOURCE, ATTR_INPUT_SOURCE_LIST,
  ATTR_MEDIA_IMAGE_URL, ATTR_MEDIA_IMAGE_HASH, ATTR_ENTITY_PICTURE, ATTR_TOKEN,

  FEATURE_ON_OFF, FEATURE_TOGGLE, FEATURE_VOLUME, FEATURE_VOLUME_MUTE,
  FEATURE_PLAY, FEATURE_PAUSE, FEATURE_STOP, FEATURE_PREVIOUS, FEATURE_NEXT, FEATURE_SEEK,
  FEATURE_PLAY_MEDIA, FEATURE_CLEAR_PLAYLIST, FEATURE_SELECT_SOURCE, FEATURE_SHUFFLE, FEATURE_SOUND_MODE,

  SERVICE_VOLUME_UP, SERVICE_VOLUME_DOWN, SERVICE_VOLUME_MUTE, SERVICE_VOLUME_SET,
  SERVICE_MEDIA_PLAY_PAUSE, SERVICE_MEDIA_PLAY, SERVICE_MEDIA_PAUSE, SERVICE_MEDIA_STOP,
  SERVICE_MEDIA_NEXT_TRACK, SERVICE_MEDIA_PREVIOUS_TRACK, SERVICE_MEDIA_SEEK,
  SERVICE_SHUFFLE_SET, SERVICE_PLAY_MEDIA, SERVICE_SELECT_SOURCE, SERVICE_CLEAR_PLAYLIST
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
      [FEATURE_VOLUME]: SUPPORT_VOLUME_SET,
      [FEATURE_VOLUME_MUTE]: SUPPORT_VOLUME_MUTE,
      [FEATURE_PLAY]: SUPPORT_PLAY,
      [FEATURE_PAUSE]: SUPPORT_PAUSE,
      [FEATURE_STOP]: SUPPORT_STOP,
      [FEATURE_PREVIOUS]: SUPPORT_PREVIOUS_TRACK,
      [FEATURE_NEXT]: SUPPORT_NEXT_TRACK,
      [FEATURE_SEEK]: SUPPORT_SEEK,
      [FEATURE_PLAY_MEDIA]: SUPPORT_PLAY_MEDIA,
      [FEATURE_CLEAR_PLAYLIST]: SUPPORT_CLEAR_PLAYLIST,
      [FEATURE_SELECT_SOURCE]: SUPPORT_SELECT_SOURCE,
      [FEATURE_SHUFFLE]: SUPPORT_SHUFFLE_SET,
      [FEATURE_SOUND_MODE]: SUPPORT_SELECT_SOUND_MODE
    };
  }

  /**
   * @inheritDoc
   * @param {object} state
   */
  parseState(state) {
    super.parseState(state);

    const attributes = [
      ATTR_MEDIA_VOLUME_LEVEL, ATTR_MEDIA_VOLUME_MUTED, ATTR_MEDIA_SEEK_POSITION, ATTR_MEDIA_CONTENT_ID,
      ATTR_MEDIA_CONTENT_TYPE, ATTR_MEDIA_DURATION, ATTR_MEDIA_POSITION, ATTR_MEDIA_POSITION_UPDATED_AT,
      ATTR_MEDIA_TITLE, ATTR_MEDIA_ARTIST, ATTR_MEDIA_ALBUM_NAME, ATTR_MEDIA_ALBUM_ARTIST, ATTR_MEDIA_TRACK,
      ATTR_MEDIA_SERIES_TITLE, ATTR_MEDIA_SEASON, ATTR_MEDIA_EPISODE, ATTR_MEDIA_CHANNEL, ATTR_MEDIA_PLAYLIST,
      ATTR_MEDIA_SHUFFLE, ATTR_APP_ID, ATTR_APP_NAME, ATTR_INPUT_SOURCE, ATTR_INPUT_SOURCE_LIST,
      ATTR_MEDIA_IMAGE_URL, ATTR_MEDIA_IMAGE_HASH, ATTR_ENTITY_PICTURE, ATTR_TOKEN,
    ];
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
   * 获取当前媒体Token
   * @returns {Promise.<string>}
   */
  async getToken() {
    return await this.getAttribute(ATTR_TOKEN);
  }

  /**
   * 获取内容ID
   * @returns {Promise.<number>}
   */
  async getContentId() {
    return await this.getAttribute(ATTR_MEDIA_CONTENT_ID);
  }

  /**
   * 获取内容类型
   * @returns {Promise.<string>}
   */
  async getContentType() {
    return await this.getAttribute(ATTR_MEDIA_CONTENT_TYPE);
  }

  /**
   * 获取内容总长度
   * 单位：秒
   * @returns {Promise.<number>}
   */
  async getDuration() {
    return await this.getAttribute(ATTR_MEDIA_DURATION);
  }

  /**
   * 获取播放进度
   * 单位：秒
   * @returns {Promise.<number>}
   */
  async getPosition() {
    return await this.getAttribute(ATTR_MEDIA_POSITION);
  }

  /**
   * 获取播放进度更新时间（时间戳）
   * @returns {Promise.<number>}
   */
  async getPositionUpdateTime() {
    return await this.getAttribute(ATTR_MEDIA_POSITION_UPDATED_AT);
  }

  /**
   * 获取播放列表标题
   * @returns {Promise.<string>}
   */
  async getPlaylist() {
    return await this.getAttribute(ATTR_MEDIA_PLAYLIST);
  }

  /**
   * 获取媒体标题
   * @returns {Promise.<string>}
   */
  async getMediaTitle() {
    return await this.getAttribute(ATTR_MEDIA_TITLE);
  }

  /**
   * 获取艺术家
   * @returns {Promise.<string>}
   */
  async getAtrist() {
    return await this.getAttribute(ATTR_MEDIA_ARTIST);
  }

  /**
   * 获取专辑名称
   * @returns {Promise.<string>}
   */
  async getAblumName() {
    return await this.getAttribute(ATTR_MEDIA_ALBUM_NAME);
  }

  /**
   * 获取专辑艺术家
   * @returns {Promise.<string>}
   */
  async getAblumArtist() {
    return await this.getAttribute(ATTR_MEDIA_ALBUM_ARTIST);
  }

  /**
   * 获取电视剧标题
   * @returns {Promise.<string>}
   */
  async getSeriesTitle() {
    return await this.getAttribute(ATTR_MEDIA_SERIES_TITLE);
  }

  /**
   * 获取电视剧季数
   * @returns {Promise.<string>}
   */
  async getSeason() {
    return await this.getAttribute(ATTR_MEDIA_SEASON);
  }

  /**
   * 获取电视剧集数
   * @returns {Promise.<string>}
   */
  async getEpisode() {
    return await this.getAttribute(ATTR_MEDIA_EPISODE);
  }

  /**
   * 获取电视频道
   * @returns {Promise.<string>}
   */
  async getChannel() {
    return await this.getAttribute(ATTR_MEDIA_CHANNEL);
  }

  /**
   * 获取应用ID
   * @returns {Promise.<string>}
   */
  async getAppID() {
    return await this.getAttribute(ATTR_APP_ID);
  }

  /**
   * 获取应用名称
   * @returns {Promise.<string>}
   */
  async getAppName() {
    return await this.getAttribute(ATTR_APP_NAME);
  }

  /**
   * 获取图片地址
   * @returns {Promise.<string>}
   */
  async getImageUrl() {
    return await this.getAttribute(ATTR_MEDIA_IMAGE_URL);
  }

  /**
   * 获取图片哈希
   * @returns {Promise.<string>}
   */
  async getImageHash() {
    return await this.getAttribute(ATTR_MEDIA_IMAGE_HASH);
  }

  /**
   * 获取媒体图片
   * @returns {Promise.<string>}
   */
  async getEntityPicture() {
    return await this.getAttribute(ATTR_ENTITY_PICTURE);
  }

  /**
   * 获取音量
   * @returns {Promise<string>}
   */
  async getVolume() {
    return await this.getAttribute(ATTR_MEDIA_VOLUME_LEVEL);
  }

  /**
   * 设置音量
   * 取值范围 0 <= value <= 1
   * @param {number} value
   * @returns {Promise.<boolean>}
   */
  async setVolume(value) {
    this.assertSupport(FEATURE_VOLUME);
    this.assertValue(value, 'number', 0, 1);
    return await this.control(SERVICE_VOLUME_SET, {[ATTR_MEDIA_VOLUME_LEVEL]: value});
  }

  /**
   * 音量上调
   * @returns {Promise.<boolean>}
   */
  async volumeUp() {
    this.assertSupport(FEATURE_VOLUME);
    return await this.control(SERVICE_VOLUME_UP);
  }

  /**
   * 音量下调
   * @returns {Promise.<boolean>}
   */
  async volumeDown() {
    this.assertSupport(FEATURE_VOLUME);
    return await this.control(SERVICE_VOLUME_DOWN);
  }

  /**
   * 是否静音
   * @returns {Promise.<boolean>}
   */
  async isMute() {
    return await this.getAttribute(ATTR_MEDIA_VOLUME_MUTED);
  }

  /**
   * 设置静音状态
   * @param {boolean} value
   * @returns {Promise.<boolean>}
   */
  async setMute(value) {
    this.assertSupport(FEATURE_VOLUME_MUTE);
    this.assertValue(value, 'boolean');
    return await this.control(SERVICE_VOLUME_MUTE, {[ATTR_MEDIA_VOLUME_MUTED]: value});
  }

  /**
   * 播放
   * @returns {Promise.<boolean>}
   */
  async play() {
    this.assertSupport(FEATURE_PLAY);
    return await this.control(SERVICE_MEDIA_PLAY);
  }

  /**
   * 暂停播放
   * @returns {Promise.<boolean>}
   */
  async pause() {
    this.assertSupport(FEATURE_PAUSE);
    return await this.control(SERVICE_MEDIA_PAUSE);
  }

  /**
   * 暂停或继续
   * @returns {Promise.<boolean>}
   */
  async playPause() {
    this.assertSupport(FEATURE_PLAY);
    return await this.control(SERVICE_MEDIA_PLAY_PAUSE);
  }

  /**
   * 停止播放
   * @returns {Promise.<boolean>}
   */
  async stop() {
    this.assertSupport(FEATURE_STOP);
    return await this.control(SERVICE_MEDIA_STOP);
  }

  /**
   * 获取当前音轨
   * @returns {Promise.<*>}
   */
  async getTrack() {
    return await this.getAttribute(ATTR_MEDIA_TRACK);
  }

  /**
   * 下一曲
   * @returns {Promise.<boolean>}
   */
  async next() {
    this.assertSupport(FEATURE_NEXT);
    return await this.control(SERVICE_MEDIA_NEXT_TRACK);
  }

  /**
   * 上一曲
   * @returns {Promise.<boolean>}
   */
  async previous() {
    this.assertSupport(FEATURE_PREVIOUS);
    return await this.control(SERVICE_MEDIA_PREVIOUS_TRACK);
  }

  /**
   * 跳转到指定位置
   * @param {number} value
   * @returns {Promise.<boolean>}
   */
  async seek(value) {
    this.assertSupport(FEATURE_SEEK);
    this.assertValue(value, 'number', 0, await this.getDuration());
    return await this.control(SERVICE_MEDIA_SEEK, {[ATTR_MEDIA_SEEK_POSITION]: value});
  }

  /**
   * 随机模式是否开启
   * @returns {Promise.<boolean>}
   */
  async isShuffle() {
    return await this.getAttribute(ATTR_MEDIA_SHUFFLE);
  }

  /**
   * 设置随机模式
   * @param {boolean} value
   * @returns {Promise.<boolean>}
   */
  async setShuffle(value) {
    this.assertSupport(FEATURE_SHUFFLE);
    this.assertValue(value, 'boolean');
    return await this.control(SERVICE_SHUFFLE_SET, {[ATTR_MEDIA_SHUFFLE]: value});
  }

  /**
   * 获取视频源列表
   * @returns {Promise.<string[]>}
   */
  async getSourceList() {
    return await this.getAttribute(ATTR_INPUT_SOURCE_LIST, false);
  }

  /**
   * 获取当前视频源
   * @returns {Promise.<string>}
   */
  async getSource() {
    return await this.getAttribute(ATTR_INPUT_SOURCE);
  }

  /**
   * 设置视频源
   * @param {string} value
   * @returns {Promise.<boolean>}
   */
  async setSource(value) {
    this.assertSupport(FEATURE_SELECT_SOURCE);
    this.assertInList(value, await this.getSourceList());
    return await this.control(SERVICE_SELECT_SOURCE, value);
  }

  /**
   * 清空播放列表
   * @returns {Promise.<boolean>}
   */
  async clearPlaylist() {
    this.assertSupport(FEATURE_CLEAR_PLAYLIST);
    return await this.control(SERVICE_CLEAR_PLAYLIST);
  }



}

module.exports = MediaPlayer;