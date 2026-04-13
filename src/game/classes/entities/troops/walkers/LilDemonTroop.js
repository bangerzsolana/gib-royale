import Troop from "../TroopBase.js";
import Components from "../../components/index.js";
const MIXINS = [Components.CanWalk];

class LilDemonTroop extends Troop {
  constructor(config) {
    super(MIXINS, config);
    this.setMovementSpeed(20);
    this.setOverallHealth(50);
    this.setAttentionRange(60);
    this.setEffectRange(40);
    this.setEffectRate(500);
    this.setDamageAmount(10);
    this.setMaxVelocity(this.movementSpeed);
  }
}

const STATIC = LilDemonTroop;
STATIC.NAME = "LilDemonTroop";
STATIC.COST = 2;
STATIC.doSpawn = function(config) {
  new LilDemonTroop({ ...config, x: config.x - 5 });
  new LilDemonTroop({ ...config, x: config.x + 5 });
};

export default LilDemonTroop;
