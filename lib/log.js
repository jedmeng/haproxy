const debug = require('debug');

module.exports = function(namespace) {
  const log = {
    debug: debug(`${namespace}:debug`),
    info: debug(`${namespace}:info`),
    warn: debug(`${namespace}:warn`),
    error: debug(`${namespace}:error`)
  };

  log.info.enabled = log.warn.enabled = log.error.enabled = true;
  return log;
};