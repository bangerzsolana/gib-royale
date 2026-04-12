/**
 * PriceService — fetches live price data from Pyth Network Hermes API
 * for all gib-meme coins that have Pyth feeds.
 *
 * Uses the EMA-based power formula:
 *   power = ((price - emaPrice) / emaPrice) × (confidence / price) × POWER_SCALE
 *
 * Positive power = pumping = attacker
 * Negative power = dumping = defender
 */

// Scaling factor so power displays as nice numbers like +6.9 or -3.2
const POWER_SCALE = 5000;

// All gib-meme coins with exact Pyth feed IDs
const PYTH_COINS = [
  { symbol: 'BONK',     feedId: '72b021217ca3fe68922a19aaf990109cb9d84e9ad004b4d2025ad6f529314419' },
  { symbol: 'WIF',      feedId: '4ca4beeca86f0d164160323817a4e42b10010a724c2217c6ee41b54cd4cc61fc' },
  { symbol: 'POPCAT',   feedId: 'b9312a7ee50e189ef045aa3c7842e099b061bd9bdc99ac645956c3b660dc8cce' },
  { symbol: 'WEN',      feedId: '5169491cd7e2a44c98353b779d5eb612e4ac32e073f5cc534303d86307c2f1bc' },
  { symbol: 'TRUMP',    feedId: '879551021853eec7a7dc827578e8e69da7e4fa8148339aa0d3d5296405be4b1a' },
  { symbol: 'FARTCOIN', feedId: '58cd29ef0e714c5affc44f269b2c1899a52da4169d7acc147b9da692e6953608' },
  { symbol: 'BONK',     feedId: '72b021217ca3fe68922a19aaf990109cb9d84e9ad004b4d2025ad6f529314419' },
  { symbol: 'PNUT',     feedId: '116da895807f81f6b5c5f01b109376e7f6834dc8b51365ab7cdfa66634340e54' },
  { symbol: 'MOODENG',  feedId: 'ffff73128917a90950cd0473fd2551d7cd274fd5a6cc45641881bbcc6ee73417' },
  { symbol: 'GRIFFAIN', feedId: '159b86e6ca1a2a6bd613953d1cd46008bd1200284bebc3e4c7cc36c3aa3edda9' },
  { symbol: 'ZEREBRO',  feedId: '3dd13bf483f196da0429b354db1fa4802ff6a5c19c559a6abdd9a92707f426dc' },
  { symbol: 'MELANIA',  feedId: '8fef7d52c7f4e3a6258d663f9d27e64a1b6fd95ab5f7d545dbf9a515353d0064' },
  { symbol: 'FWOG',     feedId: '656cc2a39dd795bdecb59de810d4f4d1e74c25fe4c42d0bf1c65a38d74df48e9' },
  { symbol: 'SEND',     feedId: '7d19b607c945f7edf3a444289c86f7b58dcd8b18df82deadf925074807c99b59' },
  { symbol: 'RETARDIO', feedId: '527f38d4b210854189c2e7487e57297d7ddbdea1b23a5e8a6a5bbc98944abe93' },
  { symbol: 'VINE',     feedId: '22a54087e443d4d1db5bd018923337c72c818a99ca521ead71f72fa058f1ccf1' },
  { symbol: 'BAN',      feedId: 'a6320c8329924601f4d092dd3f562376f657fa0b5d0cba9e4385a24aaf135384' },
  { symbol: 'AIXBT',    feedId: '0fc54579a29ba60a08fdb5c28348f22fd3bec18e221dd6b90369950db638a5a7' },
  { symbol: 'ELIZA',    feedId: '0e0fe74b2bc91e867d7f46757faf64c5a497c11515956d7016ae97493f5f6ff4' },
  { symbol: 'ELON',     feedId: 'c9cf25cd0df326b7fb3548b37d38e1e5c6ba202188a44ad98b79335c2b202f7b' },
  { symbol: 'PUMP',     feedId: '7a01fca212788bba7c5bf8c9efd576a8a722f070d2c17596ff7bb609b8d5c3b9' },
  { symbol: 'BIO',      feedId: 'd9d22050e7413a16129f1334cd4dd5a359975ce16389cdadae8f677cf46e2839' },
  { symbol: 'BITCOIN',  feedId: 'c5e0e0c92116c0c070a242b254270441a6201af680a33e0381561c59db3266c9' },
  { symbol: 'RAY',      feedId: '91568baa8beb53db23eb3fb7f22c6e8bd303d103919e19733f2bb642d3e7987a' },
  { symbol: 'RENDER',   feedId: '3d4a2bd9535be6ce8059d75eadeba507b043257321aa544717c56fa19b49e35d' },
  { symbol: 'VIRTUAL',  feedId: '8132e3eb1dac3e56939a16ff83848d194345f6688bff97eb1c8bd462d558802b' },
  { symbol: 'PYTH',     feedId: '0bbf28e9a841a1cc788f6a361b17ca072d0ea3098a1e5df1c3922d06719579ff' },
  { symbol: 'W',        feedId: 'eff7446475e218517566ea99e72a4abec2e1bd8498b43b7d8331e29dcb059389' },
  { symbol: 'JTO',      feedId: 'b43660a5f790c69354b0729a5ef9d50d68f1df92107540210b9cccba1f947cc2' },
  { symbol: 'GRASS',    feedId: '299ac948742a799d27a1649c76035b26577ad0eb6585a5ae2a691d31f2ee90c4' },
  { symbol: 'LAYER',    feedId: '3c987d95da67ceb12705b22448200568c15b6242796cacc21c11f622e74cfffb' },
  { symbol: 'LINK',     feedId: '8ac0c70fff57e9aefdf5edf44b51d62c2d433653cbb2cf5cc06bb115af04d221' },
  { symbol: 'AAVE',     feedId: '2b9ab1e972a281585084148ba1389800799bd4be63b957507db1349314e47445' },
  { symbol: 'UNI',      feedId: '78d185a741d07edb3412b09008b7c5cfb9bbbd7d568bf00ba737b456ba171501' },
  { symbol: 'CAKE',     feedId: '2356af9529a1064d41e32d617e2ce1dca5733afa901daba9e2b68dee5d53ecf9' },
  { symbol: 'SPX',      feedId: '8414cfadf82f6bed644d2e399c11df21ec0131aa574c56030b132113dbbf3a0a' },
  { symbol: 'HNT',      feedId: '649fdd7ec08e8e2a20f425729854e90293dcbe2376abc47197a14da6ff339756' },
  { symbol: 'ORE',      feedId: '142b804c658e14ff60886783e46e5a51bdf398b4871d9d8f7c28aa1585cad504' },
  { symbol: 'ORCA',     feedId: '37505261e557e251290b8c8899453064e8d760ed5c65a779726f2490980da74c' },
  { symbol: 'BAT',      feedId: '8e860fb74e60e5736b455d82f60b3728049c348e94961add5f961b02fdee2535' },
  { symbol: 'GMT',      feedId: 'baa284eaf23edf975b371ba2818772f93dbae72836bbdea28b07d40f3cf8b485' },
  { symbol: 'DRIFT',    feedId: '5c1690b27bb02446db17cdda13ccc2c1d609ad6d2ef5bf4983a85ea8b6f19d07' },
  { symbol: 'HONEY',    feedId: 'f67b033925d73d43ba4401e00308d9b0f26ab4fbd1250e8b5407b9eaade7e1f4' },
  { symbol: 'KMNO',     feedId: 'b17e5bc5de742a8a378b54c9c75442b7d51e30ada63f28d9bd28d3c0e26511a0' },
  { symbol: 'MASK',     feedId: 'b97d9aa5c9ea258252456963c3a9547d53e4848cb66ce342a3155520741a28d4' },
  { symbol: 'MOBILE',   feedId: 'ff4c53361e36a9b837433c87d290c229e1f01aec5ef98d9f3f70953a20a629ce' },
  { symbol: 'MON',      feedId: '31491744e2dbf6df7fcf4ac0820d18a609b49076d45066d3568424e62f686cd1' },
  { symbol: 'TNSR',     feedId: '05ecd4597cd48fe13d6cc3596c62af4f9675aee06e2e0b94c06d8bee2b659e05' },
  { symbol: 'C98',      feedId: '2dd14c7c38aa7066c7a508aac299ebcde5165b07d5d9f2d94dfbfe41f0bc5f2e' },
  { symbol: 'LUNC',     feedId: '4456d442a152fd1f972b18459263ef467d3c29fb9d667e30c463b086691fbc79' },
  { symbol: 'FTT',      feedId: '6c75e52531ec5fd3ef253f6062956a8508a2f03fa0a209fb7fbc51efd9d35f88' },
  { symbol: '1INCH',    feedId: '63f341689d98a12ef60a5cff1d7f85c70a9e17bf1575f0e7c0b2512d48b1c8b3' },
];

