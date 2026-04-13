import Troop from "../TroopBase.js";
import Components from "../../components/index.js";
const MIXINS = [Components.CanWalk];

class EvilTroop extends Troop {
  constructor(config) {
    super(MIXINS, config);
    this.setMovementSpeed(10);
    this.setOverallHealth(200);
    this.setAttentionRange(100);
    this.setEffectRange(40);
    this.setEffectRate(1500);
    this.setDamageAmount(20);
    this.setMaxVelocity(this.movementSpeed);
  }
}

const STATIC = EvilTroop;
STATIC.NAME = "EvilTroop";
STATIC.COST = 5;
STATIC.doSpawn = function(config) { new EvilTroop(config); };

export default EvilTroop;
