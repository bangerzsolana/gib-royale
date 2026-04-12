import { Scene } from "phaser";
import { priceService } from "../services/PriceService.js";

const COLS = 4;
const ROWS = 4;
const CARD_W = 36;
const CARD_H = 52;
const GAP_X = 2;
const GAP_Y = 2;
const TOP_Y = 18;
const LEFT_X = 2;

// Style for number text (regular Phaser text since bitmap font has no digits)
const NUM_STYLE = {
  fontFamily: "monospace",
  fontSize: "7px",
  resolution: 2,
};

class CardGalleryScene extends Scene {
  constructor() {
    super("CardGalleryScene");
    this.cardObjects = {};
  }

  create() {
    const centerX = this.cameras.main.centerX;

    // Background
    this.cameras.main.setBackgroundColor("#1a1a2e");

    // Title
    this.add
      .bitmapText(centerX, 2, "teeny-tiny-pixls", "LIVE CARDS", 5)
      .setOrigin(0.5, 0)
      .setTint(0xffffff);

    // Back button
    this.add
      .bitmapText(2, 2, "teeny-tiny-pixls", "BACK", 5)
      .setOrigin(0, 0)
      .setTint(0xffcc00)
      .setInteractive()
      .on("pointerdown", () => {
        this._cleanup();
        this.scene.start("TitleScene");
      });

    // Start price simulation
    priceService.startSimulation();

    // Build card grid
    const tokenIds = Object.keys(priceService.tokens);
    tokenIds.forEach((id, i) => {
      const col = i % COLS;
      const row = Math.floor(i / COLS);
      const x = LEFT_X + col * (CARD_W + GAP_X);
      const y = TOP_Y + row * (CARD_H + GAP_Y);
      this._createCard(id, x, y);
    });

    // Listen for price updates to refresh cards
    this._unsubscribe = priceService.onPriceUpdate((tokenId) => {
      this._updateCard(tokenId);
    });
  }

  _createCard(tokenId, x, y) {
    const token = priceService.getTokenWithPower(tokenId);
    if (!token) return;

    const power = token.power;
    const role = priceService.getTokenRole(tokenId);
    const bgColor = this._powerColor(power);

    // Card background
    const bg = this.add.rectangle(
      x + CARD_W / 2,
      y + CARD_H / 2,
      CARD_W,
      CARD_H,
      bgColor,
      0.9
    );

    // Border
    const border = this.add.rectangle(
      x + CARD_W / 2,
      y + CARD_H / 2,
      CARD_W,
      CARD_H
    );
    border.setStrokeStyle(1, 0xffffff, 0.5);

    // Coin name (bitmap font — letters only, works fine)
    const nameText = this.add
      .bitmapText(x + CARD_W / 2, y + 3, "teeny-tiny-pixls", token.name, 5)
      .setOrigin(0.5, 0)
      .setTint(0xffffff);

    // Power score (regular text so digits render)
    const powerStr = (power >= 0 ? "+" : "") + power.toFixed(1);
    const powerText = this.add
      .text(x + CARD_W / 2, y + 16, powerStr, {
        ...NUM_STYLE,
        fontSize: "9px",
        color: power >= 0 ? "#44ff44" : "#ff4444",
        fontStyle: "bold",
      })
      .setOrigin(0.5, 0);

    // Role label (colored prominently — this is the key info)
    const roleLabel = this._roleShort(role);
    const roleColor = this._roleColor(role);
    const roleText = this.add
      .bitmapText(x + CARD_W / 2, y + 28, "teeny-tiny-pixls", roleLabel, 5)
      .setOrigin(0.5, 0)
      .setTint(roleColor);

    // Price (regular text for digits)
    const priceStr = this._formatPrice(token.price);
    const priceText = this.add
      .text(x + CARD_W / 2, y + 40, priceStr, {
        ...NUM_STYLE,
        color: "#999999",
      })
      .setOrigin(0.5, 0);

    this.cardObjects[tokenId] = {
      bg,
      border,
      nameText,
      powerText,
      roleText,
      priceText,
      x,
      y,
    };
  }

  _updateCard(tokenId) {
    const card = this.cardObjects[tokenId];
    if (!card) return;

    const token = priceService.getTokenWithPower(tokenId);
    if (!token) return;

    const power = token.power;
    const role = priceService.getTokenRole(tokenId);

    // Update background color
    card.bg.setFillStyle(this._powerColor(power), 0.9);

    // Update power text
    const powerStr = (power >= 0 ? "+" : "") + power.toFixed(1);
    card.powerText.setText(powerStr);
    card.powerText.setColor(power >= 0 ? "#44ff44" : "#ff4444");

    // Update role with color
    card.roleText.setText(this._roleShort(role));
    card.roleText.setTint(this._roleColor(role));

    // Update price
    card.priceText.setText(this._formatPrice(token.price));
  }

  _powerColor(power) {
    if (power > 5) return 0x116611;
    if (power > 1) return 0x1a3a1a;
    if (power > -1) return 0x2a2a3a;
    if (power > -5) return 0x3a1a1a;
    return 0x661111;
  }

  _roleColor(role) {
    const map = {
      "glass-cannon": 0x00ff88, // bright green — extreme attacker
      attacker: 0x44ff44, // green — attacker
      utility: 0xffff44, // yellow — balanced
      defender: 0xff6644, // orange — defender
      fortress: 0xff2222, // red — extreme defender
    };
    return map[role] || 0xffffff;
  }

  _roleShort(role) {
    const map = {
      "glass-cannon": "GLASS",
      attacker: "ATK",
      utility: "UTIL",
      defender: "DEF",
      fortress: "FORT",
    };
    return map[role] || role.toUpperCase();
  }

  _formatPrice(price) {
    if (price >= 1) return "$" + price.toFixed(2);
    if (price >= 0.01) return "$" + price.toFixed(3);
    if (price >= 0.0001) return "$" + price.toFixed(5);
    return "$" + price.toFixed(7);
  }

  _cleanup() {
    if (this._unsubscribe) {
      this._unsubscribe();
      this._unsubscribe = null;
    }
    priceService.stopSimulation();
    this.cardObjects = {};
  }

  shutdown() {
    this._cleanup();
  }
}

export default CardGalleryScene;
