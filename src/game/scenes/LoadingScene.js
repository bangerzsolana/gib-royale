import { Scene } from "phaser";

export default class LoadingScene extends Scene {
  constructor() {
    super("LoadingScene");
  }

  create() {
    try {
      console.log("[LoadingScene] create() start");

      // Generate circle texture for troops (white circle, tinted per-coin)
      let circleGfx = this.make.graphics({ x: 0, y: 0, add: false });
      circleGfx.fillStyle(0xffffff, 1);
      circleGfx.fillCircle(14, 14, 14);
      circleGfx.generateTexture("circle-troop", 28, 28);
      circleGfx.destroy();

      // Generate rectangle texture for towers
      let towerGfx = this.make.graphics({ x: 0, y: 0, add: false });
      towerGfx.fillStyle(0xffffff, 1);
      towerGfx.fillRect(0, 0, 36, 44);
      towerGfx.generateTexture("rect-tower", 36, 44);
      towerGfx.destroy();

      // Generate waypoint texture
      let circle = this.make.graphics({ x: 0, y: 0, add: false });
      circle.fillStyle(0xffffff, 1);
      circle.fillCircle(10, 10, 10);
      circle.generateTexture("waypoint", 20, 20);
      circle.destroy();

      // Generate particle texture
      let particleRect = this.make.graphics({ x: 0, y: 0, add: false });
      particleRect.fillStyle(0xffffff, 1);
      particleRect.fillRect(0, 0, 6, 6);
      particleRect.generateTexture("particle-rect", 6, 6);
      particleRect.destroy();

      console.log("[LoadingScene] textures generated, starting TitleScene");
      this.scene.start("TitleScene");
    } catch (e) {
      console.error("[LoadingScene] error:", e);
    }
  }
}
