const createTunnel = () => {

};

module.exports = app => {
  app.addSingleton('tunnel', createTunnel);
};
