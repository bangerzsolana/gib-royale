import Troop from "../TroopBase.js";
import Components from "../../components/index.js";
const MIXINS = [Components.CanWalk];

class BabyCowTroop extends Troop {
  constructor(config) {
    super(MIXINS, config);
    this.setMovementSpeed(20);
    this.setOverallHealth(10);
    this.setAttentionRange(40);
    this.setEffectRange(40);
    this.setEffectRate(200);
    this.setDamageAmount(5);
    this.setMaxVelocity(this.movementSpeed);
  }
}

const STATIC = BabyCowTroop;
STATIC.NAME = "BabyCowTroop";
STATIC.COST = 1;
STATIC.doSpawn = function(config) { new BabyCowTroop(config); };

export default BabyCowTroop;
