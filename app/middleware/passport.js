

module.exports = (config, app) => {
  return async function(ctx, next) {
    ctx.user = {
      name: 'default'
    };
    //ctx.header.
    await next();
  };
};