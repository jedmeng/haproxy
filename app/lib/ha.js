const EventEmitter = require('events');


/**
 * Home Assistant实例
 */
class HA {
  constructor(app, client) {
    this.app = app;
    this.client = client;

    this.name = 'default';
    this.version = '';
    this.requests = {};
    this.requestIndex = 0;
    this.devices = new Map();
    this.deviceCount = 0;
    this.online = false;

    this.init().then(() => {
      clients.add(this);
    }, e => {
      this.app.logger.warn(e.message);
    });
  }

  /**
   * 初始化客户端
   * @returns {Promise<void>}
   */
  async init() {
    this.initEvents();
    await this.handshake();
    await this.syncDevices();
  }

  /**
   * 初始化事件
   */
  initEvents() {
    this.client.on('close', () => {
      this.online = false;
      this.app.logger.info('connect terminated');
      clients.remove(this);
    });

    this.client.on('message', data => {
      try {
        const message = JSON.parse(data);
        const messageId = message.msg_id;
        this.requests[messageId].resolve(message.payload);
        this.requests[messageId] = undefined;
      } catch (e) {
        this.app.logger.warn('message is in the wrong format: %s', data);
      }
    });
  }

  /**
   * 发送握手请求
   * @returns {Promise<void>}
   */
  async handshake() {
    /**
     * @type {{ msg: string, name: string, version: string }}
     */
    const res = await this.sendRequest('welcome');

    if (res.msg !== 'hello') {
      this.terminate();
      this.app.logger.warn('Handshake error');
      throw new Error('Illegal client');
    }

    this.online = true;
    //this.name = res.name; // @todo
    this.version = res.version;
    this.app.logger.info('Handshake success');
  }

  /**
   * 发送同步设备请求
   * @returns {Promise<void>}
   */
  async syncDevices() {
    const res = await this.sendRequest('sync');

    res
      .map(state => {
        try {
          const domain = state.domain.replace(/_/g, '').toLowerCase();
          const Device = require(`./device/${domain}`);
          return new Device(this, state);
        } catch (e) {
          this.app.logger.info('Device type %s not support', state.domain);
          this.app.logger.debug(e.message);
        }
      })
      .filter(Boolean)
      .forEach(device => this.devices.set(device.id, device));

    this.deviceCount = this.devices.size;
    this.app.logger.info(`Sync ${this.deviceCount} devices`);
  }

  /**
   * 发送消息
   * @param {string} message
   */
  send(message) {
      this.client.send(message);
      this.app.logger.debug('Send message: %j', message);
  }

  /**
   * 断开连接
   */
  terminate() {
    this.client.terminate();
  }

  /**
   * 发送请求
   * @param {string} action
   * @param {string} entityId
   * @param {object} data
   * @returns {Promise<*>}
   */
  sendRequest(action, entityId = '', data = {}) {
    const messageId = this.requestIndex++;

    const message = {
      msg_id: messageId,
      payload: {
        entity_id: entityId,
        action,
        data
      }
    };

    this.send(JSON.stringify(message));

    return new Promise((resolve, reject) => {
      this.requests[messageId] = {resolve, reject};
      setTimeout(() => reject('timeout'), this.app.config.tunnel.timeout);
    }).catch(e => {
      this.app.logger.warn('Request error: %s', e.message);
    });
  }

  /**
   * 获取设备列表
   * @returns {any[]}
   */
  getDevices() {
    return Array.from(this.devices.values());
  }
}

/**
 * 客户端管理器
 */
const clients = Object.assign(new EventEmitter(), {
  /**
   * @var {Map<string, HA>}
   */
  clients: new Map(),

  /**
   * 获取客户端
   * @param {string} name
   * @returns {HA | undefined}
   */
  get(name) {
    return this.clients.get(name);
  },

  /**
   * 添加客户端
   * @param {HA} ha
   */
  add(ha) {
    const name = ha.name;
    this.clients.set(ha.name, ha);
    this.emit('add_client', name);
  },

  /**
   * 移除客户端
   * @param {HA} ha
   */
  remove(ha) {
    const name = ha.name;
    this.clients.delete(name);
    this.emit('remove_client', name);
  }
});


module.exports = app => {
  app.ha = clients;

  app.tunnel.on('connect', client => {
    new HA(app, client);
  });
};