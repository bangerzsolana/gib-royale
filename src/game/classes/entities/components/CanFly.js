import Waypoint from "../waypoints/Waypoint.js";

class CanFly {
  constructor() {
    var attributes = {
      canMove: true,
      movementSpeed: 200,
      velocityDirection: 1,
      currentWaypoint: null
    };

    Object.assign(this, attributes);
    Object.assign(this, this.constructor.methods);
  }
}

CanFly.methods = {
  _init() {
    this.owner.troops.add(this);
    this.owner.flyingTroops.add(this);
    this.getNextWaypoint();
  },

  setMovementSpeed(movementSpeed) {
    this.movementSpeed = movementSpeed;
  },

  setVelocityDirection(velocityDirection) {
    this.velocityDirection = velocityDirection;
  },

  setCurrentWaypoint(currentWaypoint) {
    this.currentWaypoint = currentWaypoint;
  },

  getNextWaypoint() {
    try {
      let nextWaypoint = Waypoint.getNext(
        this.x,
        this.y,
        this.velocityDirection,
        "tower"
      );

      if (nextWaypoint) {
        this.scene.physics.moveTo(
          this,
          nextWaypoint.x,
          nextWaypoint.y,
          this.movementSpeed
        );

        if (this.waypointOverlap)
          this.scene.physics.world.removeCollider(this.waypointOverlap);
        this.waypointOverlap = this.scene.physics.add.overlap(
          this,
          nextWaypoint,
          () => {
            this.getNextWaypoint();
          }
        );
      }
      this.currentWaypoint = nextWaypoint;
    } catch (e) {
      console.error(e);
    }
  },

  _preUpdate() {
    if (!this.effectTarget || this.effectTarget.isDestroyed) {
      this.enemyTroop = null;
      if (!this.currentWaypoint || this.currentWaypoint.isDestroyed) {
        this.getNextWaypoint();
      } else if (this.currentWaypoint) {
        this.scene.physics.moveTo(
          this,
          this.currentWaypoint.x,
          this.currentWaypoint.y,
          this.movementSpeed
        );
      }
    }

    this.setDepth(this.y + 500);
  }
};

export default CanFly;
