import Troop from "../TroopBase.js";
import DinoTroop from "./DinoTroop.js";
import Components from "../../components/index.js";
import CARD_TYPES from "../../../../data/CardTypeConfig.js";
const MIXINS = [Components.CanSpawn, Components.IsImmovable];
const TYPE = CARD_TYPES.Spawner;

class VolcanoTroop extends Troop {
  constructor(config) {
    super(MIXINS, config);
    this.cardType = 'Spawner';
    this.hpDivisor = TYPE.hpDivisor;
    this.setAttentionRange(TYPE.attentionRange);
    this.setEffectRange(TYPE.effectRange);
    this.setEffectRate(TYPE.effectRate);
    this.setSpawnRate(TYPE.spawnRate);
    this.setSpawnDelay(TYPE.spawnDelay);

    // Spawner children inherit parent's coin (same market data, same price tracking)
    this.setSpawnFunc(() => {
      new DinoTroop({
        scene: this.scene,
        owner: this.owner,
        x: this.x,
        y: this.y + 10 * this.velocityDirection,
        velocityDirection: this.velocityDirection,
        tokenId: this.tokenId,
        spawnPrice: this.deployPrice,
        isSpawnerChild: true,
      });
    });
    this.setMaxVelocity(0);
  }
}

const STATIC = VolcanoTroop;
STATIC.NAME = "VolcanoTroop";
STATIC.COST = TYPE.cost;
STATIC.doSpawn = function(config) { new VolcanoTroop(config); };

export default VolcanoTroop;
