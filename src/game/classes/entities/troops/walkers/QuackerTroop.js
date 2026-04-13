import Troop from "../TroopBase.js";
import Components from "../../components/index.js";
const MIXINS = [Components.CanFly];

class QuackerTroop extends Troop {
  constructor(config) {
    super(MIXINS, { ...config, animKeyPrefix: STATIC.ANIM_KEY_PREFIX });
    this.setMovementSpeed(10);
    this.setOverallHealth(50);
    this.setAttentionRange(40);
    this.setEffectRange(40);
    this.setEffectRate(200);
    this.setDamageAmount(5);
    this.setCost(4);
    this.setMaxVelocity(this.movementSpeed);
  }
}

const STATIC = QuackerTroop;
STATIC.ANIM_KEY_PREFIX = "troop--quacker";
STATIC.NAME = "QuackerTroop";
STATIC.IS_IN_DECK = true;
STATIC.COST = 3;
STATIC.doSpawn = function(config) {
  new QuackerTroop({ ...config, x: config.x, y: config.y });
  new QuackerTroop({ ...config, y: config.y + 10 });
  new QuackerTroop({ ...config, y: config.y - 10 });
};

export default QuackerTroop;
