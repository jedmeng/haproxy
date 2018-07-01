const {TypeMap, FeatureMap} = require('./const');
const AliDevice = require('./alidevice');


class AliGate {

  /**
   *
   * @param {HA} ha
   */
  constructor(ha) {
    this.ha = ha;
    this.devices = new Map();

    this.initDevices();
  }

  initDevices() {
    this.ha.devices.values()
      .map(device => new AliDevice(device))
      .filter(aliDevice => aliDevice.isSupport())
      .forEach(aliDevice => this.devices.set(aliDevice.id, aliDevice));
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
      await this.doResponse(ctx);
    } catch(e) {
      ctx.payload = e.payload;
      await this.doResponse(ctx);
    }
  }

  async handleDiscoveryRequest(ctx, next) {
    ctx.payload = {
      devices: this.devices.map(device => device.serialize())
    };
  }

  async handleControlRequest(ctx, next) {
    const request = ctx.request.body;
    const payload = request.payload;

    this.ha.control(payload);

    ctx.payload = {
      deviceId: payload.deviceId
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

  async doResponse(ctx, next) {
    const request = ctx.request.body;

    ctx.body = Object.assign({
      "header": {
        "namespace": request.header.namespace,
        "name": ctx.error ? 'ErrorResponse' : request.header.name  + 'Response',
        "messageId": request.header.messageId,
        "payLoadVersion": request.header.payLoadVersion
      },
      "payload": ctx.payload
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