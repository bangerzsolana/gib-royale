class CanBeSpawned {
  constructor() {
    var attributes = {
      cost: 3
    };

    Object.assign(this, attributes);
    Object.assign(this, this.constructor.methods);
  }
}

CanBeSpawned.methods = {};

export default CanBeSpawned;
