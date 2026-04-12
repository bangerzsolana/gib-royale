import Troop from "../TroopBase.js";
import Components from "../../components/index.js";
const MIXINS = [Components.CanWalk];

class MagicPuppyTroop extends Troop {
  constructor(config) {
    super(MIXINS, { ...config, animKeyPrefix: STATIC.ANIM_KEY_PREFIX });
    this.setMovementSpeed(17);
    this.setOverallHealth(50);
    this.setAttentionRange(60);
    this.setEffectRange(50);
    this.setEffectRate(1000);
    this.setDamageAmount(10);
    this.setCost(4);
    this.setMaxVelocity(this.movementSpeed);
  }
}

const STATIC = MagicPuppyTroop;
STATIC.ANIM_KEY_PREFIX = "troop--magic-puppy";
STATIC.NAME = "MagicPuppyTroop";
STATIC.IS_IN_DECK = false;
STATIC.COST = 4;
STATIC.doSpawn = function(config) { new MagicPuppyTroop(config); };

export default MagicPuppyTroop;
