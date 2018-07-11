const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const views = require('koa-views');
const HA = require('./ha');
const Tunnel = require('./tunnel');
const Config = require('./config');
const MemoryStorage = require('./storage/memory');


class HARelay {
  constructor() {
    this.config = new Config();
    this.clients = new Map();
    this.modules = new Set();

    this.initTunnel();
    this.initWebServer();
    this.initModules();

    this.start();
  }

  initTunnel() {
    this.tunnel = new Tunnel(this);
    this.tunnel.on('connect', async client => {
      const ha = new HA(this, client);
      await ha.init();

      ha.once('init', () => this.clients.set(client, ha));
      ha.once('disconnect', () => this.clients.delete(client));

      Array.from(this.modules).forEach(m => m.initHA(ha));
    });
  }

  initWebServer() {
    this.server = new Koa();

    this.server
      .use(views(__dirname + '/views', { map: { hbs: 'handlebars' }}))
      .use(bodyParser())
      .use(async (ctx, next) => {
        ctx.body = ctx.request.body;
        await next();
      });

    this.router = new Router();
    this.server.use(this.router.routes());
  }

  initModules() {
    const AliGenie = require('./modules/aligenie');
    const aligenie = new AliGenie(this);
    this.router.use('/aligenie', aligenie.routes());
    this.modules.add(aligenie);
  }

  start() {
    this.tunnel.start();
    this.server.listen(3080);
  }

  getStorageInstance(namespace) {
    return new MemoryStorage();
  }
}

module.exports = HARelay;