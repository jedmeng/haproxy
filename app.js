const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const views = require('koa-views');
const HA = require('./lib/ha');

class HAProxy {
  constructor() {
    this.ha = new HA();
    this.config = {};

    this.initServer();
    this.initRouter();
    this.initModule();

    this.listen();
  }

  initServer() {
    this.server = new Koa();

    this.server
      .use(views(__dirname + '/views', { map: { hbs: 'handlebars' }}))
      .use(bodyParser())
      .use(async (ctx, next) => {
        ctx.body = ctx.request.body;
        await next();
      })
      .use(router.routes());

    app.listen(3080);
  }

  initRouter() {
    this.router = new Router();
    this.server.use(this.router.routes());
  }

  initModule() {
    const Tmbot = require('./modules/tmbot');
    const tmbot = new Tmbot(this);
    router.use('/tmbot', tmbot.routes());
  }

  listen() {
    this.server.listen(3080);
  }
}

new HAProxy();