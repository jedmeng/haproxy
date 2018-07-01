const {TypeMap, FeatureMap} = require('./const');

class AliDevice {

  /**
   *
   * @param {BaseDevice} device
   */
  constructor(device) {
    this.device = device;
    this.id = this.device.id;
    this.name = this.device.name;
    this.icon = '';
    this.zone = '';
    this.brand = '';
    this.model = '';
    this.type = TypeMap[device.domain];

    this.isSupported = !!this.type;
    this.properties = new Map();
    this.actions = new Set();

    if (this.isSupported) {
      this.init();
    }
  }

  init() {
    this.initProperties();
    this.initActions();
    this.initIcon();
  }

  initProperties() {
  }

  initActions() {
    Object.keys(FeatureMap)
      .filter(feature => this.device.isSupport(feature))
      .map(key => FeatureMap[key])
      .forEach(actions =>
        actions.forEach(item => this.actions.add(item))
      );
  }

  initIcon() {}

  isSupport() {
    return this.isSupported;
  }

  serialize() {
    if (!this.isSupported) {
      throw new Error(); //@todo
    }

    return {
      deviceId: this.id,
      deviceName: this.name,
      deviceType: this.type,
      zone: this.zone,
      brand: this.brand,
      model: this.model,
      icon: this.icon,
      properties: Array.from(this.properties).map(([name, value]) => ({name, value})),
      actions: Array.from(this.actions)
    };
  }

  async update() {
    await this.device.update();
    this.initProperties();
  }

  async query(type) {
    await this.update();

    let properties;

    if (type === 'Query') {
      properties = this.properties;
    } else {

    }
    switch(type) {
      case 'Query':
      case 'QueryColor':
      case 'QueryPowerState':
      case 'QueryTemperature':
      case 'QueryHumidity':
      case 'QueryWindSpeed':
      case 'QueryBrightness':
      case 'QueryFog':
      case 'QueryMode':
      case 'QueryPM25':
      case 'QueryDirection':
      case 'QueryAngle':
    }


    return Array.from(properties).map(([name, value]) => ({name, value}));
  }

}

module.exports = AliDevice;