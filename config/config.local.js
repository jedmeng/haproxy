const path = require('path');

module.exports = {
  keys: '1234567890',
  configPath: path.join(__dirname, '../custom_config'),
  modules : {
    aligenie: true
  },
  tunnel: {
    host: '0.0.0.0',
    port: 8124,
    timeout: 5000
  },
  logger: {
    level: 'NONE',
    consoleLevel: 'DEBUG'
  }
};