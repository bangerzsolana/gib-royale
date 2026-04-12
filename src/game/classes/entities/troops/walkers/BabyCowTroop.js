import Troop from "../TroopBase.js";
import Components from "../../components/index.js";
const MIXINS = [Components.CanWalk];

class BabyCowTroop extends Troop {
  constructor(config) {
    super(MIXINS, { ...config, animKeyPrefix: STATIC.ANIM_KEY_PREFIX });
    this.setMovementSpeed(20);
    this.setOverallHealth(10);
    this.setAttentionRange(20);
    this.setEffectRange(20);
    this.setEffectRate(200);
    this.setDamageAmount(5);
    this.setCost(1);
    this.setMaxVelocity(this.movementSpeed);
  }
}

const STATIC = BabyCowTroop;
STATIC.ANIM_KEY_PREFIX = "troop--baby-cow";
STATIC.NAME = "BabyCowTroop";
STATIC.IS_IN_DECK = false;
STATIC.COST = 1;
STATIC.doSpawn = function(config) { new BabyCowTroop(config); };

export default BabyCowTroop;
