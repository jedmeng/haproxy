const Controller = require('egg').Controller;

class ApiController extends Controller {
  async index() {
    this.ctx.body = 'Hello world';
  }

  async fetch() {
    const { app, ctx } = this;
    const ha = app.ha.get(ctx.user.name);
  }
}

module.exports = ApiController;