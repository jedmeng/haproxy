const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const views = require('koa-views');
const HA = require('./ha');
const Tunnel = require('./tunnel');
const Config = require('./config');

class HARelay {
  constructor() {
    this.config = new Config();
    this.clients = new Map();

    this.initTunnel();
    //this.initWebServer();

    //this.initModules();

    this.start();
  }

  initTunnel() {
    this.tunnel = new Tunnel(this);
    this.tunnel.on('connect', async client => {
      const ha = new HA(this, client);

      ha.once('init', () => this.clients.set(client, ha));
      ha.once('disconnect', () => this.clients.delete(client));
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
    const Tmbot = require('./modules/aligenie');
    const tmbot = new Tmbot(this);
    this.router.use('/tmbot', tmbot.routes());
  }

  start() {
    this.tunnel.start();
    //this.server.listen(3080);
  }

  getStorageInstance(namespace) {

  }
}

module.exports = HARelay;