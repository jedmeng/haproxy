class MemoryStorage {

  constructor(hp, namespace) {
    this.data = {};
    this.load();
  }

  get(key) {
    return this.data[key];
  }

  set(key, value) {
    this.data[key] = value;
    this.save();
    return value;
  }

  remove(key) {
    return this.set(key);
  }

  load() {

  }

  save() {

  }

  static getInstance(hp, name) {
    if (this.instances === undefined) {
      this.instances = name;
    }

    if (this.instances[name] === undefined) {
      this.instances[name] = new MemoryStorage(hp, name);
    }

    return this.instances[name];
  }

}

module.exports = MemoryStorage;