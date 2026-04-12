import Components from "../components/index.js";
import PhysicalEntity from "../PhysicalEntity.js";

const MIXINS = [
  Components.CanBeAttacked,
  Components.CanBeSpawned,
  Components.HasHealth,
  Components.HasShadow,
  Components.HasDestructionParticles,
  Components.HasEffects,
  Components.HasDamageEffect,
  Components.HasPriceData
];

class TroopBase extends PhysicalEntity {
  constructor(extraMixins, config) {
    super(
      [...MIXINS, ...extraMixins],
      config.scene,
      config.x,
      config.y,
      "character"
    );

    const { scene } = config;
    this.scene = scene;

    this.animKeyPrefix = config.animKeyPrefix;

    this.anims.play(`${this.animKeyPrefix}--front`, true);

    const width = this.width;
    const height = this.height;
    this.setCircle(width / 4, width / 4, height / 2 + 1)
      .setCollideWorldBounds(true)
      .setMaxVelocity(30, 30)
      .setDrag(10)
      .setBounce(0.5)
      .setFriction(10)
      .setOrigin(0.5, 1)
      .setDepth(this.y);

    this.owner = config.owner;
    this.velocityDirection = config.velocityDirection;

    this.setOverallHealth(100);

    // If a tokenId was passed in the config, set it for price tracking
    if (config.tokenId) {
      this.setTokenId(config.tokenId);
    }
  }

  // Override deductHealth to apply defense multiplier from HasPriceData
  deductHealth(amount) {
    const reduced = Math.round(amount / (this.defenseMultiplier || 1));
    this.currentHealth -= reduced;
    this.updateHealthDisplay();
    this.checkIfDead();
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);
  }

  destroy() {
    super.destroy();
  }
}

export default TroopBase;
