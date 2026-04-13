import Troop from "../TroopBase.js";
import Components from "../../components/index.js";
const MIXINS = [Components.CanWalk];

class AlienTroop extends Troop {
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

const STATIC = AlienTroop;
STATIC.NAME = "AlienTroop";
STATIC.COST = 3;
STATIC.doSpawn = function(config) {
  new AlienTroop({ ...config, x: config.x, y: config.y });
  new AlienTroop({ ...config, x: config.x + 10, y: config.y + 10 });
  new AlienTroop({ ...config, x: config.x - 10, y: config.y - 10 });
  new AlienTroop({ ...config, x: config.x - 10, y: config.y + 10 });
  new AlienTroop({ ...config, x: config.x + 10, y: config.y - 10 });
};

export default AlienTroop;
