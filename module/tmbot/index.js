const Router = require('koa-router');
const Gate = require('./gate');


class Tmbot {
  constructor() {
    this.router = new Router();
    
    
  }

  routes() {
    return this.router.routes();
  }




}
