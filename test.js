const axios = require('axios');
const querystring = require('querystring');

const prefix = 'http://localhost:3080/aligenie';
const clientId = 'tmbot';
const redirectUri = 'https://open.bot.tmall.com/oauth/callback?skillId=15777&token=MjE5Njg4MTQ1MUFGRUhJTkZEVlE=';
const secret = 'e065276916006f80a6893479d370907efe0fc9d1';


class Test {
  async step1() {
    const params = {
      allowed: true,
      client_id: clientId,
      grant_type: 'authorization_code',
      response_type: 'code',
      redirect_uri: redirectUri,
      state: 'ok'
    };
    return await axios.post(`${prefix}/authorize`, querystring.stringify(params));
  }
  async step2(code) {
    const params = {
      client_id: clientId,
      grant_type: 'authorization_code',
      client_secret: secret,
      code: code,
      redirect_uri: redirectUri
    };
    return await axios.post(`${prefix}/token`, querystring.stringify(params));
  }

  async gateRequest(namespace, name, payload) {

    const data = {
      "header": {
        "namespace": namespace,
        "name": name,
        "messageId": "1bd5d003-31b9-476f-ad03-71d471922820",
        "payLoadVersion": 1
      },
      "payload": payload
    };

    return await axios.post(`${prefix}/gate`, data);
  }

  async discover(token) {
    const payload = {
      "accessToken": token
    };

    return await this.gateRequest('AliGenie.Iot.Device.Discovery', 'DiscoveryDevices', payload);
  }

  async control(token) {
    const payload = {
      "accessToken": token,
      "deviceId": "media_player.living_room",
      "deviceType": "XXX",
      "attribute": "powerstate",
      "value": "on",
      "extensions": {
        "extension1": "",
        "extension2": ""
      }
    };


    return await this.gateRequest('AliGenie.Iot.Device.Control', 'TurnOn', payload);
  }

  async run() {
    try {
      let resp;
      resp = await this.step1();
      resp = await this.step2('0aee6d9efdb34ea5fff09e8ae19bb990333469e6');
      resp = await this.discover(resp.data.access_token);
      console.log(resp.data, resp.data.payload.devices);
    } catch (e) {
      console.log(e);
    }
  }
}

new Test().run();