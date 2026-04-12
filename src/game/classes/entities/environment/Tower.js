import EnvironmentObject from "./EnvironmentObject.js";
import Components from "../components/index.js";
import Waypoint from "../waypoints/Waypoint.js";

const MIXINS = [
  Components.HasHealth,
  Components.HasShadow,
  Components.HasDestructionParticles,
  Components.HasDestructionScreenShake,
  Components.HasEffects,
  Components.HasDamageEffect
];

export default class Tower extends EnvironmentObject {
  constructor(scene, owner, x, y) {
    super(MIXINS, scene, x, y, "tower", true, -6);
    this.owner = owner;

    this.owner.troops.add(this);
    this.body.setImmovable(true);

    this.setTint(0x885500);

    this.setOverallHealth(1000);

    this.setAttentionRange(50);
    this.setEffectRange(60);
    this.setEffectRate(1500);

    this.setDamageAmount(20);

    this.waypoints = [
      new Waypoint(scene, x - 22, y - 10, "tower"),
      new Waypoint(scene, x + 22, y - 10, "tower"),
      new Waypoint(scene, x - 22, y + 10, "tower"),
      new Waypoint(scene, x + 22, y + 10, "tower")
    ];
  }

  destroy() {
    for (let waypoint of this.waypoints) {
      waypoint.destroy();
    }
    this.isDestroyed = true;

    var scene = this.scene;
    setTimeout(function() {
      scene.events.emit("tower-destroyed");
    }, 1500);

    super.destroy();
  }
}
