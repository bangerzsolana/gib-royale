import Troop from "../TroopBase.js";
import Components from "../../components/index.js";
const MIXINS = [Components.CanWalk];

class TankTroop extends Troop {
  constructor(config) {
    super(MIXINS, config);
    this.setMovementSpeed(5);
    this.setOverallHealth(200);
    this.setAttentionRange(100);
    this.setEffectRange(100);
    this.setEffectRate(3000);
    this.setDamageAmount(200);
    this.setMaxVelocity(this.movementSpeed);
  }
}

const STATIC = TankTroop;
STATIC.NAME = "TankTroop";
STATIC.COST = 6;
STATIC.doSpawn = function(config) { new TankTroop(config); };

export default TankTroop;
