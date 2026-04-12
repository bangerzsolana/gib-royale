import Phaser from "phaser";
import { priceService } from "../../../services/PriceService.js";

/**
 * HasPriceData component — the core mechanic that makes this game unique.
 *
 * Links a deployed troop to a real token's price action:
 * - Pumping tokens (positive % change) = higher attack power
 * - Dumping tokens (negative % change) = higher defense (damage reduction)
 * - Extreme moves trigger special effects (rug pull, moon shot)
 */
class HasPriceData {
  constructor() {
    var attributes = {
      tokenId: null,
      priceChangePercent: 0,
      baseDamage: 10,
      baseHealth: 100,
      lastPriceUpdate: 0,
      priceUpdateInterval: 2000, // Update stats every 2 seconds
      damageMultiplier: 1,
      defenseMultiplier: 1,
      isRugged: false,
      isMooning: false,
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

    // Check for special events
    this.checkSpecialEvents(pct);
  },

  /**
   * Special market events that affect gameplay
   */
  checkSpecialEvents(pct) {
    // Rug Pull: token dumps >25% — explodes, area damage to both sides
    if (pct < -25 && !this.isRugged) {
      this.isRugged = true;
      this.triggerRugPull();
    }

    // Moon Shot: token pumps >50% — temporary super mode
    if (pct > 50 && !this.isMooning) {
      this.isMooning = true;
      this.triggerMoonShot();
    }
  },

  triggerRugPull() {
    // Visual: flash red, expand, then explode
    if (this.scene) {
      this.scene.tweens.add({
        targets: [this],
        scaleX: 2,
        scaleY: 2,
        alpha: 0,
        tint: 0xff0000,
        duration: 500,
        onComplete: () => {
          // Deal area damage to ALL nearby troops (both sides)
          const allTroops = [
            ...this.owner.troops.getChildren(),
            ...(this.owner.opponent ? this.owner.opponent.troops.getChildren() : [])
          ];
          allTroops.forEach(troop => {
            if (troop === this || troop.isDestroyed) return;
            const dist = Phaser.Math.Distance.Between(this.x, this.y, troop.x, troop.y);
            if (dist < 40) {
              troop.deductHealth(50);
            }
          });
          this.destroy();
        }
      });
    }
  },

  triggerMoonShot() {
    // Visual: glow gold, double damage for 5 seconds
    if (this.scene) {
      this.setTint(0xffdd00);
      this.damageMultiplier *= 2;
      if (this.setDamageAmount) {
        this.setDamageAmount(Math.round(this.baseDamage * this.damageMultiplier));
      }

      this.scene.time.addEvent({
        delay: 5000,
        callback: () => {
          if (!this.isDestroyed) {
            this.isMooning = false;
            this.setTint(0xffffff);
            this.recalculateStats();
          }
        }
      });
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

  _init() {
    // Store base stats at spawn time
    if (this.damageAmount) this.baseDamage = this.damageAmount;
    if (this.overallHealth) this.baseHealth = this.overallHealth;
  },

  _preUpdate(time, delta) {
    // Periodically fetch updated price data
    if (time - this.priceUpdateInterval > this.lastPriceUpdate && this.tokenId) {
      this.lastPriceUpdate = time;

      const tokenData = priceService.getTokenWithPower(this.tokenId);
      if (tokenData) {
        // Use EMA momentum as percent change: (price - ema) / ema * 100
        const momentum = tokenData.emaPrice
          ? ((tokenData.price - tokenData.emaPrice) / tokenData.emaPrice) * 100
          : 0;
        this.priceChangePercent = momentum;
        this.recalculateStats();
        this.updatePriceIndicator();
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
