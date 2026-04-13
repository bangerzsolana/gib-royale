import Components from "../components/index.js";
import PhysicalEntity from "../PhysicalEntity.js";

// Default coin colors — looked up by tokenId at spawn time
const COIN_COLORS = {
  // Blue chips
  BTC: 0xf7931a, ETH: 0x627eea, SOL: 0x14f195,
  // Big memes
  BONK: 0xf7931a, WIF: 0x8993eb, TRUMP: 0xcc2222, POPCAT: 0xff69b4,
  FARTCOIN: 0x88cc44,
  // Mid memes
  FWOG: 0x44bb44, RETARDIO: 0xcc3333, WEN: 0x9944cc, SEND: 0x3388dd,
  PNUT: 0xddaa44, MOODENG: 0x00ccff, MELANIA: 0xff66aa, VINE: 0x00b488,
  // DeFi / Infra
  RAY: 0x5c6bc0, RENDER: 0x00e5ff, PYTH: 0x7b61ff, ORCA: 0xffcc00,
  GRASS: 0x66bb6a, VIRTUAL: 0x8e24aa, JTO: 0xef6c00, LINK: 0x2962ff,
  // AI / Social
  AIXBT: 0x1a237e, GRIFFAIN: 0xffa726, PUMP: 0x00c853, SPX: 0xd32f2f
};

const MIXINS = [
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
    // Use the card's spawn price (from when it appeared in hand) as the tracking baseline
    if (config.spawnPrice) {
      this.deployPrice = config.spawnPrice;
    }
  }

  // Override deductHealth to apply power multiplier from HasPriceData
  // Pumping = take less damage, dumping = take more damage
  deductHealth(amount) {
    const mult = this.powerMultiplier || 1;
    // Inverse: higher power = less damage taken
    const adjusted = Math.round(amount / mult);
    this.currentHealth -= adjusted;
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
