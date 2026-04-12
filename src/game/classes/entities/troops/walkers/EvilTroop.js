import Troop from "../TroopBase.js";
import Components from "../../components/index.js";
const MIXINS = [Components.CanWalk];

class EvilTroop extends Troop {
  constructor(config) {
    super(MIXINS, { ...config, animKeyPrefix: STATIC.ANIM_KEY_PREFIX });
    this.setMovementSpeed(10);
    this.setOverallHealth(200);
    this.setAttentionRange(50);
    this.setEffectRange(20);
    this.setEffectRate(1500);
    this.setDamageAmount(20);
    this.setCost(3);
    this.setMaxVelocity(this.movementSpeed);
  }
}

const STATIC = EvilTroop;
STATIC.ANIM_KEY_PREFIX = "troop--evil";
STATIC.NAME = "EvilTroop";
STATIC.IS_IN_DECK = true;
STATIC.COST = 5;
STATIC.doSpawn = function(config) { new EvilTroop(config); };

export default EvilTroop;
