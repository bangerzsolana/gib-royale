import Troop from "../TroopBase.js";
import Components from "../../components/index.js";
import CARD_TYPES from "../../../../data/CardTypeConfig.js";
const MIXINS = [Components.CanWalk];
const TYPE = CARD_TYPES.Swarm;

class AlienTroop extends Troop {
  constructor(config) {
    super(MIXINS, config);
    this.cardType = 'Swarm';
    this.hpDivisor = TYPE.hpDivisor;
    this.setMovementSpeed(TYPE.speed);
    this.setAttentionRange(TYPE.attentionRange);
    this.setEffectRange(TYPE.effectRange);
    this.setEffectRate(TYPE.effectRate);
    this.setMaxVelocity(this.movementSpeed);
  }
}

const STATIC = AlienTroop;
STATIC.NAME = "AlienTroop";
STATIC.COST = TYPE.cost;
STATIC.doSpawn = function(config) {
  new AlienTroop({ ...config, x: config.x, y: config.y });
  new AlienTroop({ ...config, x: config.x + 12, y: config.y + 12 });
  new AlienTroop({ ...config, x: config.x - 12, y: config.y - 12 });
  new AlienTroop({ ...config, x: config.x - 12, y: config.y + 12 });
  new AlienTroop({ ...config, x: config.x + 12, y: config.y - 12 });
};

export default AlienTroop;
