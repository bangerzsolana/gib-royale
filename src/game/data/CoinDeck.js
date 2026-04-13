/**
 * CoinDeck — maps meme coins to troop sprite characters.
 *
 * Each coin gets a colored blob, and its combat stats are driven by
 * its live power score from PriceService.
 *
 * 28-card expanded deck for variety. Troop classes are cycled
 * since they're just visual — all gameplay comes from price data.
 */

import EvilTroop from '../classes/entities/troops/walkers/EvilTroop.js';
import LilDemonTroop from '../classes/entities/troops/walkers/LilDemonTroop.js';
import BattleOtterTroop from '../classes/entities/troops/walkers/BattleOtterTroop.js';
import AlienTroop from '../classes/entities/troops/walkers/AlienTroop.js';
import ChickphinTroop from '../classes/entities/troops/walkers/ChickphinTroop.js';
import QuackerTroop from '../classes/entities/troops/walkers/QuackerTroop.js';
import TankTroop from '../classes/entities/troops/walkers/TankTroop.js';
import VolcanoTroop from '../classes/entities/troops/walkers/VolcanoTroop.js';
import DinoTroop from '../classes/entities/troops/walkers/DinoTroop.js';
import MagicPuppyTroop from '../classes/entities/troops/walkers/MagicPuppyTroop.js';
import WitchTroop from '../classes/entities/troops/walkers/WitchTroop.js';
import ClownGuyTroop from '../classes/entities/troops/walkers/ClownGuyTroop.js';
import ClownLadyTroop from '../classes/entities/troops/walkers/ClownLadyTroop.js';
import BabyCowTroop from '../classes/entities/troops/walkers/BabyCowTroop.js';
import MamaCowTroop from '../classes/entities/troops/walkers/MamaCowTroop.js';
import ZDogTroop from '../classes/entities/troops/walkers/ZDogTroop.js';

const TROOP_CLASSES = [
  BattleOtterTroop, QuackerTroop, EvilTroop, ChickphinTroop,
  VolcanoTroop, AlienTroop, LilDemonTroop, TankTroop,
  DinoTroop, MagicPuppyTroop, WitchTroop, ClownGuyTroop,
  ClownLadyTroop, BabyCowTroop, MamaCowTroop, ZDogTroop
];

const COIN_DECK = [
  // ── Blue chips ──
  { symbol: 'BTC',      troopClass: TankTroop,          color: 0xf7931a },
  { symbol: 'ETH',      troopClass: DinoTroop,          color: 0x627eea },
  { symbol: 'SOL',      troopClass: MagicPuppyTroop,    color: 0x14f195 },
  // ── Big memes ──
  { symbol: 'BONK',     troopClass: BattleOtterTroop,   color: 0xf7931a },
  { symbol: 'WIF',      troopClass: QuackerTroop,       color: 0x8993eb },
  { symbol: 'TRUMP',    troopClass: EvilTroop,           color: 0xcc2222 },
  { symbol: 'POPCAT',   troopClass: ChickphinTroop,      color: 0xff69b4 },
  { symbol: 'FARTCOIN', troopClass: VolcanoTroop,        color: 0x88cc44 },
  // ── Mid memes ──
  { symbol: 'FWOG',     troopClass: AlienTroop,          color: 0x44bb44 },
  { symbol: 'RETARDIO', troopClass: LilDemonTroop,       color: 0xcc3333 },
  { symbol: 'WEN',      troopClass: WitchTroop,          color: 0x9944cc },
  { symbol: 'SEND',     troopClass: ClownGuyTroop,       color: 0x3388dd },
  { symbol: 'PNUT',     troopClass: BabyCowTroop,        color: 0xddaa44 },
  { symbol: 'MOODENG',  troopClass: ClownLadyTroop,      color: 0x00ccff },
  { symbol: 'MELANIA',  troopClass: MamaCowTroop,        color: 0xff66aa },
  { symbol: 'VINE',     troopClass: ZDogTroop,           color: 0x00b488 },
  // ── DeFi / Infra ──
  { symbol: 'RAY',      troopClass: BattleOtterTroop,    color: 0x5c6bc0 },
  { symbol: 'RENDER',   troopClass: QuackerTroop,        color: 0x00e5ff },
  { symbol: 'PYTH',     troopClass: ChickphinTroop,      color: 0x7b61ff },
  { symbol: 'ORCA',     troopClass: AlienTroop,          color: 0xffcc00 },
  { symbol: 'GRASS',    troopClass: DinoTroop,           color: 0x66bb6a },
  { symbol: 'VIRTUAL',  troopClass: LilDemonTroop,       color: 0x8e24aa },
  { symbol: 'JTO',      troopClass: VolcanoTroop,        color: 0xef6c00 },
  { symbol: 'LINK',     troopClass: TankTroop,           color: 0x2962ff },
  // ── AI / Social ──
  { symbol: 'AIXBT',    troopClass: EvilTroop,           color: 0x1a237e },
  { symbol: 'GRIFFAIN', troopClass: MagicPuppyTroop,     color: 0xffa726 },
  { symbol: 'PUMP',     troopClass: WitchTroop,          color: 0x00c853 },
  { symbol: 'SPX',      troopClass: ClownGuyTroop,       color: 0xd32f2f },
];

export default COIN_DECK;
