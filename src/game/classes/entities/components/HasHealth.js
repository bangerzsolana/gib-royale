class HasHealth {
  constructor() {
    var attributes = {
      currentHealth: 100,
      overallHealth: 100,
      healthDisplay: null
    };

    Object.assign(this, attributes);
    Object.assign(this, this.constructor.methods);
  }
}

HasHealth.methods = {
  setCurrentHealth(health) {
    this.currentHealth = health;
    this.updateHealthDisplay();
  },

  setOverallHealth(health) {
    this.currentHealth = health;
    this.overallHealth = health;
    this.updateHealthDisplay();
  },

  deductHealth(amount) {
    this.currentHealth -= amount;
    this.updateHealthDisplay();
    this.checkIfDead();
  },

  initHealthBar() {
    this.healthDisplay = this.scene.add
      .text(this.x, this.y, this.currentHealth, {
        fontSize: "10px",
        fontFamily: "Arial, sans-serif",
        color: "#ffffff",
        fontStyle: "bold",
        stroke: "#000000",
        strokeThickness: 2
      })
      .setOrigin(0.5, 0.5)
      .setDepth(999999);
  },

  updateHealthDisplay() {
    if (this.healthDisplay) this.healthDisplay.setText(this.currentHealth);
  },

  checkIfDead() {
    if (this.currentHealth <= 0) this.destroy();
  },

  _init() {
    this.initHealthBar();
  },

  _preUpdate() {
    if (this.healthDisplay)
      this.healthDisplay.setPosition(this.x, this.y - this.height / 2 - 12);
  },

  _destroy() {
    if (this.healthDisplay) this.healthDisplay.destroy();
  }
};

export default HasHealth;
