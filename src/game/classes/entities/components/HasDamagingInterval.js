class HasDamagingInterval {
  constructor() {
    var attributes = {
      damagingIntervalAmount: 1,
      damagingIntervalRate: 1000,
      damagingIntervalReference: null
    };

    Object.assign(this, attributes);
    Object.assign(this, this.constructor.methods);
  }
}

HasDamagingInterval.methods = {
  _init() {
    this.createDamagingInterval();
  },

  setDamagingIntervalAmount(damagingIntervalAmount) {
    this.damagingIntervalAmount = damagingIntervalAmount;
  },
  setDamagingIntervalRate(damagingIntervalRate) {
    this.damagingIntervalRate = damagingIntervalRate;
    this.createDamagingInterval();
  },

  createDamagingInterval() {
    if (this.damagingIntervalReference)
      clearInterval(this.damagingIntervalReference);
    this.damagingIntervalReference = setInterval(() => {
      this.deductHealth(this.damagingIntervalAmount);
    }, this.damagingIntervalRate);
  },

  _destroy() {
    clearInterval(this.damagingIntervalReference);
  }
};

export default HasDamagingInterval;
