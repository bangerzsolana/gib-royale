import Troop from "../TroopBase.js";
import Components from "../../components/index.js";
const MIXINS = [Components.CanWalk];

class BattleOtterTroop extends Troop {
  constructor(config) {
    super(MIXINS, { ...config, animKeyPrefix: STATIC.ANIM_KEY_PREFIX });
    this.setTint(0xffffff);
    this.setMovementSpeed(15);
    this.setOverallHealth(50);
    this.setAttentionRange(40);
    this.setEffectRange(30);
    this.setEffectRate(1000);
    this.setDamageAmount(20);
    this.setCost(3);
    this.setMaxVelocity(this.movementSpeed);
  }
}

const STATIC = BattleOtterTroop;
STATIC.ANIM_KEY_PREFIX = "troop--battle-otter";
STATIC.NAME = "BattleOtterTroop";
STATIC.IS_IN_DECK = true;
STATIC.COST = 3;
STATIC.doSpawn = function(config) { new BattleOtterTroop(config); };

export default BattleOtterTroop;
