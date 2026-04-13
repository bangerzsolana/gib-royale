import { priceService } from "../../../services/PriceService.js";

/**
 * HasPriceData component — the core mechanic that makes this game unique.
 *
 * Links a deployed troop to a real token's price action.
 * Price % change since deployment scales the troop's power:
 * - Pumping = stronger (more damage dealt, less damage taken)
 * - Dumping = weaker (less damage dealt, more damage taken)
 */
class HasPriceData {
  constructor() {
    var attributes = {
      tokenId: null,
      priceChangePercent: 0,
      deployPrice: null, // Price snapshot from when card spawned in hand — all % change is relative to this
      baseDamage: 10,
      baseHealth: 100,
      baseMovementSpeed: 0, // Set at spawn from troop's hardcoded speed
      lastPriceUpdate: 0,
      priceUpdateInterval: 2000, // Update stats every 2 seconds
      powerMultiplier: 1, // Single multiplier from price action
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
   * Recalculate effective ATK from price % change since deployment.
   * ADDITIVE formula: effectiveATK = baseDamage + priceChangePercent
   * Floor at 1 — can never deal zero damage.
   * Example: base 15, +0.5% pump → priceChangePercent = 50 → ATK = 65
   */
  recalculateStats() {
    const pct = this.priceChangePercent;

    // Additive ATK: base + scaled price change, floor 1
    const effectiveATK = Math.max(1, Math.round(this.baseDamage + pct));
    if (this.setDamageAmount) {
      this.setDamageAmount(effectiveATK);
    }

    // Power multiplier still used for damage reduction on defense
    this.powerMultiplier = Math.max(0.1, 1 + (pct / 100));
  },

  updatePriceIndicator() {
    // Only ONE indicator per tokenId per team — avoid stacked duplicates
    if (!this.scene._priceIndicatorOwners) this.scene._priceIndicatorOwners = {};
    const key = `${this.tokenId}_${this.isPlayerTroop ? 'p' : 'c'}`;
    const currentOwner = this.scene._priceIndicatorOwners[key];

    // If another living troop already owns this indicator, hide ours
    if (currentOwner && currentOwner !== this && !currentOwner.isDestroyed && currentOwner.active) {
      if (this.priceIndicator) this.priceIndicator.setVisible(false);
      return;
    }

    // We're the owner (or previous owner died)
    this.scene._priceIndicatorOwners[key] = this;

    if (!this.priceIndicator) {
      this.priceIndicator = this.scene.add
        .text(this.x, this.y + 20, "", {
          fontSize: "14px",
          fontFamily: "Arial, sans-serif",
          fontStyle: "bold",
          color: "#00ff00",
          stroke: "#000000",
          strokeThickness: 3
        })
        .setOrigin(0.5, 0.5)
        .setDepth(999999); // Top layer — nothing covers this
    }

    this.priceIndicator.setVisible(true);
    const pct = this.priceChangePercent;
    const arrow = pct >= 0 ? "\u25B2" : "\u25BC"; // ▲ or ▼
    const color = pct >= 0 ? "#00ff00" : "#ff4444";
    this.priceIndicator.setText(`${arrow} ${Math.abs(pct).toFixed(4)}%`);
    this.priceIndicator.setColor(color);
  },

  /**
   * Apply data-driven combat stats from market data.
   * HP = 30 × log₁₀(marketCap) - 80, floor 20, fallback 80.
   * Base damage = flat 15 for all troops.
   * Always applies — no guards. The formula handles missing data via fallback.
   */
  applyMarketStats() {
    if (!this.tokenId) return;
    const stats = priceService.getCombatStats(this.tokenId);

    // If token not found at all, apply fallback HP (80) and base damage (15)
    const rawHp = stats ? stats.hp : 80;
    const damage = stats ? stats.damage : 15;

    // Apply HP divisor for multi-unit types (Flyer ÷3, Swarm ÷5, SpawnerChild ÷8)
    const divisor = this.hpDivisor || 1;
    const hp = Math.max(1, Math.round(rawHp / divisor));

    if (this.setOverallHealth) {
      this.baseHealth = hp;
      this.setOverallHealth(hp);
    }

    this.baseDamage = damage;
    if (this.setDamageAmount) {
      const effectiveATK = Math.max(1, Math.round(this.baseDamage + this.priceChangePercent));
      this.setDamageAmount(effectiveATK);
    }

    this._marketStatsApplied = true;
  },

  _init() {
    this._marketStatsApplied = false;

    // Use the card's spawn price if passed through from the card (set before _init runs).
    // Only snapshot current price if no spawn price was provided.
    if (this.tokenId) {
      if (!this.deployPrice) {
        const tokenData = priceService.getTokenWithPower(this.tokenId);
        if (tokenData && tokenData.price > 0) {
          this.deployPrice = tokenData.price;
        }
      }
      // Always apply market stats — this is the ONLY source of HP and damage
      this.applyMarketStats();
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

        // Calculate % change from spawn price — this is the core mechanic.
        // Tracking starts when the card appears in the player's hand, not when deployed.
        // 100x scaling factor so small real-world crypto moves feel meaningful in-game.
        if (this.deployPrice && tokenData.price > 0) {
          const rawPct =
            ((tokenData.price - this.deployPrice) / this.deployPrice) * 100;
          this.priceChangePercent = rawPct * 100;
        }

        this.recalculateStats();
        this.updatePriceIndicator();

      }
    }

    // Keep price indicator following the troop
    if (this.priceIndicator && !this.isDestroyed) {
      this.priceIndicator.setPosition(this.x, this.y + 20);
    }

  },

  _destroy() {
    if (this.priceIndicator) this.priceIndicator.destroy();
    // Release indicator ownership so another troop of same coin can take over
    if (this.scene && this.scene._priceIndicatorOwners) {
      const key = `${this.tokenId}_${this.isPlayerTroop ? 'p' : 'c'}`;
      if (this.scene._priceIndicatorOwners[key] === this) {
        delete this.scene._priceIndicatorOwners[key];
      }
    }
  }
};

export default HasPriceData;
