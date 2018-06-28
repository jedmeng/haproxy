
class TmbotGate {
  constructor() {
    this.ha = new HA();
  }

  async handleRequest(ctx, next) {
    const request = ctx.request.body;

    try{
      switch(request.header.namespace) {
        case 'AliGenie.Iot.Device.Discovery':
          this.handleDiscoveryRequest(ctx, next);
          break;
        case 'AliGenie.Iot.Device.Control':
          this.handleControlRequest(ctx, next);
          break;
        case 'AliGenie.Iot.Device.Query':
          this.handleQueryRequest(ctx, next);
          break;
      }
      this.doResponse(ctx);
    } catch(e) {
      ctx.payload = e.payload;
      this.doResponse(ctx);
    }
  }

  async handleDiscoveryRequest(ctx, next) {
    this.ctx.payload = {
      devices: this.ha.devices
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
    switch(request.haeder.name) {
      case 'Query':
      case 'QueryColor':
      case 'QueryPowerState':
      case 'QueryTemperature':
      case 'QueryHumidity':
      case 'QueryWindSpeed':
      case 'QueryBrightness':
      case 'QueryFog':
      case 'QueryMode':
      case 'QueryPM25':
      case 'QueryDirection':
      case 'QueryAngle':
    }
  }

  async doResponse(ctx, next) {
    const request = ctx.request.body;

    ctx.body = {
      "header": {
        "namespace": request.header.namespace,
        "name": ctx.error ? 'ErrorResponse' : request.header.name  + 'Response',
        "messageId": request.header.messageId,
        "payLoadVersion": request.header.payLoadVersion
      },
      "payload": ctx.payload
    }
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