class IsImmovable {
  constructor() {
    var attributes = {};

    Object.assign(this, attributes);
    Object.assign(this, this.constructor.methods);
  }
}

IsImmovable.methods = {
  _init() {
    if (this.body) this.body.setImmovable(true);
  }
};

export default IsImmovable;
