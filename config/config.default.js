const os = require('os');
const path = require('path');
const crypto = require('crypto');
const { argv } = process;

let configPath = path.join(os.homedir(), '.harelay');

for (let c in ['-c', '--config-dir']) {
  const path = argv[argv.indexOf(c) + 1];
  if (path && !path.startsWith('-')) {
    configPath = path;
  }
}

module.exports = {
  keys: crypto.createHash('md5').update(`harelay${Date.now()}${Math.random()}`).digest('hex'),
  configPath: configPath,
  middleware: [ 'errorHandler', 'passport' ],
  passport: {
    errorHandler: '/api',
    match: '/api',
  },
  security: {
    csrf: {
      match: '/api',
      //useSession: true
    }
  },
  modules : {
    aligenie: true
  },
  tunnel: {
    host: '0.0.0.0',
    port: 8124,
    timeout: 5000
  }
};