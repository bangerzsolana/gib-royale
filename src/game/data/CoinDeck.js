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

/**
 * The 8-card starter deck.
 * Each entry maps a coin symbol to a troop class (pixel character).
 */
const COIN_DECK = [
  { symbol: 'BONK',     troopClass: BattleOtterTroop, color: 0xf7931a },
  { symbol: 'WIF',      troopClass: QuackerTroop,     color: 0x9945ff },
  { symbol: 'TRUMP',    troopClass: EvilTroop,         color: 0xff4444 },
  { symbol: 'FARTCOIN', troopClass: VolcanoTroop,      color: 0x44bb44 },
  { symbol: 'POPCAT',   troopClass: ChickphinTroop,    color: 0xff69b4 },
  { symbol: 'MOODENG',  troopClass: LilDemonTroop,     color: 0x00ccff },
  { symbol: 'SOL',      troopClass: TankTroop,          color: 0x14f195 },
  { symbol: 'PNUT',     troopClass: AlienTroop,         color: 0xddaa44 },
];

export default COIN_DECK;
