const EventEmitter = require('events');
const log = require('./log')('ha');


class HA extends EventEmitter {
  constructor(hr, client) {
    super();

    this.hr = hr;
    this.client = client;

    this.name = null;
    this.requests = {};
    this.requestIndex = 0;
    this.devices = new Map();
    this.deviceCount = 0;
  }

  async init() {
    this.initEvents();
    await this.handshake();
    await this.syncDevices();

    this.emit('init');
  }

  initEvents() {
    this.client.on('disconnect', (...args) => this.emit('disconnected', ...args));

    this.client.on('message', data => {
      try {
        const msg = JSON.parse(data);
        const msgid = msg.msgid;
        this.requests[msgid].resolve(msg.payload);
      } catch (e) {
        //@todo
        console.log(e);
      }
    });
  }

  /**
   * 发送握手请求
   *
   * @returns {Promise}
   */
  async handshake() {
    const res = await this.sendRequest('welcome');

    if (res.msg !== 'hello') {
      this.terminate();
      log.warn('handshake error');
      throw new Error();//@todo
    }

    this.name = res.name || 'default';
    log.info('handshake success')
  }

  /**
   * 发送同步设备请求
   *
   * @returns {Promise}
   */
  async syncDevices() {
    const res = await this.sendRequest('sync');

    res
      .map(state => {
        try {
          const domain = state.domain.replace(/_/g, '').toLowerCase();
          const Device = require(`./device/${domain}`);
          return new Device(this, state);
        } catch (e) {}
      })
      .filter(Boolean)
      .forEach(device => this.devices.set(device.id, device));

    this.deviceCount = this.devices.size;
    log.info(`sync ${this.deviceCount} devices`);
  }

  /**
   * 发送消息

   * @param {string} message
   */
  send(message) {
      this.client.send(message);
      log.debug('send message: %j', message);
  }

  /**
   * 断开连接
   */
  terminate() {
    this.client.terminate();
    log.debug('connect terminated');
  }

  /**
   * 发送请求
   *
   * @param {string} action
   * @param {string} id
   * @param {object} data
   * @returns {Promise}
   */
  sendRequest(action, id = '', data = {}) {
    const msgid = this.requestIndex++;

    const message = {
      msgid: msgid,
      payload: {
        entity_id: id,
        action, data
      }
    };

    this.send(JSON.stringify(message));

    return new Promise((resolve, reject) => {
      this.requests[msgid] = {resolve, reject};
      //setTimeout(() => reject('timeout'), 5000);
    });
  }
}

module.exports = HA;