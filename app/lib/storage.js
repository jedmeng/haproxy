const fs = require('fs');
const path = require('path');
const extend = require('extend2');
const isPlainObject = require('is-plain-object');

const wrapper = (fun, context, ...args) => {
  return new Promise((resolve, reject) => {
    fun.call(context, ...args, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

const exist = path => wrapper(fs.access, fs, path).then(() => true, () => false);
const accessible = path => wrapper(fs.access, fs, path, fs.constants.R_OK | fs.constants.W_OK);
const mkdir = path => wrapper(fs.mkdir, fs, path);
const writeFile = (path, content) => wrapper(fs.writeFile, fs, path, content, 'utf-8');
const readFile = path => wrapper(fs.readFile, fs, path, 'utf-8');

// 用户配置文件初始值
const defaultConfig = `
module.exports = {
};
`.trim();

module.exports = async app => {
  const configPath = app.config.configPath;
  const configFile = path.resolve(configPath, 'config.js');
  const dataDir = path.join(configPath, 'data');

  app.beforeStart(async () => {
    // 初始化用户配置目录和配置文件
    try{
      if (await exist(configPath)) {
        if (await exist(dataDir)) {
          await accessible(dataDir);
        } else {
          app.logger.info('user data dir is not exist, trying to build');
          await mkdir(dataDir);
        }
        if (!(await exist(configFile))) {
          app.logger.info('user config is not exist, trying to make');
          await writeFile(configFile, defaultConfig);
        }
      } else {
        await mkdir(configPath);
        await mkdir(dataDir);
        await writeFile(configFile, defaultConfig);
        app.logger.info('user config initialized');
      }
    } catch (e) {
      const message = 'user config dir has no write permissions';
      app.logger.error(`${message}: ${e.message}`);
      throw new Error(message);
    }

    const config = require(configFile);
    if (!isPlainObject(config)) {
      throw new Error('config format is wrong');
    }

    // 将用户配置合并至config
    extend(true, app.config, config);

    app.logger.debug('user config loaded');

    // 设置storage对象，用于保存用户数据
    app.storage = {
      /**
       * 读取配置
       * @param {string} namespace
       * @returns {Promise<object>}
       */
      async get(namespace) {
        try {
          const content = await readFile(path.join(dataDir, `${namespace}.js`));
          return JSON.parse(content);
        } catch (e) {
          return {};
        }
      },
      /**
       * 写入配置
       * @param {string} namespace
       * @param {object} data
       * @returns {Promise<void>}
       */
      async save(namespace, data) {
        await writeFile(path.join(dataDir, `${namespace}.js`), JSON.stringify(data));
      }
    };
  });

};