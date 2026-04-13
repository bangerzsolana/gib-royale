import Phaser from "phaser";

class Waypoint extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, label = "default") {
    super(scene, x, y, "waypoint");

    this.isDestroyed = false;
    this.label = label;

    scene.add
      .existing(this)
      .setOrigin(0.5, 0.5)
      .setDepth(10000)
      .setAlpha(0);

    scene.physics.add.existing(this);
    this.setImmovable(true);

    this.body.setSize(20, 20);

    STATIC.pointers.push(this);
  }

  destroy() {
    this.isDestroyed = true;
    let waypointIndex = Waypoint.pointers.indexOf(this);
    Waypoint.pointers.splice(waypointIndex, 1);

    super.destroy();
  }
}

const STATIC = Waypoint;

const DISTANCE_THRESHOLD = 40;
STATIC.getNext = function(x, y, velocityDirection, label) {
  const waypoints = Waypoint.pointers;
  let nearestDistance = 999999999;
  let nearestWaypoint = null;
  for (let i = 0; i < waypoints.length; i++) {
    let thisWaypoint = waypoints[i];

    if (label && label !== thisWaypoint.label) continue;

    let distance = Phaser.Math.Distance.Between(
      x,
      y,
      thisWaypoint.x,
      thisWaypoint.y
    );

    if (distance < DISTANCE_THRESHOLD) continue;

    if (
      (y + velocityDirection * 20 - thisWaypoint.y > 10 &&
        velocityDirection > 0) ||
      (y + velocityDirection * 20 - thisWaypoint.y < 10 && velocityDirection < 0)
    )
      continue;

    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearestWaypoint = thisWaypoint;
    }
  }

  return nearestWaypoint;
};
STATIC.pointers = [];

export default Waypoint;
