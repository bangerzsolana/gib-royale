import Troop from "../TroopBase.js";
import Components from "../../components/index.js";
import CARD_TYPES from "../../../../data/CardTypeConfig.js";
const MIXINS = [Components.CanWalk];
const TYPE = CARD_TYPES.Tank;

class TankTroop extends Troop {
  constructor(config) {
    super(MIXINS, config);
    this.cardType = 'Tank';
    this.hpDivisor = TYPE.hpDivisor;
    this.setMovementSpeed(TYPE.speed);
    this.setAttentionRange(TYPE.attentionRange);
    this.setEffectRange(TYPE.effectRange);
    this.setEffectRate(TYPE.effectRate);
    this.setMaxVelocity(this.movementSpeed);
  }
}

const STATIC = TankTroop;
STATIC.NAME = "TankTroop";
STATIC.COST = TYPE.cost;
STATIC.doSpawn = function(config) { new TankTroop(config); };

export default TankTroop;
