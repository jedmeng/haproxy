

module.exports = (config, app) => {
  return async function(ctx, next) {
    try {
      await next();
    } catch (e) {
      ctx.app.emit('error', e, ctx);
      ctx.status = 500;
      ctx.body = {
        error: e.message
      };
    }
  };
};