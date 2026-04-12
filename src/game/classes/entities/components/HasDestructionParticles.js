class HasDestructionParticles {
  constructor() {
    var attributes = {};

    Object.assign(this, attributes);
    Object.assign(this, this.constructor.methods);
  }
}
HasDestructionParticles.particles = null;
HasDestructionParticles.methods = {
  _init() {
    if (!HasDestructionParticles.particles) {
      HasDestructionParticles.particles = this.scene.add.particles("npc", [
        {
          x: { min: -10, max: 10 },
          y: { min: -10, max: 10 },
          scale: 0.2,
          tint: 0xff7777,
          blendMode: "MIXX",
          lifespan: 1500,
          speedX: { min: -20, max: 20 },
          speedY: { min: -10, max: -50 },
          accelerationX: 0,
          accelerationY: 40,
          on: false,
          quantity: 4
        }
      ]);
    }
  },

  _destroy() {
    HasDestructionParticles.particles.emitParticleAt(this.x, this.y, 30);
  }
};

export default HasDestructionParticles;
