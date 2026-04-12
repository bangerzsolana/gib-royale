import Troop from "../TroopBase.js";
import Components from "../../components/index.js";
const MIXINS = [Components.CanWalk];

class LilDemonTroop extends Troop {
  constructor(config) {
    super(MIXINS, { ...config, animKeyPrefix: STATIC.ANIM_KEY_PREFIX });
    this.setTint(0xffffff);
    this.setMovementSpeed(20);
    this.setOverallHealth(50);
    this.setAttentionRange(30);
    this.setEffectRange(20);
    this.setEffectRate(500);
    this.setDamageAmount(10);
    this.setCost(2);
    this.setMaxVelocity(this.movementSpeed);
  }
}

const STATIC = LilDemonTroop;
STATIC.ANIM_KEY_PREFIX = "troop--lil-demon";
STATIC.NAME = "LilDemonTroop";
STATIC.IS_IN_DECK = true;
STATIC.COST = 2;
STATIC.doSpawn = function(config) {
  new LilDemonTroop({ ...config, x: config.x - 5 });
  new LilDemonTroop({ ...config, x: config.x + 5 });
};

export default LilDemonTroop;
