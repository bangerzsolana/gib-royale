import Phaser from "phaser";

const MIXINS = [];

export default class Entity extends Phaser.GameObjects.Sprite {
  constructor(extraMixins, scene, x, y, sprite) {
    super(scene, x, y, sprite);
    this.isInitialized = false;
    this.isDestroyed = false;

    scene.add.existing(this);

    this.mixins = [...MIXINS, ...extraMixins];
    this.mixins.forEach(component => {
      let componentInstance = new component();
      Object.assign(this, componentInstance);
    });
  }

  preUpdate(time, delta) {
    if (!this.isInitialized) {
      this.mixins.forEach(component => {
        if (component.methods._init) component.methods._init.call(this);
      });
      this.isInitialized = true;
    }

    this.mixins.forEach(component => {
      if (component.methods._preUpdate)
        component.methods._preUpdate.call(this, time, delta);
    });

    super.preUpdate(time, delta);
  }

  destroy() {
    this.isDestroyed = true;

    this.mixins.forEach(component => {
      if (component.methods._destroy) component.methods._destroy.call(this);
    });

    super.destroy();
  }
}
