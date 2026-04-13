import Phaser from "phaser";

class HasEffects {
  constructor() {
    var attributes = {
      effects: [],
      effectRate: 1000,
      effectRange: 60,
      attentionRange: 100,
      lastEffectTime: -1,
      effectTarget: null,
      attentionArea: null
    };

    Object.assign(this, attributes);
    Object.assign(this, this.constructor.methods);
  }
}

HasEffects.methods = {
  addEffect(effect) {
    this.effects.push(effect);
  },

  doEffects(target) {
    this.effects.forEach(effect => {
      effect.call(this, this.effectTarget);
    });
  },

  setEffectRate(effectRate) {
    this.effectRate = effectRate;
  },

  setEffectRange(effectRange) {
    this.effectRange = effectRange;
  },

  setAttentionRange(attentionRange) {
    if (this.attentionArea) {
      this.attentionArea
        .setSize(attentionRange * 2, attentionRange * 2)
        .setOrigin(0.5, 0.5);
    }
    this.attentionRange = attentionRange;
  },

  setLastEffectTime(lastEffectTime) {
    this.lastEffectTime = lastEffectTime;
  },

  setEffectTarget(effectTarget) {
    this.effectTarget = effectTarget;
  },

  initAttentionArea(radius) {
    if (this.attentionArea) this.attentionArea.destroy();

    this.attentionArea = this.scene.physics.add
      .existing(
        this.scene.add.zone(
          this.x,
          this.y,
          radius * 2,
          radius * 2,
          0xff0000,
          0.1
        )
      )
      .setOrigin(0.5, 0.5)
      .setDepth(100);
    this.attentionArea.troop = this;
  },

  canDoEffect() {
    return this.effectTarget ? false : true;
  },

  initiateEffect(target) {
    if (this.canDoEffect()) {
      this.startDoingEffect(target);
    }
  },

  startDoingEffect(target) {
    if (!this.effectTarget) {
      this.effectTarget = target;
    }
  },

  stopDoingEffect() {
    this.effectTarget = null;
  },

  _init() {
    this.initAttentionArea(this.attentionRange);
    this.owner.aggroAreas.add(this.attentionArea);
  },

  _preUpdate(time, delta) {
    try {
      if (this.attentionArea) {
        this.attentionArea.setPosition(this.x, this.y);
      }

      if (this.effectTarget && !this.effectTarget.isDestroyed) {
        const effectTarget = this.effectTarget;

        let distance = Phaser.Math.Distance.Between(
          this.x,
          this.y,
          effectTarget.x,
          effectTarget.y
        );

        if (distance > this.effectRange) {
          if (this.canMove)
            this.scene.physics.moveTo(
              this,
              effectTarget.x,
              effectTarget.y,
              200
            );
        } else {
          this.setAcceleration(0, 0);
          this.setVelocity(0, 0);
          if (time - this.effectRate > this.lastEffectTime) {
            this.lastEffectTime = time;
            this.doEffects(this.effectTarget);
          }
        }
      } else {
        this.effectTarget = null;
      }
    } catch (e) {
      console.error(e);
    }
  },

  _destroy() {
    if (this.attentionArea) this.attentionArea.destroy();
  }
};

export default HasEffects;
