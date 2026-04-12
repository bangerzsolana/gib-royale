import { Scene } from "phaser";
import { priceService } from "../services/PriceService.js";

const COLS = 4;
const CARD_W = 36;
const CARD_H = 52;
const GAP_X = 2;
const GAP_Y = 2;
const TOP_Y = 18;
const LEFT_X = 2;

// Clean font style for numbers
const NUM_STYLE = {
  fontFamily: "'Inter', sans-serif",
  fontSize: "7px",
  resolution: 8,
};

class CardGalleryScene extends Scene {
  constructor() {
    super("CardGalleryScene");
    this.cardObjects = {};
    this.scrollY = 0;
    this.maxScrollY = 0;
    this.cardContainer = null;
    this.loadingText = null;
    this.coinCount = 0;
  }

  create() {
    const centerX = this.cameras.main.centerX;
    const screenH = this.cameras.main.height;

    // Background
    this.cameras.main.setBackgroundColor("#1a1a2e");

    // Fixed header background
    this.add.rectangle(centerX, 8, 160, 16, 0x1a1a2e, 1).setDepth(10);

    // Title
    this.add
      .bitmapText(centerX, 2, "teeny-tiny-pixls", "LIVE PYTH CARDS", 5)
      .setOrigin(0.5, 0)
      .setTint(0xffffff)
      .setDepth(11);

    // Back button
    this.add
      .bitmapText(2, 2, "teeny-tiny-pixls", "BACK", 5)
      .setOrigin(0, 0)
      .setTint(0xffcc00)
      .setInteractive()
      .setDepth(11)
      .on("pointerdown", () => {
        this._cleanup();
        this.scene.start("TitleScene");
      });

    // Coin count display
    this.countText = this.add
      .bitmapText(158, 2, "teeny-tiny-pixls", "", 5)
      .setOrigin(1, 0)
      .setTint(0x888888)
      .setDepth(11);

    // Loading text
    this.loadingText = this.add
      .text(centerX, screenH / 2, "Fetching Pyth data...", {
        ...NUM_STYLE,
        fontSize: "8px",
        color: "#888888",
      })
      .setOrigin(0.5, 0.5);

    // Scrollable container for cards
    this.cardContainer = this.add.container(0, 0);

    // Start fetching live Pyth prices
    this._startLiveData();

    // Scroll handling
    this.input.on("wheel", (_pointer, _gos, _dx, dy) => {
      this._scroll(dy * 0.3);
    });

    // Touch drag scrolling
    this._dragStartY = null;
    this._lastPointerY = null;
    this.input.on("pointerdown", (pointer) => {
      this._dragStartY = pointer.y;
      this._lastPointerY = pointer.y;
    });
    this.input.on("pointermove", (pointer) => {
      if (this._dragStartY !== null && pointer.isDown) {
        const delta = this._lastPointerY - pointer.y;
        this._scroll(delta);
        this._lastPointerY = pointer.y;
      }
    });
    this.input.on("pointerup", () => {
      this._dragStartY = null;
      this._lastPointerY = null;
    });
  }

  async _startLiveData() {
    // Initial fetch
    const success = await priceService.fetchPrices();
    if (this.loadingText) {
      this.loadingText.destroy();
      this.loadingText = null;
    }

    if (!success) {
      this.add
        .text(this.cameras.main.centerX, this.cameras.main.height / 2,
          "Failed to fetch prices.\nCheck connection.", {
          ...NUM_STYLE,
          fontSize: "8px",
          color: "#ff4444",
          align: "center",
        })
        .setOrigin(0.5, 0.5);
      return;
    }

    // Build the card grid
    this._buildGrid();

    // Listen for updates
    this._unsubscribe = priceService.onPriceUpdate((symbol) => {
      this._updateCard(symbol);
    });

    // Start polling every 3 seconds
    priceService.startPolling(3000);
  }

