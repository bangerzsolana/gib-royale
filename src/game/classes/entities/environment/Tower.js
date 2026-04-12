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
    super(MIXINS, scene, x, y, "rect-tower", true, -6);
    this.owner = owner;

    this.owner.troops.add(this);
    this.body.setImmovable(true);

    // Color towers by team
    if (owner.troopVelocityDirection === -1) {
      this.setTint(0x4488cc); // Player: blue
    } else {
      this.setTint(0xcc4444); // Opponent: red
    }

    this.setOverallHealth(1000);

    this.setAttentionRange(80);
    this.setEffectRange(90);
    this.setEffectRate(1500);

    this.setDamageAmount(20);

    this.waypoints = [
      new Waypoint(scene, x - 30, y - 15, "tower"),
      new Waypoint(scene, x + 30, y - 15, "tower"),
      new Waypoint(scene, x - 30, y + 15, "tower"),
      new Waypoint(scene, x + 30, y + 15, "tower")
    ];

    // Add tower label
    this.towerLabel = scene.add
      .text(x, y + 2, "TOWER", {
        fontSize: "8px",
        fontFamily: "Arial, sans-serif",
        color: "#ffffff",
        fontStyle: "bold",
        stroke: "#000000",
        strokeThickness: 2
      })
      .setOrigin(0.5, 0.5)
      .setDepth(999996);
  }

  destroy() {
    for (let waypoint of this.waypoints) {
      waypoint.destroy();
    }
    if (this.towerLabel) this.towerLabel.destroy();
    this.isDestroyed = true;

    var scene = this.scene;
    setTimeout(function() {
      scene.events.emit("tower-destroyed");
    }, 1500);

    super.destroy();
  }
}
