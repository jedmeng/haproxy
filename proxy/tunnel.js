const net = require('net');

class Tunnel {
  constructor() {
    this.socket = new net.Server();
    this.socket.listen();
  }
}