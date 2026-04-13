import Troop from "../TroopBase.js";
import Components from "../../components/index.js";
const MIXINS = [Components.CanWalk];

class ZDogTroop extends Troop {
  constructor(config) {
    super(MIXINS, config);
    this.setMovementSpeed(10);
    this.setOverallHealth(40);
    this.setAttentionRange(60);
    this.setEffectRange(40);
    this.setEffectRate(1500);
    this.setDamageAmount(20);
    this.setMaxVelocity(this.movementSpeed);
  }
}

const STATIC = ZDogTroop;
STATIC.NAME = "ZDogTroop";
STATIC.COST = 3;
STATIC.doSpawn = function(config) {
  new ZDogTroop({ ...config });
  new ZDogTroop({ ...config, x: config.x + 10, y: config.y + 10 });
  new ZDogTroop({ ...config, x: config.x - 10, y: config.y - 10 });
  new ZDogTroop({ ...config, x: config.x - 10, y: config.y + 10 });
  new ZDogTroop({ ...config, x: config.x + 10, y: config.y - 10 });
};

export default ZDogTroop;
