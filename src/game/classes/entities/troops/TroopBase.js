import Components from "../components/index.js";
import PhysicalEntity from "../PhysicalEntity.js";

// Default coin colors — looked up by tokenId at spawn time
const COIN_COLORS = {
  // Tanks (mega-cap)
  BTC: 0xf7931a, ETH: 0x627eea, SOL: 0x14f195,
  // Fighters (mid-cap)
  BONK: 0xf7931a, WIF: 0x9945ff, TRUMP: 0xff4444, FARTCOIN: 0x44bb44,
  POPCAT: 0xff69b4, MOODENG: 0x00ccff, PNUT: 0xddaa44,
  // Glass Cannons (small-cap)
  FWOG: 0x44bb44, RETARDIO: 0xcc3333, WEN: 0x9944cc, SEND: 0x3388dd
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
      .setMaxVelocity(60, 60)
      .setDrag(20)
      .setBounce(0.5)
      .setFriction(10)
      .setOrigin(0.5, 0.5)
      .setDepth(this.y);

    this.owner = config.owner;
    this.velocityDirection = config.velocityDirection;

    this.setOverallHealth(100);

    // Apply coin color tint and store it for later restoration (e.g. after moon buff)
    if (config.tokenId && COIN_COLORS[config.tokenId]) {
      this.coinColor = COIN_COLORS[config.tokenId];
    } else if (config.owner && config.owner.troopVelocityDirection === 1) {
      this.coinColor = 0xff4444;
    } else {
      this.coinColor = 0x4488ff;
    }
    this.setTint(this.coinColor);

    // Add coin name label that follows the troop
    const label = config.tokenId || "";
    this.coinLabel = scene.add
      .text(this.x, this.y, label, {
        fontSize: "18px",
        fontFamily: "Arial, sans-serif",
        color: "#ffffff",
        fontStyle: "bold",
        stroke: "#000000",
        strokeThickness: 4
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
      this.coinLabel.setPosition(this.x, this.y + 4);
    }
  }

  destroy() {
    if (this.coinLabel) this.coinLabel.destroy();
    super.destroy();
  }
}

export default TroopBase;
