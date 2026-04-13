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
      HasDestructionParticles.particles = this.scene.add.particles("particle-rect", [
        {
          x: { min: -30, max: 30 },
          y: { min: -30, max: 30 },
          scale: 0.5,
          tint: 0xff7777,
          blendMode: "ADD",
          lifespan: 1500,
          speedX: { min: -60, max: 60 },
          speedY: { min: -30, max: -120 },
          accelerationX: 0,
          accelerationY: 100,
          on: false,
          quantity: 6
        }
      ]);
    }
  },

  _destroy() {
    HasDestructionParticles.particles.emitParticleAt(this.x, this.y, 30);
  }
};

export default HasDestructionParticles;
