import Troop from "../TroopBase.js";
import Components from "../../components/index.js";
const MIXINS = [Components.CanWalk];

class ChickphinTroop extends Troop {
  constructor(config) {
    super(MIXINS, { ...config, animKeyPrefix: STATIC.ANIM_KEY_PREFIX });
    this.setMovementSpeed(8);
    this.setOverallHealth(200);
    this.setAttentionRange(40);
    this.setEffectRange(20);
    this.setEffectRate(1500);
    this.setDamageAmount(50);
    this.setCost(3);
    this.setMaxVelocity(this.movementSpeed);
  }
}

const STATIC = ChickphinTroop;
STATIC.ANIM_KEY_PREFIX = "troop--chickphin";
STATIC.NAME = "ChickphinTroop";
STATIC.IS_IN_DECK = true;
STATIC.COST = 6;
STATIC.doSpawn = function(config) { new ChickphinTroop(config); };

export default ChickphinTroop;
