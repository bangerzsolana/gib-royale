import Troop from "../TroopBase.js";
import Components from "../../components/index.js";
const MIXINS = [Components.CanWalk];

class ChickphinTroop extends Troop {
  constructor(config) {
    super(MIXINS, config);
    this.setMovementSpeed(8);
    this.setOverallHealth(200);
    this.setAttentionRange(80);
    this.setEffectRange(40);
    this.setEffectRate(1500);
    this.setDamageAmount(50);
    this.setMaxVelocity(this.movementSpeed);
  }
}

const STATIC = ChickphinTroop;
STATIC.NAME = "ChickphinTroop";
STATIC.COST = 6;
STATIC.doSpawn = function(config) { new ChickphinTroop(config); };

export default ChickphinTroop;