// Deduplicate by symbol (BONK was listed twice)
const COINS = [];
const seen = new Set();
for (const c of PYTH_COINS) {
  if (!seen.has(c.symbol)) {
    seen.add(c.symbol);
    COINS.push(c);
  }
}

const HERMES_URL = 'https://hermes.pyth.network/v2/updates/price/latest';

class PriceService {
  constructor() {
    this.tokens = {};
    this.coins = COINS;
    this.listeners = [];
    this.isPolling = false;
    this._pollInterval = null;
  }

  /**
   * Get all coin definitions
   */
  getCoinList() {
    return this.coins;
  }

  /**
   * Fetch latest prices from Pyth Hermes API for all coins
   */
  async fetchPrices() {
    try {
      const ids = this.coins.map(c => c.feedId);
      const params = ids.map(id => `ids[]=${id}`).join('&');
      const url = `${HERMES_URL}?${params}&parsed=true`;

      const resp = await fetch(url);
      if (!resp.ok) throw new Error(`Hermes API error: ${resp.status}`);

      const data = await resp.json();
      const parsed = data.parsed || [];

      // Build a feedId -> parsed price map
      const priceMap = {};
      for (const entry of parsed) {
        priceMap[entry.id] = entry;
      }

      // Update tokens
      for (const coin of this.coins) {
        const entry = priceMap[coin.feedId];
        if (!entry || !entry.price) continue;

        const priceData = entry.price;
        const emaData = entry.ema_price;

        const price = parseFloat(priceData.price) * Math.pow(10, priceData.expo);
        const confidence = parseFloat(priceData.conf) * Math.pow(10, priceData.expo);
        const emaPrice = emaData
          ? parseFloat(emaData.price) * Math.pow(10, emaData.expo)
          : price;
        const emaConfidence = emaData
          ? parseFloat(emaData.conf) * Math.pow(10, emaData.expo)
          : confidence;

        this.tokens[coin.symbol] = {
          name: coin.symbol,
          price,
          confidence,
          emaPrice,
          emaConfidence,
          publishTime: priceData.publish_time,
        };

        // Notify listeners
        this.listeners.forEach(fn => fn(coin.symbol, this.tokens[coin.symbol]));
      }

      return true;
    } catch (err) {
      console.error('PriceService fetch error:', err);
      return false;
    }
  }

