import Components from "../components/index.js";
import PhysicalEntity from "../PhysicalEntity.js";

// Default coin colors — looked up by tokenId at spawn time
const COIN_COLORS = {
  BONK: 0xf7931a, WIF: 0x9945ff, TRUMP: 0xff4444, FARTCOIN: 0x44bb44,
  POPCAT: 0xff69b4, MOODENG: 0x00ccff, SOL: 0x14f195, PNUT: 0xddaa44
};

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
      "circle-troop"
    );

    const { scene } = config;
    this.scene = scene;

    // Store animKeyPrefix for compatibility but don't play animations
    this.animKeyPrefix = config.animKeyPrefix;

    const width = this.width;
    const height = this.height;
    this.setCircle(width / 4, width / 4, height / 4)
      .setCollideWorldBounds(true)
      .setMaxVelocity(30, 30)
      .setDrag(10)
      .setBounce(0.5)
      .setFriction(10)
      .setOrigin(0.5, 0.5)
      .setDepth(this.y);

    this.owner = config.owner;
    this.velocityDirection = config.velocityDirection;

    this.setOverallHealth(100);

    // Apply coin color tint
    if (config.tokenId && COIN_COLORS[config.tokenId]) {
      this.setTint(COIN_COLORS[config.tokenId]);
    } else if (config.owner && config.owner.troopVelocityDirection === 1) {
      // Opponent troops get a red tint
      this.setTint(0xff4444);
    } else {
      this.setTint(0x4488ff);
    }

    // Add coin name label that follows the troop
    const label = config.tokenId || "";
    this.coinLabel = scene.add
      .text(this.x, this.y, label, {
        fontSize: "9px",
        fontFamily: "Arial, sans-serif",
        color: "#ffffff",
        fontStyle: "bold",
        stroke: "#000000",
        strokeThickness: 2
      })
      .setOrigin(0.5, 0.5)
      .setDepth(999997);

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

    // Keep coin label following the troop
    if (this.coinLabel && !this.isDestroyed) {
      this.coinLabel.setPosition(this.x, this.y + 2);
    }
  }

  destroy() {
    if (this.coinLabel) this.coinLabel.destroy();
    super.destroy();
  }
}

export default TroopBase;
