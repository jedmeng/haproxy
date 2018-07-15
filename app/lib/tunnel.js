const fs = require('fs');
const WebSocket = require('ws');
const EventEmitter = require('events');

/**
 * HA通信隧道
 */
class Tunnel extends EventEmitter {
  constructor(app) {
    super();

    this.app = app;

    this.initHTTP();
    this.initWebSocket();
  }

  /**
   * 初始化http服务器
   */
  initHTTP() {
    const config = this.app.config.tunnel;
    const serverOptions = {};
    let useSSL = true;

    if (config.key && config.cert) {
      serverOptions.key = config.key;
      serverOptions.cert = config.cert;
    } else if (config.key_path && config.cert_path) {
      try {
        serverOptions.key = fs.readFileSync(config.key_path);
        serverOptions.cert = fs.readFileSync(config.cert_path);
      } catch (e) {
        this.app.logger.error('the key file or the cert file does not exist or cannot be read');
        throw e;
      }
    } else {
      useSSL = false;
    }

    const t = useSSL ? require('https') : require('http');
    this.http = new t.createServer(serverOptions);
  }

  /**
   * 初始化WebSocket服务器
   */
  initWebSocket() {
    this.ws = new WebSocket.Server({
      server: this.http
    });

    this.ws.on('connection', (client, req) => this.handleConnection(client, req));
  }

  /**
   * 处理连入请求
   * @param {WebSocket} client
   * @param {http.IncomingMessage} req
   */
  handleConnection(client, req) {
    this.app.logger.debug('client connected: %s', req.connection.remoteAddress);

    client.on('message', data => {
      this.emit('message', {client, data});

      this.app.logger.debug('receive message: %j', data);
    });

    this.emit('connect', client);
  }

  /**
   * 开启服务器
   */
  start() {
    const config = this.app.config;
    const host = config.tunnel.host;
    const port = config.tunnel.port;

    this.http.listen(port, host);

    this.app.logger.info('tunnel start, listen on %s:%s', host, port);
  }
}

module.exports = app => {
  app.tunnel = new Tunnel(app);

  app.ready(() => {
    app.tunnel.start();
  });
};