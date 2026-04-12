import Troop from "../TroopBase.js";
import DinoTroop from "./DinoTroop.js";
import Components from "../../components/index.js";
const MIXINS = [Components.CanSpawn, Components.IsImmovable, Components.HasDamagingInterval];

class VolcanoTroop extends Troop {
  constructor(config) {
    super(MIXINS, { ...config, animKeyPrefix: STATIC.ANIM_KEY_PREFIX });
    this.setTint(0xffffff);
    this.setOverallHealth(50);
    this.setAttentionRange(0);
    this.setEffectRange(0);
    this.setEffectRate(0);
    this.setDamageAmount(100);
    this.setCost(4);
    this.setSpawnRate(3000);
    this.setSpawnDelay(2000);
    this.setSpawnFunc(() => {
      new DinoTroop({
        scene: this.scene, owner: this.owner,
        x: this.x, y: this.y + 10 * this.velocityDirection,
        velocityDirection: this.velocityDirection
      });
    });
    this.setMaxVelocity(this.movementSpeed);
  }
}

const STATIC = VolcanoTroop;
STATIC.ANIM_KEY_PREFIX = "troop--volcano";
STATIC.NAME = "VolcanoTroop";
STATIC.IS_IN_DECK = true;
STATIC.COST = 4;
STATIC.doSpawn = function(config) { new VolcanoTroop(config); };

export default VolcanoTroop;
