const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const views = require('koa-views');
const HA = require('./ha');
const Config = require('./config');

class HARelay {
  constructor() {
    this.ha = new HA();
    this.config = new Config();

    //this.initServer();
    this.initTunnel();

    //this.initModules();

    this.start();
  }

  initTunnel() {
    const Tunnel = require('./tunnel/websocket');

    this.tunnel = new Tunnel(this);
    this.tunnel.on('connect', client => {});
    this.tunnel.on('disconnect', client => {});

    this.tunnel.on('message', data => {
      this.tunnel.send('RECEIVE:'+data);
    });
  }

  initServer() {
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