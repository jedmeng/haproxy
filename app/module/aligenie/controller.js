const Controller = require('egg').Controller;
const {AliGenieError, DeviceNotExistError, DeviceNotSupportError, ServerOfflineError, UnknownError} = require('./error');


class ApiController extends Controller {
  /**
   * 获取gate对象
   * @returns {AliGate}
   */
  getGate() {
    const { app, ctx } = this;
    const gate = app.modules.aligenie.getGate(ctx.user.name);
    if (!gate) {
      throw new ServerOfflineError();
    }
    return gate;
  }

  /**
   * 获取设备列表
   * @returns {Promise<void>}
   */
  async fetch() {
    const { ctx } = this;
    const gate = this.getGate();

    ctx.body = gate.serializeDevicesForApi();
  }

  /**
   * 修改设备配置
   * @returns {Promise<void>}
   */
  async setConfig() {
    const { ctx } = this;
    ctx.body = { success: true };
  }

  /**
   * 显示授权界面
   * @returns {Promise<void>}
   */
  async showAuthorize() {
    await this.ctx.redirect('/#/aligenie/authorize');
  }

  async authorize() {
    const { ctx } = this;
    if (ctx.body.allowed !== 'true') {
      throw new Error('Not Authorized');
    }


  }

  async token() {

  }

  async gate() {
    const request = ctx.request.body;

      this.checkHAServer();

      switch (request.header.namespace) {
        case 'AliGenie.Iot.Device.Discovery':
          await this.handleDiscoveryRequest(ctx, next);
          break;
        case 'AliGenie.Iot.Device.Control':
          await this.handleControlRequest(ctx, next);
          break;
        case 'AliGenie.Iot.Device.Query':
          await this.handleQueryRequest(ctx, next);
          break;
      }
  }
}

module.exports = ApiController;