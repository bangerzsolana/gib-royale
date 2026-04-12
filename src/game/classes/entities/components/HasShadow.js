class HasShadow {
  constructor() {
    var attributes = {
      shadow: null
    };

    Object.assign(this, attributes);
    Object.assign(this, this.constructor.methods);
  }
}

HasShadow.methods = {
  _init() {
    this.shadow = this.scene.add.ellipse(
      this.x,
      this.y,
      this.width * 0.8,
      this.height * 0.4,
      0x000000,
      0.2
    );
    this.shadow.setDepth(2);
  },

  _preUpdate() {
    this.shadow.setPosition(this.x, this.y + this.height / 4);
  },

  _destroy() {
    this.shadow.destroy();
  }
};

export default HasShadow;
