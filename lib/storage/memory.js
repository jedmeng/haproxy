class MemoryStorage {

  constructor() {
    this.data = {};
  }

  get(key) {
    return this.data[key];
  }

  set(key, value) {
    return this.data[key] = value;
  }

  remove(key) {
    return this.set(key);
  }

  static getInstance(name) {
    if (this.instances === undefined) {
      this.instances = name;
    }

    if (this.instances[name] === undefined) {
      this.instances[name] = new MemoryStorage();
    }

    return this.instances[name];
  }

}

module.exports = MemoryStorage;