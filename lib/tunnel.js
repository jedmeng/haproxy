const fs = require('fs');
const http = require('http');
const https = require('https');
const WebSocket = require('ws');
const EventEmitter = require('events');
const log = require('./log')('tunnel');


class Tunnel extends EventEmitter {
  /**
   *
   * @param {HARelay} hr
   */
  constructor(hr) {
    super();

    this.hr = hr;
    this.clients = new Map();

    this.initHTTP();
    this.initServer();
  }

  /**
   * 初始化http服务器
   */
  initHTTP() {
    const hr = this.hr;
    const serverOptions = {};
    let useSSL = true;

    if (hr.config.exists('tunnel.key', 'tunnel.cert')) {
      serverOptions.key = hr.config.get('tunnel.key');
      serverOptions.cert = hr.config.get('tunnel.cert');
    } else if (hr.config.exists('tunnel.key_path', 'tunnel.cert_path')) {
      try {
        serverOptions.key = fs.readFileSync(hr.config.get('tunnel.key_path'));
        serverOptions.cert = fs.readFileSync(hr.config.get('tunnel.cert_path'));
      } catch (e) {
        // @todo
        throw e;
      }
    } else {
      useSSL = false;
    }

    const t = useSSL ? https : http;
    this.http = new t.createServer(serverOptions);
  }

  /**
   * 初始化websocket服务器
   */
  initServer() {
    this.client = null;
    this.server = new WebSocket.Server({
      server: this.http
    });

    this.server.on('connection', (client, req) => this.initClient(client, req));
  }

  /**
   * 开启服务器
   */
  start() {
    const host = this.hr.config.get('tunnel.host', '0.0.0.0');
    const port = this.hr.config.get('tunnel.port', 8124);

    this.http.listen(port, host);

    log.info('server start, listen on %s:%s', host, port);
  }

  /**
   * 初始化websocket客户端
   *
   * @param {WebSocket} client
   * @param {http.IncomingMessage} req
   */
  initClient(client, req) {
    log.debug('client connected: %s', req.connection.remoteAddress);

    client.on('message', data => {
      this.emit('message', {client, data});

      log.debug('receive message: %j', data);
    });

    this.emit('connect', client);
  }

}

module.exports = Tunnel;