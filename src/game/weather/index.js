import DropSplash from "./particles/dropSplash.js";
import { Geom } from "phaser";

class WeatherSystem {
  constructor(scene) {
    this.particles = scene.add.particles("rainSplash");
    let screenRect = new Geom.Rectangle(
      0,
      0,
      scene.cameras.main.width + 128,
      scene.cameras.main.height + 128
    );
    this.splashEmitter = this.particles.createEmitter({
      x: 0,
      y: 0,
      speed: 0,
      lifespan: 600,
      quantity: 5,
      frequency: 10,
      alpha: { start: 0.2, end: 0.0 },
      scaleX: { start: 1.5, end: 2.5 },
      scaleY: { start: 0.8, end: 1.1 },
      on: true,
      emitZone: { type: "random", source: screenRect },
      particleClass: DropSplash,
      blendMode: "ADD"
    });
  }

  getBackground() {
    return this.particles;
  }

  getForeground() {
    return null;
  }

  getClouds() {
    return null;
  }

  setPosition(x, y) {
    this.splashEmitter.setPosition(x, y);
  }
}

export default WeatherSystem;
