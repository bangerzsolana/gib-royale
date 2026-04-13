/**
 * CardTypeConfig — single source of truth for the 6 card types.
 *
 * These are the STATIC values per type. HP and ATK are dynamic (market-driven)
 * and are NOT defined here. Only movement, cost, ranges, and timing live here.
 *
 * Type       | Units | HP Split  | Defining trait
 * -----------|-------|-----------|--------------------------------------
 * Tank       | 1     | Full      | Slowest, tankiest, absorbs damage
 * Bruiser    | 1     | Full      | Main offensive unit, steady damage
 * Flyer      | 3     | HP ÷ 3   | Only air unit, bypasses ground troops
 * Swarm      | 5     | HP ÷ 5   | Fast ground rush, overwhelm with numbers
 * Spawner    | 1     | Full      | Immovable building, spawns children
 * Cycle      | 1     | Full      | 1 elixir cheap distraction, fast deploy
 */

const CARD_TYPES = {
  Tank: {
    unitCount: 1,
    hpDivisor: 1,
    speed: 5,        // px/s — slowest in the game
    cost: 6,         // elixir — most expensive
    attentionRange: 80,
    effectRange: 60,
    effectRate: 3000, // ms — slow, heavy hits
    canFly: false,
    isSpawner: false,
  },
  Bruiser: {
    unitCount: 1,
    hpDivisor: 1,
    speed: 12,
    cost: 4,
    attentionRange: 90,
    effectRange: 70,
    effectRate: 1500,
    canFly: false,
    isSpawner: false,
  },
  Flyer: {
    unitCount: 3,
    hpDivisor: 3,     // each unit gets HP ÷ 3
    speed: 15,
    cost: 4,
    attentionRange: 90,
    effectRange: 80,
    effectRate: 2000,
    canFly: true,
    isSpawner: false,
  },
  Swarm: {
    unitCount: 5,
    hpDivisor: 5,     // each unit gets HP ÷ 5
    speed: 25,         // fastest ground unit
    cost: 3,
    attentionRange: 80,
    effectRange: 60,
    effectRate: 1000,  // rapid fire
    canFly: false,
    isSpawner: false,
  },
  Spawner: {
    unitCount: 1,
    hpDivisor: 1,
    speed: 0,          // immovable building
    cost: 5,
    attentionRange: 0, // doesn't attack
    effectRange: 0,
    effectRate: 0,
    canFly: false,
    isSpawner: true,
    spawnRate: 3000,   // ms between child spawns
    spawnDelay: 2000,  // ms before first spawn
    childHpDivisor: 8, // child HP = parent HP ÷ 8
    childSpeed: 15,
    childEffectRate: 1500,
    childAttentionRange: 80,
    childEffectRange: 60,
  },
  Cycle: {
    unitCount: 1,
    hpDivisor: 1,
    speed: 20,         // fast
    cost: 1,           // cheapest — distraction
    attentionRange: 80,
    effectRange: 60,
    effectRate: 1500,
    canFly: false,
    isSpawner: false,
  },
};

export { CARD_TYPES };
export default CARD_TYPES;
