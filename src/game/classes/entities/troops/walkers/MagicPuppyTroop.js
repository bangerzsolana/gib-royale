import Troop from "../TroopBase.js";
import Components from "../../components/index.js";
const MIXINS = [Components.CanWalk];

class MagicPuppyTroop extends Troop {
  constructor(config) {
    super(MIXINS, config);
    this.setMovementSpeed(17);
    this.setOverallHealth(50);
    this.setAttentionRange(120);
    this.setEffectRange(100);
    this.setEffectRate(1000);
    this.setDamageAmount(10);
    this.setMaxVelocity(this.movementSpeed);
  }
}

const STATIC = MagicPuppyTroop;
STATIC.NAME = "MagicPuppyTroop";
STATIC.COST = 4;
STATIC.doSpawn = function(config) { new MagicPuppyTroop(config); };

export default MagicPuppyTroop;
