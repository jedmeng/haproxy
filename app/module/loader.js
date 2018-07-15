module.exports = app => {
  const config = app.config.modules;
  const modules = {};
  Object.keys(config)
    .filter(key => config[key])
    .forEach(key => {
      try {
        modules[key] = require(`./${key}`)(app);
      } catch (e) {
        app.logger.error('%s module not exist', key);
        app.logger.debug(e);
      }
    });
  app.modules = modules;
};