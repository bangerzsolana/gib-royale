/**
 * CoinDeck — maps meme coins to troop sprite characters.
 *
 * Each coin gets a pixel character, and its combat stats are driven by
 * its live power score from PriceService.
 *
 * 8-card starter deck for the player.
 * The opponent uses a mirrored random selection.
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

/**
 * 12-card deck with all three roles represented.
 * Tanks (mega-cap >$5B): BTC, ETH, SOL — high HP, slow, durable
 * Fighters (mid-cap $500M–$5B): BONK, WIF, TRUMP, POPCAT — balanced
 * Glass Cannons (small-cap <$500M): FWOG, RETARDIO, WEN, SEND — fast, fragile, high damage
 */
const COIN_DECK = [
  // ── Tanks (mega-cap) ──
  { symbol: 'BTC',      troopClass: TankTroop,          color: 0xf7931a },
  { symbol: 'ETH',      troopClass: DinoTroop,          color: 0x627eea },
  { symbol: 'SOL',      troopClass: MagicPuppyTroop,    color: 0x14f195 },
  // ── Fighters (mid-cap memes) ──
  { symbol: 'BONK',     troopClass: BattleOtterTroop,   color: 0x006b58 },
  { symbol: 'WIF',      troopClass: QuackerTroop,       color: 0x8993eb },
  { symbol: 'TRUMP',    troopClass: EvilTroop,           color: 0x313131 },
  { symbol: 'POPCAT',   troopClass: ChickphinTroop,      color: 0x9cffff },
  { symbol: 'FARTCOIN', troopClass: VolcanoTroop,        color: 0x000000 },
  // ── Glass Cannons (small-cap) ──
  { symbol: 'FWOG',     troopClass: AlienTroop,          color: 0x44bb44 },
  { symbol: 'RETARDIO', troopClass: LilDemonTroop,       color: 0xcc3333 },
  { symbol: 'WEN',      troopClass: WitchTroop,          color: 0x9944cc },
  { symbol: 'SEND',     troopClass: ClownGuyTroop,       color: 0x3388dd },
];

export default COIN_DECK;
