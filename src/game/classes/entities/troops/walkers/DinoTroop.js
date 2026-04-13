import Troop from "../TroopBase.js";
import Components from "../../components/index.js";
const MIXINS = [Components.CanWalk];

class DinoTroop extends Troop {
  constructor(config) {
    super(MIXINS, config);
    this.setMovementSpeed(20);
    this.setOverallHealth(30);
    this.setAttentionRange(40);
    this.setEffectRange(40);
    this.setEffectRate(500);
    this.setDamageAmount(10);
    this.setMaxVelocity(this.movementSpeed);
  }
}

const STATIC = DinoTroop;
STATIC.NAME = "DinoTroop";
STATIC.COST = 1;
STATIC.doSpawn = function(config) { new DinoTroop(config); };

export default DinoTroop;
