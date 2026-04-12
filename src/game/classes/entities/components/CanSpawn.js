class CanSpawn {
  constructor() {
    var attributes = {
      spawnRate: 2000,
      spawnDelay: 1000,
      spawnType: null,
      createTime: null,
      lastSpawnTime: 0
    };

    Object.assign(this, attributes);
    Object.assign(this, this.constructor.methods);
  }
}

CanSpawn.methods = {
  _init() {},

  spawnFunc(scene) {},

  setSpawnRate(spawnRate) {
    this.spawnRate = spawnRate;
  },

  setSpawnDelay(spawnDelay) {
    this.spawnDelay = spawnDelay;
  },

  setSpawnType(spawnType) {
    this.spawnType = spawnType;
  },

  setSpawnFunc(spawnFunc) {
    this.spawnFunc = spawnFunc;
  },

  _preUpdate(time, delta) {
    if (!this.createTime) this.createTime = time;

    if (time > this.createTime + this.spawnDelay) {
      if (time - this.spawnRate > this.lastSpawnTime) {
        this.lastSpawnTime = time;
        this.spawnFunc();
      }
    }
  },

  _destroy() {}
};

export default CanSpawn;
