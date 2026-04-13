import Troop from "../TroopBase.js";
import Components from "../../components/index.js";
import CARD_TYPES from "../../../../data/CardTypeConfig.js";
const MIXINS = [Components.CanFly];
const TYPE = CARD_TYPES.Flyer;

class QuackerTroop extends Troop {
  constructor(config) {
    super(MIXINS, config);
    this.cardType = 'Flyer';
    this.hpDivisor = TYPE.hpDivisor;
    this.setMovementSpeed(TYPE.speed);
    this.setAttentionRange(TYPE.attentionRange);
    this.setEffectRange(TYPE.effectRange);
    this.setEffectRate(TYPE.effectRate);
    this.setMaxVelocity(this.movementSpeed);
  }
}

const STATIC = QuackerTroop;
STATIC.NAME = "QuackerTroop";
STATIC.COST = TYPE.cost;
STATIC.doSpawn = function(config) {
  new QuackerTroop({ ...config, x: config.x, y: config.y });
  new QuackerTroop({ ...config, x: config.x + 15, y: config.y + 10 });
  new QuackerTroop({ ...config, x: config.x - 15, y: config.y - 10 });
};

export default QuackerTroop;
