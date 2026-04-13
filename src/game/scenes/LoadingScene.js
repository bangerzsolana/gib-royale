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
      circleGfx.fillCircle(28, 28, 28);
      circleGfx.generateTexture("circle-troop", 56, 56);
      circleGfx.destroy();

      // Generate rectangle texture for towers
      let towerGfx = this.make.graphics({ x: 0, y: 0, add: false });
      towerGfx.fillStyle(0xffffff, 1);
      towerGfx.fillRect(0, 0, 72, 88);
      towerGfx.generateTexture("rect-tower", 72, 88);
      towerGfx.destroy();

      // Generate waypoint texture
      let circle = this.make.graphics({ x: 0, y: 0, add: false });
      circle.fillStyle(0xffffff, 1);
      circle.fillCircle(20, 20, 20);
      circle.generateTexture("waypoint", 40, 40);
      circle.destroy();

      // Generate particle texture
      let particleRect = this.make.graphics({ x: 0, y: 0, add: false });
      particleRect.fillStyle(0xffffff, 1);
      particleRect.fillRect(0, 0, 12, 12);
      particleRect.generateTexture("particle-rect", 12, 12);
      particleRect.destroy();

      console.log("[LoadingScene] textures generated, starting TitleScene");
      this.scene.start("TitleScene");
    } catch (e) {
      console.error("[LoadingScene] error:", e);
    }
  }
}
