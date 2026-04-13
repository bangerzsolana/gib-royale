import Troop from "../TroopBase.js";
import Components from "../../components/index.js";
const MIXINS = [Components.CanWalk];

class BattleOtterTroop extends Troop {
  constructor(config) {
    super(MIXINS, config);
    this.setMovementSpeed(15);
    this.setOverallHealth(50);
    this.setAttentionRange(80);
    this.setEffectRange(60);
    this.setEffectRate(1000);
    this.setDamageAmount(20);
    this.setMaxVelocity(this.movementSpeed);
  }
}

const STATIC = BattleOtterTroop;
STATIC.NAME = "BattleOtterTroop";
STATIC.COST = 3;
STATIC.doSpawn = function(config) { new BattleOtterTroop(config); };

export default BattleOtterTroop;
