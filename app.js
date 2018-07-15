module.exports = app => {
  app.beforeStart(() => {
    require('./app/lib/storage')(app);
    require('./app/lib/tunnel')(app);
    require('./app/lib/ha')(app);
    require('./app/module/loader')(app);
  });
};