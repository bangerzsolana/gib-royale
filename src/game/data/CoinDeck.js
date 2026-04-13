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
  { symbol: 'BONK',     troopClass: BattleOtterTroop, color: 0x006b58 },
  { symbol: 'WIF',      troopClass: QuackerTroop,     color: 0x8993eb },
  { symbol: 'TRUMP',    troopClass: EvilTroop,         color: 0x313131 },
  { symbol: 'FARTCOIN', troopClass: VolcanoTroop,      color: 0x000000 },
  { symbol: 'POPCAT',   troopClass: ChickphinTroop,    color: 0x9cffff },
  { symbol: 'MOODENG',  troopClass: LilDemonTroop,     color: 0x3ad789 },
  { symbol: 'SOL',      troopClass: TankTroop,          color: 0x14f195 },
  { symbol: 'PNUT',     troopClass: AlienTroop,         color: 0x3a314e },
];

export default COIN_DECK;
