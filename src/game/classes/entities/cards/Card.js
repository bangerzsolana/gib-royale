import Phaser from "phaser";
import { priceService } from "../../../services/PriceService.js";

class Card extends Phaser.GameObjects.Container {
  constructor(scene, x, y, troopClass, coinSymbol) {
    super(scene, x, y);

    this.troopClass = troopClass;
    this.coinSymbol = coinSymbol || null;
    this.width = 90;
    this.height = 105;

    this.isSelected = false;

    scene.add.existing(this).setDepth(10000);

    // Coin color lookup
    const coinEntry = coinSymbol
      ? (scene.game.__coinDeckLookup && scene.game.__coinDeckLookup[coinSymbol])
      : null;
    const coinColor = coinEntry ? coinEntry.color : 0x888888;

    // Card background — tinted with coin's unique color (darkened)
    const r = (coinColor >> 16) & 0xff;
    const g = (coinColor >> 8) & 0xff;
    const b = coinColor & 0xff;
    const darkR = Math.floor(r * 0.25);
    const darkG = Math.floor(g * 0.25);
    const darkB = Math.floor(b * 0.25);
    const bgColor = (darkR << 16) | (darkG << 8) | darkB;
    const strokeR = Math.floor(r * 0.5);
    const strokeG = Math.floor(g * 0.5);
    const strokeB = Math.floor(b * 0.5);
    const strokeColor = (strokeR << 16) | (strokeG << 8) | strokeB;

    this.background = scene.add
      .rectangle(0, 0, this.width, this.height, bgColor)
      .setOrigin(0, 0)
      .setStrokeStyle(2, strokeColor);
    this.add(this.background);

    const circleColor = coinColor;

    this.coinCircle = scene.add
      .circle(this.width / 2, 38, 20, circleColor)
      .setOrigin(0.5, 0.5);
    this.add(this.coinCircle);

    // Coin name label
    if (coinSymbol) {
      this.add(
        scene.add
          .text(this.width / 2, 68, coinSymbol, {
            fontSize: "14px",
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
        .circle(14, 14, 14, 0x3366ff)
        .setOrigin(0.5, 0.5)
    );
    this.add(
      scene.add
        .text(14, 14, cost, {
          fontSize: "16px",
          fontFamily: "Arial, sans-serif",
          color: "#ffffff",
          fontStyle: "bold"
        })
        .setOrigin(0.5, 0.5)
    );

    // Live price indicator — below coin name
    this.priceIndicator = scene.add
      .text(this.width / 2, 88, "—", {
        fontSize: "13px",
        fontFamily: "Arial, sans-serif",
        fontStyle: "bold",
        color: "#666688"
      })
      .setOrigin(0.5, 0.5);
    this.add(this.priceIndicator);

    // Price tracking starts when card enters hand, not when created
    this.spawnPrice = null;
    this.priceTimer = null;
  }

  // Called when card enters a hand slot — starts price tracking from zero
  startPriceTracking() {
    if (!this.coinSymbol || !this.scene) return;

    // Reset spawn price to current price (tracking starts NOW)
    this.spawnPrice = null;
    const tokenData = priceService.getTokenWithPower(this.coinSymbol);
    if (tokenData && tokenData.price > 0) {
      this.spawnPrice = tokenData.price;
    }

    // Clear old timer if re-entering hand
    if (this.priceTimer) this.priceTimer.destroy();

    this.updatePriceIndicator();
    this.priceTimer = this.scene.time.addEvent({
      delay: 3000,
      callback: () => this.updatePriceIndicator(),
      loop: true
    });
  }

  // Called when card leaves hand (goes back to deck)
  stopPriceTracking() {
    if (this.priceTimer) {
      this.priceTimer.destroy();
      this.priceTimer = null;
    }
    this.spawnPrice = null;
    if (this.priceIndicator) {
      this.priceIndicator.setText("—");
      this.priceIndicator.setColor("#666688");
    }
  }

  updatePriceIndicator() {
    if (!this.coinSymbol || !this.priceIndicator || !this.scene) return;

    const tokenData = priceService.getTokenWithPower(this.coinSymbol);
    if (!tokenData) return;

    // Snapshot spawn price if we didn't get it at creation (data arrived late)
    if (!this.spawnPrice && tokenData.price > 0) {
      this.spawnPrice = tokenData.price;
    }

    // Show % change from when card entered hand, with 100x scaling
    if (this.spawnPrice && tokenData.price > 0) {
      const rawPct = ((tokenData.price - this.spawnPrice) / this.spawnPrice) * 100;
      const scaledPct = rawPct * 100;
      const arrow = scaledPct >= 0 ? "▲" : "▼";
      const color = scaledPct >= 0 ? "#00ff44" : "#ff4444";
      this.priceIndicator.setText(`${arrow} ${Math.abs(scaledPct).toFixed(4)}%`);
      this.priceIndicator.setColor(color);
    }
  }

  destroy() {
    if (this.priceTimer) this.priceTimer.destroy();
    super.destroy();
  }
}

export default Card;
