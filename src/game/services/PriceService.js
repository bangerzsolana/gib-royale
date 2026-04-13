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

// Scaling factor: momentum × POWER_SCALE gives nice display numbers
// e.g. 0.5% above EMA → 0.005 × 1000 = 5.0
const POWER_SCALE = 1000;

// Railway API for coins without Pyth feeds (updated every 5 min, CMC/CoinGecko-sourced)
const RAILWAY_API_URL = 'https://uniblock-migration-production.up.railway.app/api/latest';

// All 110 game coins — non-Pyth ones get data from Railway API
const NON_PYTH_COINS = [
  'AURA', 'NPC', 'USDUC', 'STNK', 'DOG', 'MPLX', 'LABUBU',
  'CARDS', 'SAVE', 'PURPE', 'SNS', 'STEP', 'SIGMA', 'PLAY', 'GLDX',
  'SCF', 'CWIF', 'LETSBONK', 'MAX', 'POWSCHE', 'ROCKY', 'SILLY',
  'SKR', 'VX', 'BRK.BX', 'CHONKY',
];

// All gib-meme coins with Pyth feed IDs (crypto + stock-mirror tokens)
const PYTH_COINS = [
  // ── Blue-chip / mega-cap ──
  { symbol: 'BTC',      feedId: 'e62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43' },
  { symbol: 'ETH',      feedId: 'ff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace' },
  { symbol: 'SOL',      feedId: 'ef0d8b6fda2ceba41da15d4095d1da392a0d2f8ed0c6c7bc0f4cfac8c280b56d' },
  // ── Meme / Solana tokens ──
  { symbol: 'BONK',     feedId: '72b021217ca3fe68922a19aaf990109cb9d84e9ad004b4d2025ad6f529314419' },
  { symbol: 'WIF',      feedId: '4ca4beeca86f0d164160323817a4e42b10010a724c2217c6ee41b54cd4cc61fc' },
  { symbol: 'POPCAT',   feedId: 'b9312a7ee50e189ef045aa3c7842e099b061bd9bdc99ac645956c3b660dc8cce' },
  { symbol: 'WEN',      feedId: '5169491cd7e2a44c98353b779d5eb612e4ac32e073f5cc534303d86307c2f1bc' },
  { symbol: 'TRUMP',    feedId: '879551021853eec7a7dc827578e8e69da7e4fa8148339aa0d3d5296405be4b1a' },
  { symbol: 'FARTCOIN', feedId: '58cd29ef0e714c5affc44f269b2c1899a52da4169d7acc147b9da692e6953608' },
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
  { symbol: 'BABYDOGE', feedId: '053e0a17cc9282f191a6e60165dabd4a4861a8847c06eb34f54e07155eebedba' },
  { symbol: 'YZY',      feedId: 'b0d7b84fd7025b1e62283dd322a3fa7784780516d1b3df7717e86a390b2c97dd' },
  { symbol: 'USELESS',  feedId: 'f4b55102bfc9ea1bb2342ea2cb050209ed2a398f7c534afbbc5164541861ba23' },
  { symbol: 'SPX',      feedId: '8414cfadf82f6bed644d2e399c11df21ec0131aa574c56030b132113dbbf3a0a' },
  // ── DeFi / Infrastructure ──
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
  { symbol: 'HNT',      feedId: '649fdd7ec08e8e2a20f425729854e90293dcbe2376abc47197a14da6ff339756' },
  { symbol: 'ORE',      feedId: '142b804c658e14ff60886783e46e5a51bdf398b4871d9d8f7c28aa1585cad504' },
  { symbol: 'MET',      feedId: '0292e0f405bcd4a496d34e48307f6787349ad2bcd8505c3d3a9f77d81a67a682' },
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
  { symbol: '2Z',       feedId: 'f2b3ab1c49e35e881003c3c0482d18b181a1560b697b844c24c8f85aba1cab95' },
  { symbol: 'BMT',      feedId: 'a5fcd936b0178a425663f150dd87175bd8c374bff2ebc1e833ea73a67f721ca2' },
  // ── Stock-mirror crypto tokens ──
  { symbol: 'NVDAX',    feedId: '4244d07890e4610f46bbde67de8f43a4bf8b569eebe904f136b469f148503b7f' },
  { symbol: 'METAX',    feedId: 'bf3e5871be3f80ab7a4d1f1fd039145179fb58569e159aee1ccd472868ea5900' },
  { symbol: 'MCDX',     feedId: '27cac3c00ed32285b8686611bbc4a654279c1ea11ab4dc90822c2edd20734bca' },
  { symbol: 'TSLAX',    feedId: '47a156470288850a440df3a6ce85a55917b813a19bb5b31128a33a986566a362' },
  { symbol: 'AAPLX',    feedId: '978e6cc68a119ce066aa830017318563a9ed04ec3a0a6439010fc11296a58675' },
  { symbol: 'MSTRX',    feedId: '53f95ba4e23ed15ea56083e2ee9a5eec48055d6f59033d4bb95f1ca2a2349c28' },
  { symbol: 'COINX',    feedId: '641435d5dffb5311140b480517c79986d8488d5cf08a11eec53b83ad02cab33f' },
  { symbol: 'GOOGLX',   feedId: 'b911b0329028cd0283e4259c33809d62942bd2716a58084e5f31d64c00b5424e' },
  { symbol: 'QQQX',     feedId: '178a6f73a5aede9d0d682e86b0047c9f333ed0efe5c6537ca937565219c4054d' },
  { symbol: 'HOODX',    feedId: 'dd49a9ac6df5cbfa9d8fc6371f7ae927a74d5c6763c1c01b4220d70314c647f9' },
  { symbol: 'NFLXX',    feedId: '02a67e6184e6c9dd65e14745a2a80df8b2b3d2ca91b4b191404936003d9929ae' },
  // ── Equity-backed (Pyth equity feeds for stock-mirror game tokens) ──
  { symbol: 'PLTRX',    feedId: '11a70634863ddffb71f2b11f2cff29f73f3db8f6d0b78c49f2b5f4ad36e885f0' },
  { symbol: 'INTCX',    feedId: 'c1751e085ee292b8b3b9dd122a135614485a201c35dfc653553f0e28c1baf3ff' },
  { symbol: 'AMZNX',    feedId: 'b5d0e0fa58a1f8b81498ae670ce93c872d14434b72c364885d4fa1b257cbb07a' },
  { symbol: 'MSFTX',    feedId: 'd0ca23c1cc005e004ccf1db5bf76aeb6a49218f43dac3d4b275e92de12ded4d1' },
  { symbol: 'ORCLX',    feedId: 'e47ff732eaeb6b4163902bdee61572659ddf326511917b1423bae93fcdf3153c' },
  { symbol: 'PFEX',     feedId: '0704ad7547b3dfee329266ee53276349d48e4587cb08264a2818288f356efd1d' },
  { symbol: 'GSX',      feedId: '9c68c0c6999765cf6e27adf75ed551b34403126d3b0d5b686a2addb147ed4554' },
  { symbol: 'CRMX',     feedId: 'feff234600320f4d6bb5a01d02570a9725c1e424977f2b823f7231e6857bdae8' },
  { symbol: 'JPMX',     feedId: '7f4f157e57bfcccd934c566df536f34933e74338fe241a5425ce561acdab164e' },
  { symbol: 'KOX',      feedId: '9aa471dccea36b90703325225ac76189baf7e0cc286b8843de1de4f31f9caa7d' },
  { symbol: 'CSCOX',    feedId: '3f4b77dd904e849f70e1e812b7811de57202b49bc47c56391275c0f45f2ec481' },
  { symbol: 'PEPX',     feedId: 'be230eddb16aad5ad273a85e581e74eb615ebf67d378f885768d9b047df0c843' },
  { symbol: 'HDX',      feedId: 'b3a83dbe70b62241b0f916212e097465a1b31085fa30da3342dd35468ca17ca5' },
  { symbol: 'CVXX',     feedId: 'f464e36fd4ef2f1c3dc30801a9ab470dcdaaa0af14dd3cf6ae17a7fca9e051c5' },
  { symbol: 'GME',      feedId: '6f9cd89ef1b7fd39f667101a91ad578b6c6ace4579d5f7f285a4b06aa4504be6' },
  { symbol: 'VTIX',     feedId: '26c67e91769aeba33a09469c705a1863794014dac416e4270661f489309ae862' },
  // GLDX removed — feedId was corrupt (65 chars); moved to NON_PYTH_COINS
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
    this.nonPythCoins = NON_PYTH_COINS;
    this.listeners = [];
    this.isPolling = false;
    this._pollInterval = null;
  }

  /**
   * Get all coin definitions (Pyth + non-Pyth)
   */
  getCoinList() {
    return [
      ...this.coins,
      ...this.nonPythCoins.map(s => ({ symbol: s, source: 'railway' })),
    ];
  }

  /**
   * Fetch latest prices from Pyth Hermes API for all coins.
   * Batches into chunks of 40 to avoid URL length limits.
   */
  async fetchPrices() {
    try {
      const BATCH_SIZE = 40;
      const batches = [];
      for (let i = 0; i < this.coins.length; i += BATCH_SIZE) {
        batches.push(this.coins.slice(i, i + BATCH_SIZE));
      }

      const results = await Promise.all(batches.map(async (batch) => {
        try {
          const params = batch.map(c => `ids[]=${c.feedId}`).join('&');
          const url = `${HERMES_URL}?${params}&parsed=true`;
          const resp = await fetch(url);
          if (!resp.ok) throw new Error(`Hermes API error: ${resp.status}`);
          const data = await resp.json();
          return data.parsed || [];
        } catch (batchErr) {
          console.warn('PriceService: Pyth batch failed, skipping:', batchErr.message);
          return [];
        }
      }));

      // Build a feedId -> parsed price map from all batches
      const priceMap = {};
      for (const parsed of results) {
        for (const entry of parsed) {
          priceMap[entry.id] = entry;
        }
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
      console.error('PriceService Pyth fetch error:', err);
      return false;
    }
  }

  /**
   * Fetch prices for non-Pyth coins from Railway API (CMC/CoinGecko-sourced).
   * Returns pre-computed power scores; data refreshes every 5 min server-side.
   */
  async fetchRailwayPrices() {
    if (this.nonPythCoins.length === 0) return true;
    try {
      const tickers = this.nonPythCoins.map(s => `$${s}`).join(',');
      const resp = await fetch(`${RAILWAY_API_URL}?tickers=${tickers}`);
      if (!resp.ok) throw new Error(`Railway API error: ${resp.status}`);
      const data = await resp.json();

      // data is an array of { ticker, price, change_24h, change_7d, volume, market_cap, power, ... }
      const rows = Array.isArray(data) ? data : (data.data || []);
      for (const row of rows) {
        // Strip leading $ from ticker
        const symbol = (row.ticker || '').replace(/^\$/, '');
        if (!symbol) continue;

        this.tokens[symbol] = {
          name: symbol,
          price: row.price || 0,
          confidence: 0,
          emaPrice: 0,
          emaConfidence: 0,
          publishTime: row.ts ? Math.floor(new Date(row.ts).getTime() / 1000) : 0,
          // Railway-specific fields
          source: 'railway',
          change7d: row.change_7d || 0,
          volume24h: row.volume || 0,
          marketCap: row.market_cap || 0,
          railwayPower: row.power || 0,
        };

        this.listeners.forEach(fn => fn(symbol, this.tokens[symbol]));
      }
      return true;
    } catch (err) {
      console.error('PriceService Railway fetch error:', err);
      return false;
    }
  }

  /**
   * Fetch market cap data for ALL coins (Pyth + non-Pyth) from Railway API.
   * Market cap is used for movement speed: heavier (higher cap) = slower.
   */
  async fetchAllMarketCaps() {
    try {
      const allSymbols = [
        ...this.coins.map(c => c.symbol),
        ...this.nonPythCoins,
      ];
      // Batch into chunks of 40 to avoid URL length limits
      const BATCH_SIZE = 40;
      const batches = [];
      for (let i = 0; i < allSymbols.length; i += BATCH_SIZE) {
        batches.push(allSymbols.slice(i, i + BATCH_SIZE));
      }

      const results = await Promise.all(batches.map(async (batch) => {
        const tickers = batch.map(s => `$${s}`).join(',');
        const resp = await fetch(`${RAILWAY_API_URL}?tickers=${tickers}`);
        if (!resp.ok) throw new Error(`Railway API error: ${resp.status}`);
        return resp.json();
      }));

      for (const data of results) {
        const rows = Array.isArray(data) ? data : (data.data || []);
        for (const row of rows) {
          const symbol = (row.ticker || '').replace(/^\$/, '');
          if (!symbol) continue;
          // Merge market cap + volatility into existing token data (don't overwrite Pyth prices)
          if (this.tokens[symbol]) {
            this.tokens[symbol].marketCap = row.market_cap || 0;
            this.tokens[symbol].change7d = row.change_7d || this.tokens[symbol].change7d || 0;
            this.tokens[symbol].volume24h = row.volume || this.tokens[symbol].volume24h || 0;
          } else {
            // Token not yet fetched — store minimal data
            this.tokens[symbol] = {
              name: symbol,
              price: row.price || 0,
              marketCap: row.market_cap || 0,
              change7d: row.change_7d || 0,
              volume24h: row.volume || 0,
              source: 'railway',
            };
          }
        }
      }
      return true;
    } catch (err) {
      console.error('PriceService market cap fetch error:', err);
      return false;
    }
  }

  /**
   * Get market cap for a coin. Returns 0 if unavailable.
   */
  getMarketCap(symbol) {
    return (this.tokens[symbol] && this.tokens[symbol].marketCap) || 0;
  }

  /**
   * Calculate speed multiplier from market cap.
   * Higher market cap = heavier = slower.
   *
   * Uses log10 scale:
   *   $100K cap → 1.4x (zippy micro-cap)
   *   $1B cap   → 1.0x (baseline)
   *   $100B cap → 0.6x (heavy mega-cap)
   */
  getSpeedMultiplier(symbol) {
    const cap = this.getMarketCap(symbol);
    if (!cap || cap <= 0) return 1; // No data → normal speed

    const logCap = Math.log10(cap);
    // Clamp between 5 (100K) and 11 (100B)
    const normalized = Math.max(0, Math.min(1, (logCap - 5) / 6));
    // 1.4 at low cap, 0.6 at high cap
    return 1.4 - (normalized * 0.8);
  }

  /**
   * Calculate base HP from market cap.
   * Bigger coins = more health (tanks).
   *
   * Market Cap Tiers:
   *   >$50B   → 300 HP  (mega-cap: BTC, ETH, SOL)
   *   $5B-$50B → 200 HP  (large-cap: LINK, RENDER)
   *   $500M-$5B → 120 HP (mid-cap: BONK, WIF, POPCAT, TRUMP)
   *   $50M-$500M → 70 HP (small-cap: various meme coins)
   *   $5M-$50M → 40 HP   (micro-cap: tiny meme coins)
   *   <$5M    → 20 HP    (nano-cap)
   *
   * Uses continuous log scale between tiers for smooth transitions.
   */
  getBaseHP(symbol) {
    const cap = this.getMarketCap(symbol);
    if (!cap || cap <= 0) return 80; // No data → mid-range default

    const logCap = Math.log10(cap);
    // Tiers: log10($5M)=6.7, log10($50M)=7.7, log10($500M)=8.7, log10($5B)=9.7, log10($50B)=10.7
    if (logCap >= 10.7) return 300;       // >$50B
    if (logCap >= 9.7) return Math.round(200 + (logCap - 9.7) * 100);  // $5B-$50B: 200-300
    if (logCap >= 8.7) return Math.round(120 + (logCap - 8.7) * 80);   // $500M-$5B: 120-200
    if (logCap >= 7.7) return Math.round(70 + (logCap - 7.7) * 50);    // $50M-$500M: 70-120
    if (logCap >= 6.7) return Math.round(40 + (logCap - 6.7) * 30);    // $5M-$50M: 40-70
    return 20;                             // <$5M
  }

  /**
   * Calculate base damage from volatility (7-day % change magnitude).
   * More volatile coins = harder hitters (glass cannons).
   *
   * Volatility Tiers:
   *   >30% abs change → 40 base damage (extreme volatility)
   *   15-30%          → 25 base damage (high volatility)
   *   5-15%           → 15 base damage (medium volatility)
   *   <5%             → 8 base damage  (stable / low volatility)
   *
   * Uses continuous scale for smooth transitions.
   */
  getBaseDamage(symbol) {
    const token = this.tokens[symbol];
    if (!token) return 12; // No data → moderate default

    const volatility = Math.abs(token.change7d || 0);
    if (volatility >= 30) return 40;
    if (volatility >= 15) return Math.round(25 + (volatility - 15) / 15 * 15); // 25-40
    if (volatility >= 5)  return Math.round(15 + (volatility - 5) / 10 * 10);  // 15-25
    return Math.round(8 + volatility / 5 * 7);                                 // 8-15
  }

  /**
   * Get full market-driven combat stats for a coin.
   * Returns { hp, damage, speedMultiplier } or null if no data.
   */
  getCombatStats(symbol) {
    const token = this.tokens[symbol];
    if (!token) return null;
    return {
      hp: this.getBaseHP(symbol),
      damage: this.getBaseDamage(symbol),
      speedMultiplier: this.getSpeedMultiplier(symbol),
      marketCap: token.marketCap || 0,
      volatility: Math.abs(token.change7d || 0),
    };
  }

  /**
   * Start polling Pyth every N seconds
   */
  startPolling(intervalMs = 3000) {
    if (this.isPolling) return;
    this.isPolling = true;

    // Fetch immediately — Pyth (real-time) + Railway (5-min refresh) + market caps
    this.fetchPrices();
    this.fetchRailwayPrices();
    this.fetchAllMarketCaps();

    // Pyth polls frequently; Railway less often (data only updates every 5 min)
    this._pollInterval = setInterval(() => {
      this.fetchPrices();
    }, intervalMs);

    this._railwayPollInterval = setInterval(() => {
      this.fetchRailwayPrices();
      this.fetchAllMarketCaps(); // Refresh market caps alongside Railway data
    }, 5 * 60 * 1000); // 5 minutes
  }

  stopPolling() {
    this.isPolling = false;
    if (this._pollInterval) {
      clearInterval(this._pollInterval);
      this._pollInterval = null;
    }
    if (this._railwayPollInterval) {
      clearInterval(this._railwayPollInterval);
      this._railwayPollInterval = null;
    }
  }

  onPriceUpdate(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(fn => fn !== callback);
    };
  }

  /**
   * Calculate power score using price momentum:
   * power = ((price - emaPrice) / emaPrice) × POWER_SCALE
   *
   * Positive = pumping = attacker, Negative = dumping = defender
   * e.g. price 0.5% above EMA → power = +5.0
   */
  calcPower(symbol) {
    const token = this.tokens[symbol];
    if (!token) return 0;

    // Railway-sourced coins have pre-computed power from the cron service
    if (token.source === 'railway') {
      return parseFloat((token.railwayPower || 0).toFixed(1));
    }

    // Pyth-sourced coins: compute from EMA momentum
    if (!token.emaPrice || token.emaPrice === 0) return 0;
    const momentum = (token.price - token.emaPrice) / token.emaPrice;
    return parseFloat((momentum * POWER_SCALE).toFixed(1));
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
   * Get role based on market cap (stable identity that doesn't change day-to-day).
   *
   * Market cap determines WHAT the card IS:
   *   Mega/large cap (>$5B)     → Tank   — high HP, slow, durable
   *   Mid cap ($500M–$5B)       → Fighter — balanced stats
   *   Small/micro cap (<$500M)  → Glass Cannon — low HP, fast, high damage
   *
   * Power (volatile) determines HOW the card FEELS right now (ATK/DEF boost),
   * but role is tied to market cap so players can learn and remember card identities.
   */
  getTokenRole(symbol) {
    const cap = this.getMarketCap(symbol);
    if (!cap || cap <= 0) return 'Fighter'; // Default if no data

    if (cap >= 5e9)   return 'Tank';          // >$5B — mega/large cap
    if (cap >= 500e6) return 'Fighter';       // $500M–$5B — mid cap
    return 'Glass Cannon';                    // <$500M — small/micro cap
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
