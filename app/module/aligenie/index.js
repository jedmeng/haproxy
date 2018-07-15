const AliGate = require('./aligate');


class AliGenie {
  constructor(app) {
    this.app = app;
    this.gates = new Map();

    this.initRouter();
    this.initGates();
  }

  /**
   * 初始化模块路由
   */
  initRouter() {
    const { app } = this;

    // 管理后台路由
    app.router.get('/api/aligenie/fetch', app.controller.aligenie.fetch);
    app.router.post('/api/aligenie/setconfig', app.controller.aligenie.setConfig);

    // 天猫精灵后台路由
    app.router.get('/aligenie/authorize', app.controller.aligenie.showAuthorize);
    app.router.post('/aligenie/authorize', app.controller.aligenie.authorize);
    app.router.post('/aligenie/token', app.controller.aligenie.token);
    app.router.post('/aligenie/gate', app.controller.aligenie.gate);
  }

  /**
   * 初始化gate(客户端交互模块)
   */
  initGates() {
    const { ha } = this.app;

    ha.on('add_client', name => {
      const client = ha.get(name);
      const gate = new AliGate(this.app, client);
      this.gates.set(name, gate);
    });

    ha.on('remove_client', name => {
      this.gates.delete(name);
    });
  }

  /**
   * 获取gate对象
   * @param {string} name
   * @returns {AliGate}
   */
  getGate(name) {
    return this.gates.get(name);
  }
}

module.exports = app => {
  app.logger.debug('load aligenie module');
  return new AliGenie(app);
};