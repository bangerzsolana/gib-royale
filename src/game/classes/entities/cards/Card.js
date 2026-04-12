import Phaser from "phaser";
import { priceService } from "../../../services/PriceService.js";

class Card extends Phaser.GameObjects.Container {
  constructor(scene, x, y, troopClass, coinSymbol) {
    super(scene, x, y);

    this.troopClass = troopClass;
    this.coinSymbol = coinSymbol || null;
    this.width = 68;
    this.height = 85;

    this.isSelected = false;

    scene.add.existing(this).setDepth(10000);

    // Card background
    this.background = scene.add
      .rectangle(0, 0, this.width, this.height, 0x2a2a3e)
      .setOrigin(0, 0)
      .setStrokeStyle(1, 0x555577);
    this.add(this.background);

    // Coin color circle in center
    const coinEntry = coinSymbol
      ? (scene.game.__coinDeckLookup && scene.game.__coinDeckLookup[coinSymbol])
      : null;
    const circleColor = coinEntry ? coinEntry.color : 0x888888;

    this.coinCircle = scene.add
      .circle(this.width / 2, 32, 16, circleColor)
      .setOrigin(0.5, 0.5);
    this.add(this.coinCircle);

    // Coin name label
    if (coinSymbol) {
      this.add(
        scene.add
          .text(this.width / 2, 56, coinSymbol, {
            fontSize: "10px",
            fontFamily: "Arial, sans-serif",
            color: "#ffffff",
            fontStyle: "bold"
          })
          .setOrigin(0.5, 0.5)
      );
    }

    // Mana cost (top-left, blue circle with number)
    const cost = troopClass.COST;
    this.add(
      scene.add
        .circle(10, 10, 10, 0x3366ff)
        .setOrigin(0.5, 0.5)
    );
    this.add(
      scene.add
        .text(10, 10, cost, {
          fontSize: "11px",
          fontFamily: "Arial, sans-serif",
          color: "#ffffff",
          fontStyle: "bold"
        })
        .setOrigin(0.5, 0.5)
    );

    // Live price indicator (top-left, below mana cost) — shows ▲/▼ with % change
    this.priceIndicator = scene.add
      .text(10, 24, "", {
        fontSize: "9px",
        fontFamily: "Arial, sans-serif",
        fontStyle: "bold",
        color: "#00ff00"
      })
      .setOrigin(0.5, 0.5);
    this.add(this.priceIndicator);

    // Role/type indicator at bottom
    this.add(
      scene.add
        .text(this.width / 2, 73, troopClass.NAME.replace("Troop", ""), {
          fontSize: "7px",
          fontFamily: "Arial, sans-serif",
          color: "#888899"
        })
        .setOrigin(0.5, 0.5)
    );

    // Start live price update timer
    if (coinSymbol) {
      this.updatePriceIndicator();
      this.priceTimer = scene.time.addEvent({
        delay: 3000,
        callback: () => this.updatePriceIndicator(),
        loop: true
      });
    }
  }

  updatePriceIndicator() {
    if (!this.coinSymbol || !this.priceIndicator || !this.scene) return;

    const tokenData = priceService.getTokenWithPower(this.coinSymbol);
    if (tokenData && tokenData.emaPrice) {
      const pct = ((tokenData.price - tokenData.emaPrice) / tokenData.emaPrice) * 100;
      const arrow = pct >= 0 ? "▲" : "▼";
      const color = pct >= 0 ? "#00ff44" : "#ff4444";
      // Show arrow + boost type (ATK for pumping, DEF for dumping)
      const boost = pct >= 0 ? "ATK" : "DEF";
      this.priceIndicator.setText(`${arrow}${boost}`);
      this.priceIndicator.setColor(color);
    }
  }

  destroy() {
    if (this.priceTimer) this.priceTimer.destroy();
    super.destroy();
  }
}

export default Card;