  _buildGrid() {
    const allTokens = priceService.getAllTokensWithPower();
    this.coinCount = allTokens.length;
    this.countText.setText(this.coinCount + "");

    const totalRows = Math.ceil(this.coinCount / COLS);
    const totalHeight = TOP_Y + totalRows * (CARD_H + GAP_Y);
    this.maxScrollY = Math.max(0, totalHeight - this.cameras.main.height + 5);

    allTokens.forEach((token, i) => {
      const col = i % COLS;
      const row = Math.floor(i / COLS);
      const x = LEFT_X + col * (CARD_W + GAP_X);
      const y = TOP_Y + row * (CARD_H + GAP_Y);
      this._createCard(token.id, x, y);
    });
  }

  _createCard(symbol, x, y) {
    const token = priceService.getTokenWithPower(symbol);
    if (!token) return;

    const power = token.power;
    const role = priceService.getTokenRole(symbol);
    const bgColor = this._powerColor(power);

    // Card background
    const bg = this.add.rectangle(
      x + CARD_W / 2, y + CARD_H / 2,
      CARD_W, CARD_H, bgColor, 0.9
    );

    // Border
    const border = this.add.rectangle(
      x + CARD_W / 2, y + CARD_H / 2,
      CARD_W, CARD_H
    );
    border.setStrokeStyle(1, 0xffffff, 0.5);

    // Coin name (bitmap font)
    const displayName = token.name.length > 6 ? token.name.substring(0, 6) : token.name;
    const nameText = this.add
      .bitmapText(x + CARD_W / 2, y + 3, "teeny-tiny-pixls", displayName, 5)
      .setOrigin(0.5, 0)
      .setTint(0xffffff);

    // Power score
    const powerStr = (power >= 0 ? "+" : "") + power.toFixed(1);
    const powerText = this.add
      .text(x + CARD_W / 2, y + 15, powerStr, {
        ...NUM_STYLE,
        fontSize: "10px",
        color: power >= 0 ? "#44ff44" : "#ff4444",
        fontStyle: "bold",
      })
      .setOrigin(0.5, 0);

    // Role label
    const roleLabel = this._roleShort(role);
    const roleColor = this._roleColor(role);
    const roleText = this.add
      .bitmapText(x + CARD_W / 2, y + 28, "teeny-tiny-pixls", roleLabel, 5)
      .setOrigin(0.5, 0)
      .setTint(roleColor);

    // Price
    const priceStr = this._formatPrice(token.price);
    const priceText = this.add
      .text(x + CARD_W / 2, y + 40, priceStr, {
        ...NUM_STYLE,
        color: "#999999",
      })
      .setOrigin(0.5, 0);

    // Add all to container for scrolling
    this.cardContainer.add([bg, border, nameText, powerText, roleText, priceText]);

    this.cardObjects[symbol] = {
      bg, border, nameText, powerText, roleText, priceText, x, y,
    };
  }

  _updateCard(symbol) {
    const card = this.cardObjects[symbol];
    if (!card) return;

    const token = priceService.getTokenWithPower(symbol);
    if (!token) return;

    const power = token.power;
    const role = priceService.getTokenRole(symbol);

    card.bg.setFillStyle(this._powerColor(power), 0.9);

    const powerStr = (power >= 0 ? "+" : "") + power.toFixed(1);
    card.powerText.setText(powerStr);
    card.powerText.setColor(power >= 0 ? "#44ff44" : "#ff4444");

    card.roleText.setText(this._roleShort(role));
    card.roleText.setTint(this._roleColor(role));

    card.priceText.setText(this._formatPrice(token.price));
  }

  _scroll(delta) {
    this.scrollY = Math.max(0, Math.min(this.maxScrollY, this.scrollY + delta));
    this.cardContainer.y = -this.scrollY;
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
      "glass-cannon": 0x00ff88,
      attacker: 0x44ff44,
      utility: 0xffff44,
      defender: 0xff6644,
      fortress: 0xff2222,
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
    if (price >= 100) return "$" + price.toFixed(0);
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
    priceService.stopPolling();
    this.cardObjects = {};
    this.scrollY = 0;
  }

  shutdown() {
    this._cleanup();
  }
}

export default CardGalleryScene;
