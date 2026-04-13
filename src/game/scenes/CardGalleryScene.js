import { Scene } from "phaser";
import { priceService } from "../services/PriceService.js";

class CardGalleryScene extends Scene {
  constructor() {
    super("CardGalleryScene");
    this.overlay = null;
    this._unsubscribe = null;
    this.cardEls = {};
  }

  create() {
    this.cameras.main.setBackgroundColor("#1a1a2e");

    // Create HTML overlay on top of the game canvas
    this.overlay = document.createElement("div");
    this.overlay.id = "card-gallery-overlay";
    this.overlay.innerHTML = `
      <style>
        #card-gallery-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          z-index: 1000;
          background: #1a1a2e;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          color: #fff;
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
        }
        #card-gallery-overlay .cg-header {
          position: sticky;
          top: 0;
          background: #1a1a2e;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 16px;
          border-bottom: 1px solid #333;
          z-index: 10;
        }
        #card-gallery-overlay .cg-back {
          color: #ffcc00;
          font-weight: 700;
          font-size: 16px;
          cursor: pointer;
          border: none;
          background: none;
          padding: 4px 8px;
        }
        #card-gallery-overlay .cg-title {
          font-size: 16px;
          font-weight: 700;
          color: #fff;
        }
        #card-gallery-overlay .cg-count {
          font-size: 13px;
          color: #888;
        }
        #card-gallery-overlay .cg-filters {
          display: flex;
          gap: 6px;
          padding: 8px 12px;
          max-width: 480px;
          margin: 0 auto;
          flex-wrap: wrap;
        }
        #card-gallery-overlay .cg-filter-btn {
          font-size: 11px;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 12px;
          border: 1px solid #555;
          background: #2a2a3a;
          color: #aaa;
          cursor: pointer;
        }
        #card-gallery-overlay .cg-filter-btn.active {
          background: #ffcc00;
          color: #000;
          border-color: #ffcc00;
        }
        #card-gallery-overlay .cg-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
          padding: 12px;
          max-width: 480px;
          margin: 0 auto;
        }
        #card-gallery-overlay .cg-card {
          background: #2a2a3a;
          border-radius: 8px;
          padding: 10px 6px;
          text-align: center;
          border: 1px solid #444;
          transition: background 0.3s;
        }
        #card-gallery-overlay .cg-name {
          font-size: 11px;
          font-weight: 700;
          color: #ccc;
          margin-bottom: 4px;
          letter-spacing: 0.5px;
        }
        #card-gallery-overlay .cg-power {
          font-size: 22px;
          font-weight: 800;
          margin: 4px 0;
          font-variant-numeric: tabular-nums;
        }
        #card-gallery-overlay .cg-price {
          font-size: 10px;
          color: #888;
          font-variant-numeric: tabular-nums;
        }
        #card-gallery-overlay .cg-loading {
          text-align: center;
          padding: 60px 20px;
          color: #888;
          font-size: 14px;
        }
      </style>
      <div class="cg-header">
        <button class="cg-back">← BACK</button>
        <span class="cg-title">LIVE PYTH CARDS</span>
        <span class="cg-count" id="cg-count"></span>
      </div>
      <div class="cg-filters" id="cg-filters">
        <button class="cg-filter-btn active" data-filter="all">ALL</button>
      </div>
      <div id="cg-grid-area">
        <div class="cg-loading" id="cg-loading">Fetching live Pyth data...</div>
      </div>
    `;

    document.body.appendChild(this.overlay);

    // Wire up back button
    this.overlay.querySelector(".cg-back").addEventListener("click", () => {
      this._cleanup();
      this.scene.start("TitleScene");
    });

    // Wire up filter buttons
    this._activeFilter = 'all';
    this.overlay.querySelectorAll('.cg-filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.overlay.querySelectorAll('.cg-filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this._activeFilter = btn.dataset.filter;
        this._applyFilter();
      });
    });

    // Start fetching
    this._startLiveData();
  }

  async _startLiveData() {
    // Fetch Pyth (real-time) and Railway (non-Pyth coins) in parallel
    const [pythOk, railwayOk] = await Promise.all([
      priceService.fetchPrices(),
      priceService.fetchRailwayPrices(),
    ]);
    const loadingEl = document.getElementById("cg-loading");

    if (!pythOk && !railwayOk) {
      if (loadingEl) loadingEl.textContent = "Failed to fetch prices. Check connection.";
      return;
    }

    // Build grid
    this._buildGrid();

    // Listen for updates
    this._unsubscribe = priceService.onPriceUpdate((symbol) => {
      this._updateCard(symbol);
    });

    // Poll every 3 seconds
    priceService.startPolling(3000);
  }

  _buildGrid() {
    const allTokens = priceService.getAllTokensWithPower();
    const gridArea = document.getElementById("cg-grid-area");
    const countEl = document.getElementById("cg-count");

    if (countEl) countEl.textContent = allTokens.length + " coins";

    const grid = document.createElement("div");
    grid.className = "cg-grid";

    for (const token of allTokens) {
      const card = document.createElement("div");
      card.className = "cg-card";
      card.dataset.symbol = token.id;

      const power = token.power;

      card.innerHTML = `
        <div class="cg-name">${token.name}</div>
        <div class="cg-power" style="color: ${power >= 0 ? '#44ff44' : '#ff4444'}">${this._fmtPower(power)}</div>
        <div class="cg-price">${this._formatPrice(token.price)}</div>
      `;

      card.style.background = this._powerBgCSS(power);
      grid.appendChild(card);
      this.cardEls[token.id] = card;
    }

    gridArea.innerHTML = "";
    gridArea.appendChild(grid);
  }

  _applyFilter() {
    for (const [symbol, card] of Object.entries(this.cardEls)) {
      card.style.display = '';
    }
    // Update count
    const visible = Object.values(this.cardEls).filter(c => c.style.display !== 'none').length;
    const countEl = document.getElementById('cg-count');
    if (countEl) countEl.textContent = visible + ' coins';
  }

  _updateCard(symbol) {
    const card = this.cardEls[symbol];
    if (!card) return;

    const token = priceService.getTokenWithPower(symbol);
    if (!token) return;

    const power = token.power;

    card.querySelector(".cg-power").textContent = this._fmtPower(power);
    card.querySelector(".cg-power").style.color = power >= 0 ? "#44ff44" : "#ff4444";
    card.querySelector(".cg-price").textContent = this._formatPrice(token.price);
    card.style.background = this._powerBgCSS(power);
  }

  _fmtPower(power) {
    return (power >= 0 ? "+" : "") + power.toFixed(1);
  }

  _powerBgCSS(power) {
    if (power > 5) return "#0a3a0a";
    if (power > 1) return "#1a3a1a";
    if (power > -1) return "#2a2a3a";
    if (power > -5) return "#3a1a1a";
    return "#3a0a0a";
  }

  _formatPrice(price) {
    if (price >= 100) return "$" + price.toFixed(0);
    if (price >= 1) return "$" + price.toFixed(2);
    if (price >= 0.01) return "$" + price.toFixed(4);
    if (price >= 0.0001) return "$" + price.toFixed(6);
    return "$" + price.toExponential(2);
  }

  _cleanup() {
    if (this._unsubscribe) {
      this._unsubscribe();
      this._unsubscribe = null;
    }
    priceService.stopPolling();
    this.cardEls = {};
    if (this.overlay && this.overlay.parentNode) {
      this.overlay.parentNode.removeChild(this.overlay);
      this.overlay = null;
    }
  }

  shutdown() {
    this._cleanup();
  }
}

export default CardGalleryScene;
