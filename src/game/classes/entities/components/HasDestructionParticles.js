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
          x: { min: -15, max: 15 },
          y: { min: -15, max: 15 },
          scale: 0.5,
          tint: 0xff7777,
          blendMode: "ADD",
          lifespan: 1500,
          speedX: { min: -30, max: 30 },
          speedY: { min: -15, max: -60 },
          accelerationX: 0,
          accelerationY: 50,
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
