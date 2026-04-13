import Troop from "../TroopBase.js";
import Components from "../../components/index.js";
const MIXINS = [Components.CanWalk];

class ClownGuyTroop extends Troop {
  constructor(config) {
    super(MIXINS, config);
    this.setMovementSpeed(17);
    this.setOverallHealth(10);
    this.setAttentionRange(60);
    this.setEffectRange(40);
    this.setEffectRate(1000);
    this.setDamageAmount(10);
    this.setMaxVelocity(this.movementSpeed);
  }
}

const STATIC = ClownGuyTroop;
STATIC.NAME = "ClownGuyTroop";
STATIC.COST = 1;
STATIC.doSpawn = function(config) { new ClownGuyTroop(config); };

export default ClownGuyTroop;
