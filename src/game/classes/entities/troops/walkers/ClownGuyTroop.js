import Troop from "../TroopBase.js";
import Components from "../../components/index.js";
const MIXINS = [Components.CanWalk];

class ClownGuyTroop extends Troop {
  constructor(config) {
    super(MIXINS, { ...config, animKeyPrefix: STATIC.ANIM_KEY_PREFIX });
    this.setMovementSpeed(17);
    this.setOverallHealth(10);
    this.setAttentionRange(30);
    this.setEffectRange(20);
    this.setEffectRate(1000);
    this.setDamageAmount(10);
    this.setCost(1);
    this.setMaxVelocity(this.movementSpeed);
  }
}

const STATIC = ClownGuyTroop;
STATIC.ANIM_KEY_PREFIX = "troop--clown-guy";
STATIC.NAME = "ClownGuyTroop";
STATIC.IS_IN_DECK = true;
STATIC.COST = 1;
STATIC.doSpawn = function(config) { new ClownGuyTroop(config); };

export default ClownGuyTroop;
