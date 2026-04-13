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
      .setStrokeStyle(1, strokeColor);
    this.add(this.background);

    const circleColor = coinColor;

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

    // Role indicator below coin name (market-cap-based: Tank, Fighter, Glass Cannon)
    const role = coinSymbol ? priceService.getTokenRole(coinSymbol) : troopClass.NAME.replace("Troop", "");
    const roleColors = { 'Tank': '#4488ff', 'Fighter': '#ffaa33', 'Glass Cannon': '#ff4466' };
    this.roleLabel = scene.add
      .text(this.width / 2, 66, role, {
        fontSize: "7px",
        fontFamily: "Arial, sans-serif",
        color: roleColors[role] || "#888899"
      })
      .setOrigin(0.5, 0.5);
    this.add(this.roleLabel);

    // Live price indicator — prominent, below role name
    this.priceIndicator = scene.add
      .text(this.width / 2, 76, "—", {
        fontSize: "10px",
        fontFamily: "Arial, sans-serif",
        fontStyle: "bold",
        color: "#666688"
      })
      .setOrigin(0.5, 0.5);
    this.add(this.priceIndicator);

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
    if (!tokenData) return;

    const power = tokenData.power || 0;
    const arrow = power >= 0 ? "▲" : "▼";
    const color = power >= 0 ? "#00ff44" : "#ff4444";
    const label = power >= 0 ? "ATK" : "DEF";
    this.priceIndicator.setText(`${arrow}${label} ${Math.abs(power).toFixed(1)}`);
    this.priceIndicator.setColor(color);
  }

  destroy() {
    if (this.priceTimer) this.priceTimer.destroy();
    super.destroy();
  }
}

export default Card;
