
const AliDevice = require('./alidevice');
const {TypeMap, FeatureMap} = require('./const');
const {AliGenieError, UnknownError} = require('./error');


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
      if (!(e instanceof AliGenieError)) {
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

  async handleDiscoveryRequest(ctx, next) {
    ctx.payload = {
      devices: Array.from(this.devices.values()).map(device => device.serialize())
    };
  }

  async handleQueryRequest(ctx, next) {
    const request = ctx.request.body;
    const id = request.payload.deviceId;
    const device = this.devices.get(id);

    if (device) {
      ctx.extraData = {
        properties: await device.query(request.haeder.name)
      };
    } else {
      throw new Error() //@todo
    }
  }

  async handleControlRequest(ctx, next) {
    const request = ctx.request.body;
    const payload = request.payload;

    this.ha.control(payload);

    ctx.payload = {
      deviceId: payload.deviceId
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



// switch(request.haeder.name) {
//   case 'TurnOn':
//   case 'TurnOff':
//   case 'SelectChannel':
//   case 'AdjustUpChannel':
//   case 'AdjustDownChannel':
//   case 'AdjustUpVolume':
//   case 'AdjustDownVolume':
//   case 'SetVolume':
//   case 'SetMute':
//   case 'CancelMute':
//   case 'Play':
//   case 'Pause':
//   case 'Continue':
//   case 'Next':
//   case 'Previous':
//   case 'SetBrightness':
//   case 'AdjustUpBrightness':
//   case 'AdjustDownBrightness':
//   case 'SetTemperature':
//   case 'AdjustUpTemperature':
//   case 'AdjustDownTemperature':
//   case 'SetWindSpeed':
//   case 'AdjustUpWindSpeed':
//   case 'AdjustDownWindSpeed':
//   case 'SetMode':
//   case 'SetColor':
//   case 'OpenFunction':
//   case 'CloseFunction':
//   case 'Cancel':
//   case 'CancelMode':
// };