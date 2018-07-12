const AliDevice = require('./alidevice');
const {TypeMap, FeatureMap} = require('./const');
const {AliGenieError, DeviceNotExistError, DeviceNotSupportError, ServerOfflineError, UnknownError} = require('./error');
const HAError = require('../../error');


class AliGate {

  /**
   *
   * @param {HA} ha
   * @param {Map<string, AliDevice>}devices
   */
  constructor(ha, devices) {
    this.ha = ha;

    /**
     * 设备列表
     * @type {Map<string, AliDevice>}
     */
    this.devices = devices;
  }

  async handleRequest(ctx, next) {
    const request = ctx.request.body;

    try{
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
    } catch(e) {
      if (e instanceof HAError.HAError) {

      } else if (!(e instanceof AliGenieError)) {
        e = new UnknownError(e.message);
      }

      ctx.payload = e.serialize();

      const deviceId = ctx.request.body.payload.deviceId;

      if (deviceId) {
        ctx.payload.deviceId = deviceId;
      }
    }

    await this.doResponse(ctx);
  }

  checkHAServer() {
    if (!this.ha || !this.ha.online) {
      throw new ServerOfflineError();
    }
  }

  /**
   *
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

  async handleDiscoveryRequest(ctx, next) {
    ctx.payload = {
      devices: Array.from(this.devices.values()).map(device => device.serialize())
    };
  }

  async handleQueryRequest(ctx, next) {
    const request = ctx.request.body;
    const device = this.getDevice(request.payload.deviceId);

    ctx.extraData = {
      properties: await device.query(request.haeder.name)
    };
  }

  async handleControlRequest(ctx, next) {
    const request = ctx.request.body;
    const device = this.getDevice(request.payload.deviceId);
    const result = await device.control(request.header.name, request.payload);

    if (result === undefined) {
      throw new DeviceNotSupportError();
    }

    ctx.payload = {
      deviceId: device.id
    };
  }

  async doResponse(ctx, next) {
    const request = ctx.request.body;

    ctx.body = Object.assign({
      header: {
        namespace: request.header.namespace,
        name: ctx.error ? 'ErrorResponse' : request.header.name  + 'Response',
        messageId: request.header.messageId,
        payLoadVersion: request.header.payLoadVersion
      },
      payload: ctx.payload
    }, ctx.extraData);
  }
}

module.exports = AliGate;