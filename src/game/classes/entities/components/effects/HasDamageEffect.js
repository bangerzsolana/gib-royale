class HasDamageEffect {
  constructor() {
    var attributes = {
      damageAmount: 10
    };

    Object.assign(this, attributes);
    Object.assign(this, this.constructor.methods);
  }
}

HasDamageEffect.methods = {
  setDamageAmount(damageAmount) {
    this.damageAmount = damageAmount;
  },

  doDamageEffect(target) {
    this.scene.tweens.add({
      targets: [this],
      scaleX: 1.1 + this.damageAmount * 0.025,
      scaleY: 1.1 + this.damageAmount * 0.025,
      ease: "Linear",
      duration: 100,
      yoyo: true,
      repeat: 0,
      callbackScope: this
    });

    target.deductHealth(this.damageAmount);
  },

  _init() {
    this.addEffect(this.doDamageEffect);
  },

  _preUpdate(time, delta) {},

  _destroy() {}
};

export default HasDamageEffect;