  /**
   * Start polling Pyth every N seconds
   */
  startPolling(intervalMs = 3000) {
    if (this.isPolling) return;
    this.isPolling = true;

    // Fetch immediately
    this.fetchPrices();

    this._pollInterval = setInterval(() => {
      this.fetchPrices();
    }, intervalMs);
  }

  stopPolling() {
    this.isPolling = false;
    if (this._pollInterval) {
      clearInterval(this._pollInterval);
      this._pollInterval = null;
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
   * power = ((price - emaPrice) / emaPrice) x (confidence / price) x POWER_SCALE
   */
  calcPower(symbol) {
    const token = this.tokens[symbol];
    if (!token || !token.emaPrice || token.emaPrice === 0 || token.price === 0) return 0;

    const momentum = (token.price - token.emaPrice) / token.emaPrice;
    const activity = token.confidence / token.price;
    return parseFloat((momentum * activity * POWER_SCALE).toFixed(1));
  }

  /**
   * Get full token data including power score
   */
  getTokenWithPower(symbol) {
    const token = this.tokens[symbol];
    if (!token) return null;
    return {
      id: symbol,
      ...token,
      power: this.calcPower(symbol),
    };
  }

  /**
   * Get role based on power score
   */
  getTokenRole(symbol) {
    const power = this.calcPower(symbol);
    if (power > 5) return 'glass-cannon';
    if (power > 1) return 'attacker';
    if (power > -1) return 'utility';
    if (power > -5) return 'defender';
    return 'fortress';
  }

  /**
   * Get all tokens with power scores, sorted by power descending
   */
  getAllTokensWithPower() {
    return Object.keys(this.tokens)
      .map(sym => this.getTokenWithPower(sym))
      .filter(Boolean)
      .sort((a, b) => b.power - a.power);
  }
}

// Singleton
export const priceService = new PriceService();
export default PriceService;
