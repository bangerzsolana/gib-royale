import Troop from "../TroopBase.js";
import Components from "../../components/index.js";
import CARD_TYPES from "../../../../data/CardTypeConfig.js";
const MIXINS = [Components.CanWalk];
const TYPE = CARD_TYPES.Cycle;

class BabyCowTroop extends Troop {
  constructor(config) {
    super(MIXINS, config);
    this.cardType = 'Cycle';
    this.hpDivisor = TYPE.hpDivisor;
    this.setMovementSpeed(TYPE.speed);
    this.setAttentionRange(TYPE.attentionRange);
    this.setEffectRange(TYPE.effectRange);
    this.setEffectRate(TYPE.effectRate);
    this.setMaxVelocity(this.movementSpeed);
  }
}

const STATIC = BabyCowTroop;
STATIC.NAME = "BabyCowTroop";
STATIC.COST = TYPE.cost;
STATIC.doSpawn = function(config) { new BabyCowTroop(config); };

export default BabyCowTroop;
