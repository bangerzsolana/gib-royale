import Troop from "../TroopBase.js";
import Components from "../../components/index.js";
import CARD_TYPES from "../../../../data/CardTypeConfig.js";
const MIXINS = [Components.CanWalk];
const SPAWNER = CARD_TYPES.Spawner;

/**
 * DinoTroop — spawner child unit.
 * Inherits parent's coin (tokenId + deployPrice passed via config).
 * HP = parent HP ÷ 8 (set via hpDivisor, applied in HasPriceData).
 * Does not spawn further children.
 */
class DinoTroop extends Troop {
  constructor(config) {
    super(MIXINS, config);
    this.cardType = 'SpawnerChild';
    this.hpDivisor = SPAWNER.childHpDivisor; // HP ÷ 8
    this.setMovementSpeed(SPAWNER.childSpeed);
    this.setAttentionRange(SPAWNER.childAttentionRange);
    this.setEffectRange(SPAWNER.childEffectRange);
    this.setEffectRate(SPAWNER.childEffectRate);
    this.setMaxVelocity(this.movementSpeed);
  }
}

const STATIC = DinoTroop;
STATIC.NAME = "DinoTroop";
STATIC.COST = 0; // Not directly deployable
STATIC.doSpawn = function(config) { new DinoTroop(config); };

export default DinoTroop;
