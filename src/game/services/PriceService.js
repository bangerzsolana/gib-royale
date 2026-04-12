/**
 * PriceService — manages real-time token price data for the battle system.
 *
 * In production, this connects to Pyth Lazer via MagicBlock oracle for
 * 50-200ms price updates. For prototyping, it simulates price movements
 * so we can test the gameplay mechanics.
 */

const MOCK_TOKENS = {
  'bonk': { name: 'BONK', price: 0.000025, changePercent1h: 5.2 },
  'wif': { name: 'WIF', price: 2.45, changePercent1h: -3.1 },
  'popcat': { name: 'POPCAT', price: 0.89, changePercent1h: 12.7 },
  'myro': { name: 'MYRO', price: 0.15, changePercent1h: -8.4 },
  'wen': { name: 'WEN', price: 0.00012, changePercent1h: 0.3 },
  'jup': { name: 'JUP', price: 1.23, changePercent1h: 7.8 },
  'ray': { name: 'RAY', price: 4.56, changePercent1h: -15.2 },
  'orca': { name: 'ORCA', price: 8.90, changePercent1h: 2.1 },
  'samo': { name: 'SAMO', price: 0.023, changePercent1h: -0.5 },
  'mew': { name: 'MEW', price: 0.0067, changePercent1h: 28.3 },
  'bome': { name: 'BOME', price: 0.0089, changePercent1h: -22.1 },
  'slerf': { name: 'SLERF', price: 0.34, changePercent1h: 55.0 },
  'gib': { name: 'GIB', price: 0.042, changePercent1h: 18.5 },
  'ponke': { name: 'PONKE', price: 0.56, changePercent1h: -6.7 },
  'dogwifhat': { name: 'DOGWIFHAT', price: 3.21, changePercent1h: 1.2 },
  'tremp': { name: 'TREMP', price: 0.78, changePercent1h: -30.0 },
};

// EMA smoothing factor (0.1 = slow-moving average, reacts over ~10 ticks)
const EMA_ALPHA = 0.1;
// Scaling factor so power displays as nice numbers like +6.9 or -3.2
const POWER_SCALE = 5000;

class PriceService {
  constructor() {
    this.tokens = {};
    // Deep copy and add EMA tracking
    for (const [id, data] of Object.entries(MOCK_TOKENS)) {
      this.tokens[id] = {
        ...data,
        emaPrice: data.price, // EMA starts at current price
        confidence: data.price * 0.005, // Initial confidence ~0.5% of price
      };
    }
    this.listeners = [];
    this.isSimulating = false;
    this.pythApiKey = null;
    this.mode = 'mock'; // 'mock' | 'pyth'
  }

  /**
   * Initialize with Pyth Lazer API key for production use
   */
  init(apiKey) {
    if (apiKey) {
      this.pythApiKey = apiKey;
      this.mode = 'pyth';
    }
  }

  /**
   * Get current price data for a token
   */
  getTokenPrice(tokenId) {
    return this.tokens[tokenId] || null;
  }

  /**
   * Get all available tokens
   */
  getAllTokens() {
    return Object.entries(this.tokens).map(([id, data]) => ({
      id,
      ...data
    }));
  }

  /**
   * Get tokens sorted by role suitability
   */
  getAttackers() {
    return this.getAllTokens()
      .filter(t => t.changePercent1h > 1)
      .sort((a, b) => b.changePercent1h - a.changePercent1h);
  }

  getDefenders() {
    return this.getAllTokens()
      .filter(t => t.changePercent1h < -1)
      .sort((a, b) => a.changePercent1h - b.changePercent1h);
  }

  /**
   * Start simulating price movements for prototyping
   */
  startSimulation() {
    if (this.isSimulating) return;
    this.isSimulating = true;

    this._simulationInterval = setInterval(() => {
      for (const [id, token] of Object.entries(this.tokens)) {
        // Random walk with momentum
        const drift = (Math.random() - 0.48) * 3; // Slight upward bias
        const momentum = token.changePercent1h * 0.05; // Trend continuation
        const volatility = (Math.random() - 0.5) * 8; // Random noise

        token.changePercent1h += drift + momentum + volatility;

        // Clamp to realistic range
        token.changePercent1h = Math.max(-50, Math.min(80, token.changePercent1h));

        // Update price accordingly
        token.price *= (1 + (drift + volatility) * 0.001);

        // Update EMA (slow-moving average of price)
        token.emaPrice += EMA_ALPHA * (token.price - token.emaPrice);

        // Update confidence (simulates bid-ask spread / publisher disagreement)
        // More volatile tokens get wider confidence intervals
        const absChange = Math.abs(token.changePercent1h);
        token.confidence = token.price * (0.002 + absChange * 0.0005);

        // Notify listeners
        this.listeners.forEach(fn => fn(id, token));
      }
    }, 2000);
  }

  stopSimulation() {
    this.isSimulating = false;
    if (this._simulationInterval) {
      clearInterval(this._simulationInterval);
      this._simulationInterval = null;
    }
  }

  onPriceUpdate(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(fn => fn !== callback);
    };
  }

  /**
   * Calculate power score using Pyth-native formula:
   * power = ((price - emaPrice) / emaPrice) × (confidence / price) × POWER_SCALE
   *
   * Positive power = pumping = attacker
   * Negative power = dumping = defender
   */
  calcPower(tokenId) {
    const token = this.tokens[tokenId];
    if (!token || !token.emaPrice || token.emaPrice === 0) return 0;

    const momentum = (token.price - token.emaPrice) / token.emaPrice;
    const activity = token.confidence / token.price;
    return parseFloat((momentum * activity * POWER_SCALE).toFixed(1));
  }

  /**
   * Get full token data including power score
   */
  getTokenWithPower(tokenId) {
    const token = this.tokens[tokenId];
    if (!token) return null;
    return {
      id: tokenId,
      ...token,
      power: this.calcPower(tokenId),
    };
  }

  /**
   * Get all tokens with power scores, sorted by power descending
   */
  getAllTokensWithPower() {
    return Object.keys(this.tokens)
      .map(id => this.getTokenWithPower(id))
      .sort((a, b) => b.power - a.power);
  }

  /**
   * Get the combat role for a token based on its current price action
   */
  getTokenRole(tokenId) {
    const token = this.tokens[tokenId];
    if (!token) return 'utility';

    const pct = token.changePercent1h;
    if (pct > 10) return 'glass-cannon';
    if (pct > 1) return 'attacker';
    if (pct > -1) return 'utility';
    if (pct > -10) return 'defender';
    return 'fortress';
  }

  /**
   * Calculate elixir cost based on market cap tier
   * (placeholder — will use real market cap data with Pyth)
   */
  getElixirCost(tokenId) {
    const token = this.tokens[tokenId];
    if (!token) return 3;

    // Higher price = higher cost (rough proxy for market cap)
    if (token.price > 5) return 6;      // Large cap = expensive/tanky
    if (token.price > 1) return 4;      // Mid cap
    if (token.price > 0.01) return 3;   // Small cap
    return 2;                            // Micro cap = cheap/swarmy
  }
}

// Singleton
export const priceService = new PriceService();
export default PriceService;
