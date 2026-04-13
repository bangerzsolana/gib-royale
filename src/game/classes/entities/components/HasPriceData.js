import { priceService } from "../../../services/PriceService.js";

/**
 * HasPriceData component — the core mechanic that makes this game unique.
 *
 * Links a deployed troop to a real token's price action:
 * - Pumping tokens (positive % change) = higher attack power
 * - Dumping tokens (negative % change) = higher defense (damage reduction)
 * - % change is tracked from the moment of deployment (personal P&L)
 */
class HasPriceData {
  constructor() {
    var attributes = {
      tokenId: null,
      priceChangePercent: 0,
      deployPrice: null, // Price snapshot at deployment — all % change is relative to this
      baseDamage: 10,
      baseHealth: 100,
      baseMovementSpeed: 0, // Set at spawn from troop's hardcoded speed
      lastPriceUpdate: 0,
      priceUpdateInterval: 2000, // Update stats every 2 seconds
      damageMultiplier: 1,
      defenseMultiplier: 1,
      speedMultiplier: 1, // Market-cap-based: heavy coins move slower
      priceIndicator: null
    };

    Object.assign(this, attributes);
    Object.assign(this, this.constructor.methods);
  }
}

HasPriceData.methods = {
  setTokenId(tokenId) {
    this.tokenId = tokenId;
  },

  setBaseDamage(baseDamage) {
    this.baseDamage = baseDamage;
  },

  setBaseHealth(baseHealth) {
    this.baseHealth = baseHealth;
  },

  /**
   * Recalculate attack/defense based on current price action.
   *
   * Pumping hard (>10%): Glass cannon — 2-3x damage, normal HP
   * Steady green (1-10%): Balanced attacker — 1-2x damage
   * Flat/crabbing (-1% to 1%): Utility — normal stats
   * Dipping (-1% to -10%): Shield — 0.5x damage, 1.5-2x effective HP (defense)
   * Dumping hard (<-10%): Fortress — 0.25x damage, 2-3x effective HP
   */
  recalculateStats() {
    const pct = this.priceChangePercent;

    if (pct > 10) {
      // Pumping hard — glass cannon
      this.damageMultiplier = 1 + (pct / 10);
      this.defenseMultiplier = 0.8;
    } else if (pct > 1) {
      // Steady green — balanced attacker
      this.damageMultiplier = 1 + (pct / 20);
      this.defenseMultiplier = 1;
    } else if (pct > -1) {
      // Crabbing — neutral
      this.damageMultiplier = 1;
      this.defenseMultiplier = 1;
    } else if (pct > -10) {
      // Dipping — defender
      this.damageMultiplier = 0.5;
      this.defenseMultiplier = 1 + (Math.abs(pct) / 10);
    } else {
      // Dumping hard — fortress
      this.damageMultiplier = 0.25;
      this.defenseMultiplier = 1 + (Math.abs(pct) / 5);
    }

    // Apply damage multiplier
    if (this.setDamageAmount) {
      this.setDamageAmount(Math.round(this.baseDamage * this.damageMultiplier));
    }
  },

  updatePriceIndicator() {
    if (!this.priceIndicator) {
      this.priceIndicator = this.scene.add
        .text(this.x, this.y - this.height - 8, "", {
          fontSize: "9px",
          fontFamily: "Arial, sans-serif",
          fontStyle: "bold",
          color: "#00ff00",
          stroke: "#000000",
          strokeThickness: 2
        })
        .setOrigin(0.5, 0.5)
        .setDepth(999998);
    }

    const pct = this.priceChangePercent;
    const sign = pct >= 0 ? "+" : "";
    const color = pct >= 0 ? "#00ff00" : "#ff4444";
    this.priceIndicator.setText(`${sign}${pct.toFixed(1)}%`);
    this.priceIndicator.setColor(color);
  },

  /**
   * Apply data-driven combat stats from market data.
   * HP from market cap, damage from volatility, speed from inverse market cap.
   * Overwrites the hardcoded troop stats with real market-derived values.
   */
  applyMarketStats() {
    if (!this.tokenId) return;
    const stats = priceService.getCombatStats(this.tokenId);
    if (!stats) return;

    // HP from market cap
    if (stats.hp && this.setOverallHealth) {
      this.baseHealth = stats.hp;
      this.setOverallHealth(stats.hp);
    }

    // Base damage from volatility
    if (stats.damage) {
      this.baseDamage = stats.damage;
      if (this.setDamageAmount) {
        this.setDamageAmount(Math.round(this.baseDamage * this.damageMultiplier));
      }
    }

    // Speed from inverse market cap (already handled by applySpeedFromMarketCap)
    this.applySpeedFromMarketCap();

    this._marketStatsApplied = true;
  },

  _init() {
    // Store hardcoded troop stats as initial fallback
    if (this.damageAmount) this.baseDamage = this.damageAmount;
    if (this.overallHealth) this.baseHealth = this.overallHealth;
    if (this.movementSpeed) this.baseMovementSpeed = this.movementSpeed;

    this._marketStatsApplied = false;

    // Snapshot the current price at deployment — all future % change is relative to this
    if (this.tokenId) {
      const tokenData = priceService.getTokenWithPower(this.tokenId);
      if (tokenData && tokenData.price > 0) {
        this.deployPrice = tokenData.price;
      }
      this.applyMarketStats();
    }
  },

  /**
   * Adjust movement speed based on market cap.
   * Higher market cap = heavier = slower movement.
   */
  applySpeedFromMarketCap() {
    const mult = priceService.getSpeedMultiplier(this.tokenId);
    if (mult !== this.speedMultiplier && this.baseMovementSpeed) {
      this.speedMultiplier = mult;
      const newSpeed = Math.round(this.baseMovementSpeed * this.speedMultiplier);
      if (this.setMovementSpeed) {
        this.setMovementSpeed(newSpeed);
        // Also update max velocity to match
        if (this.setMaxVelocity) this.setMaxVelocity(newSpeed, newSpeed);
      }
    }
  },

  _preUpdate(time, delta) {
    // Periodically fetch updated price data
    if (time - this.priceUpdateInterval > this.lastPriceUpdate && this.tokenId) {
      this.lastPriceUpdate = time;

      const tokenData = priceService.getTokenWithPower(this.tokenId);
      if (tokenData) {
        // Apply market-driven base stats if not yet applied (data may arrive after spawn)
        if (!this._marketStatsApplied) {
          this.applyMarketStats();
        }

        // Snapshot deploy price if we didn't get it at init (data arrived late)
        if (!this.deployPrice && tokenData.price > 0) {
          this.deployPrice = tokenData.price;
        }

        // Calculate % change from deployment price — this is the core mechanic.
        // Each troop tracks its own P&L from the moment it was placed on the battlefield.
        if (this.deployPrice && tokenData.price > 0) {
          this.priceChangePercent =
            ((tokenData.price - this.deployPrice) / this.deployPrice) * 100;
        }

        this.recalculateStats();
        this.updatePriceIndicator();

        // Update speed from market cap (data may arrive after spawn)
        this.applySpeedFromMarketCap();
      }
    }

    // Keep price indicator following the troop
    if (this.priceIndicator && !this.isDestroyed) {
      this.priceIndicator.setPosition(this.x, this.y - this.height / 2 - 22);
    }

    // Apply defense multiplier: reduce incoming damage
    // This is handled by overriding deductHealth in the troop
  },

  _destroy() {
    if (this.priceIndicator) this.priceIndicator.destroy();
  }
};

export default HasPriceData;
