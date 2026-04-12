class HasDestructionScreenShake {
  constructor() {
    var attributes = {};

    Object.assign(this, attributes);
    Object.assign(this, this.constructor.methods);
  }
}

HasDestructionScreenShake.methods = {
  _destroy() {
    try {
      if (!this.isDestroyed)
        this.scene.cameras.main.shake();
    } catch (e) {
      console.error(e);
    }
  }
};

export default HasDestructionScreenShake;
