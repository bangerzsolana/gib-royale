import Troop from "../TroopBase.js";
import MagicPuppyTroop from "./MagicPuppyTroop.js";
import Components from "../../components/index.js";
const MIXINS = [Components.CanWalk, Components.CanSpawn];

class WitchTroop extends Troop {
  constructor(config) {
    super(MIXINS, config);
    this.setMovementSpeed(10);
    this.setOverallHealth(50);
    this.setAttentionRange(80);
    this.setEffectRange(80);
    this.setEffectRate(2000);
    this.setDamageAmount(100);
    this.setSpawnRate(3000);
    this.setSpawnDelay(2000);
    this.setSpawnFunc(() => {
      new MagicPuppyTroop({
        scene: this.scene, owner: this.owner,
        x: this.x, y: this.y + 10 * this.velocityDirection,
        velocityDirection: this.velocityDirection
      });
    });
    this.setMaxVelocity(this.movementSpeed);
  }
}

const STATIC = WitchTroop;
STATIC.NAME = "WitchTroop";
STATIC.COST = 4;
STATIC.doSpawn = function(config) { new WitchTroop(config); };

export default WitchTroop;
