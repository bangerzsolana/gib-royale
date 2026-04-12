import Troop from "../TroopBase.js";
import Components from "../../components/index.js";
const MIXINS = [Components.CanWalk];

class DinoTroop extends Troop {
  constructor(config) {
    super(MIXINS, { ...config, animKeyPrefix: STATIC.ANIM_KEY_PREFIX });
    this.setTint(0xffffff);
    this.setMovementSpeed(20);
    this.setOverallHealth(30);
    this.setAttentionRange(20);
    this.setEffectRange(20);
    this.setEffectRate(500);
    this.setDamageAmount(10);
    this.setCost(1);
    this.setMaxVelocity(this.movementSpeed);
  }
}

const STATIC = DinoTroop;
STATIC.ANIM_KEY_PREFIX = "troop--dino";
STATIC.NAME = "DinoTroop";
STATIC.IS_IN_DECK = false;
STATIC.COST = 1;
STATIC.doSpawn = function(config) { new DinoTroop(config); };

export default DinoTroop;
