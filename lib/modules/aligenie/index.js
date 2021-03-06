const Router = require('koa-router');
const Gate = require('./aligate');
const AliDevice = require('./alidevice');
const OAuth = require('../../oauth');
const Controller = require('../../controller');

const redirectUri = 'https://open.bot.tmall.com/oauth/callback';

class AliGenie extends Controller {

  constructor(hr) {
    super();
    this.hr = hr;
    this.gates = new Map();
    this.config = hr.config;

    this.initRouter();
    this.initOAuth();
  }

  async initHA(ha) {
    const name = ha.name;
    if (name === null) {
      throw new Error()//@todo
    }

    const devices = new Map();
    const gate = new Gate(ha, devices);
    this.gates.set(name, gate);

    const deviceList = Array.from(ha.devices.values())
      .map(device => new AliDevice(device))
      .filter(aliDevice => aliDevice.isSupport());

    return await Promise.all(deviceList.map(async aliDevice => {
      await aliDevice.init();
      devices.set(aliDevice.id, aliDevice);
    }));
  }

  initRouter() {
    const router = new Router();

    // request authorize
    router.get('/authorize', async ctx => {
      // show Device config and Authorize Page
      await ctx.render('authorize2.hbs', { from: '天猫精灵', devices: this.getDeviceList() });
    });

    // confirm authorize
    router.post('/authorize', async ctx => {
      if (ctx.body.allowed !== 'true') {
        ctx.throw(403);
      }

      await this.generateDeviceConfig(ctx.body.devices);

      const data = await this.oauth.authorize(ctx);
      const connector = data.redirectUri.includes('?') ? '&' : '?';

      ctx.redirect(data.redirectUri + connector + `code=${data.authorizationCode}&state=${ctx.query.state}`);
    });

    // request token
    router.post('/token', async ctx => {
      try {
        const data = await this.oauth.token(ctx);
        ctx.body = {
          access_token: data.accessToken,
          refresh_token: data.refreshToken,
          expires_in: Math.floor((data.accessTokenExpiresAt.getTime() - Date.now()) / 1000)
        }
      } catch (e) {
        ctx.body = {
          error: -1,
          error_description: e.message
        };
      }
    });

    router.post('/gate', async (ctx, next) => {
      try {
        const client = await this.oauth.authenticate(ctx, ctx.body.payload.accessToken);
        const gate = this.gates.get('default');
        await gate.handleRequest(ctx, next);
      } catch (e) {
        ctx.body = {
          error: -1,
          error_description: e.message
        };
      }
    });

    this.router = router;
  }

  initOAuth() {
    const secret = OAuth.generateSecret();
    this.oauth = new OAuth(this.hr, {
      id: 'tmbot',
      secret: secret,
      redirectUri: 'https://open.bot.tmall.com/oauth/callback?skillId=15777&token=MjE5Njg4MTQ1MUFGRUhJTkZEVlE=',
    });
  }

  routes() {
    return this.router.routes();
  }

  async validateRequest() {
    return function(ctx) {
      const query = ctx.query;

      // validate client_id
      if (!this.oauth.checkClientId(query.client_id)) {
        ctx.throw(400);
      }

      // validate redirect_uri
      const uri = query.redirect_uri;
      if (redirectUri && !(uri === redirectUri || uri.startsWith(redirectUri + '?'))) {
        ctx.throw(400);
      }

      // validate response_type
      if (query.response_type) {
        query.response_type === 'code' || ctx.throw(400);
      } else if (query.grant_type) {
        ['authorization_code', 'refresh_token'].includes(grant_type) || ctx.throw(400);
      } else {
        ctx.throw(400);
      }
    }
  }

  getDeviceList() {
    return {};
  }

  async generateDeviceConfig() {

  }

  static buildRequest(ctx, next) {

  }
}

module.exports = AliGenie;