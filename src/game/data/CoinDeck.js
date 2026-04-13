/**
 * CoinDeck — maps meme coins to card types.
 *
 * Each coin is assigned a card type (Tank, Bruiser, Flyer, Swarm, Spawner, Cycle)
 * based on its market cap tier. The card type determines which troop class is used,
 * and all static stats come from CardTypeConfig.js.
 *
 * HP and ATK are dynamic — driven by live market data via HasPriceData.
 *
 * Assignment logic:
 *   Tank     → highest cap coins (big HP pool, slow wall)
 *   Bruiser  → high-to-mid cap (main offensive, steady damage)
 *   Flyer    → mid cap (3 air units, bypasses ground)
 *   Swarm    → mid cap (5 fast ground units)
 *   Spawner  → high cap (building that survives, spawns children)
 *   Cycle    → low cap (1 elixir throwaway distraction)
 */

import TankTroop from '../classes/entities/troops/walkers/TankTroop.js';
import EvilTroop from '../classes/entities/troops/walkers/EvilTroop.js';
import QuackerTroop from '../classes/entities/troops/walkers/QuackerTroop.js';
import AlienTroop from '../classes/entities/troops/walkers/AlienTroop.js';
import VolcanoTroop from '../classes/entities/troops/walkers/VolcanoTroop.js';
import BabyCowTroop from '../classes/entities/troops/walkers/BabyCowTroop.js';

// Troop class per card type — these are the only 6 that matter
const TYPE_TO_TROOP = {
  Tank:    TankTroop,
  Bruiser: EvilTroop,
  Flyer:   QuackerTroop,
  Swarm:   AlienTroop,
  Spawner: VolcanoTroop,
  Cycle:   BabyCowTroop,
};

const COIN_DECK = [
  // ── Tank (high-cap, slow wall, absorbs damage) ──
  { symbol: 'BTC',      cardType: 'Tank',    troopClass: TYPE_TO_TROOP.Tank,    color: 0xf7931a },
  { symbol: 'ETH',      cardType: 'Tank',    troopClass: TYPE_TO_TROOP.Tank,    color: 0x627eea },
  { symbol: 'SOL',      cardType: 'Tank',    troopClass: TYPE_TO_TROOP.Tank,    color: 0x14f195 },

  // ── Bruiser (high-to-mid cap, main offensive) ──
  { symbol: 'BONK',     cardType: 'Bruiser', troopClass: TYPE_TO_TROOP.Bruiser, color: 0xf7931a },
  { symbol: 'WIF',      cardType: 'Bruiser', troopClass: TYPE_TO_TROOP.Bruiser, color: 0x8993eb },
  { symbol: 'TRUMP',    cardType: 'Bruiser', troopClass: TYPE_TO_TROOP.Bruiser, color: 0xcc2222 },
  { symbol: 'POPCAT',   cardType: 'Bruiser', troopClass: TYPE_TO_TROOP.Bruiser, color: 0xff69b4 },
  { symbol: 'LINK',     cardType: 'Bruiser', troopClass: TYPE_TO_TROOP.Bruiser, color: 0x2962ff },
  { symbol: 'RENDER',   cardType: 'Bruiser', troopClass: TYPE_TO_TROOP.Bruiser, color: 0x00e5ff },

  // ── Flyer (mid-cap, 3 air units) ──
  { symbol: 'FARTCOIN', cardType: 'Flyer',   troopClass: TYPE_TO_TROOP.Flyer,   color: 0x88cc44 },
  { symbol: 'RAY',      cardType: 'Flyer',   troopClass: TYPE_TO_TROOP.Flyer,   color: 0x5c6bc0 },
  { symbol: 'PYTH',     cardType: 'Flyer',   troopClass: TYPE_TO_TROOP.Flyer,   color: 0x7b61ff },
  { symbol: 'VIRTUAL',  cardType: 'Flyer',   troopClass: TYPE_TO_TROOP.Flyer,   color: 0x8e24aa },
  { symbol: 'ORCA',     cardType: 'Flyer',   troopClass: TYPE_TO_TROOP.Flyer,   color: 0xffcc00 },

  // ── Swarm (mid-cap, 5 fast ground units) ──
  { symbol: 'FWOG',     cardType: 'Swarm',   troopClass: TYPE_TO_TROOP.Swarm,   color: 0x44bb44 },
  { symbol: 'RETARDIO', cardType: 'Swarm',   troopClass: TYPE_TO_TROOP.Swarm,   color: 0xcc3333 },
  { symbol: 'PNUT',     cardType: 'Swarm',   troopClass: TYPE_TO_TROOP.Swarm,   color: 0xddaa44 },
  { symbol: 'MOODENG',  cardType: 'Swarm',   troopClass: TYPE_TO_TROOP.Swarm,   color: 0x00ccff },
  { symbol: 'GRASS',    cardType: 'Swarm',   troopClass: TYPE_TO_TROOP.Swarm,   color: 0x66bb6a },

  // ── Spawner (high-cap building, spawns children) ──
  { symbol: 'JTO',      cardType: 'Spawner', troopClass: TYPE_TO_TROOP.Spawner, color: 0xef6c00 },
  { symbol: 'MELANIA',  cardType: 'Spawner', troopClass: TYPE_TO_TROOP.Spawner, color: 0xff66aa },
  { symbol: 'VINE',     cardType: 'Spawner', troopClass: TYPE_TO_TROOP.Spawner, color: 0x00b488 },

  // ── Cycle (low-cap, 1 elixir distraction) ──
  { symbol: 'WEN',      cardType: 'Cycle',   troopClass: TYPE_TO_TROOP.Cycle,   color: 0x9944cc },
  { symbol: 'SEND',     cardType: 'Cycle',   troopClass: TYPE_TO_TROOP.Cycle,   color: 0x3388dd },
  { symbol: 'AIXBT',    cardType: 'Cycle',   troopClass: TYPE_TO_TROOP.Cycle,   color: 0x1a237e },
  { symbol: 'GRIFFAIN', cardType: 'Cycle',   troopClass: TYPE_TO_TROOP.Cycle,   color: 0xffa726 },
  { symbol: 'PUMP',     cardType: 'Cycle',   troopClass: TYPE_TO_TROOP.Cycle,   color: 0x00c853 },
  { symbol: 'SPX',      cardType: 'Cycle',   troopClass: TYPE_TO_TROOP.Cycle,   color: 0xd32f2f },
];

export default COIN_DECK;
