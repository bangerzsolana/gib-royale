import { Scene } from "phaser";
import { priceService } from "../services/PriceService.js";

export default class LoadingScene extends Scene {
  constructor() {
    super("LoadingScene");
  }

  async create() {
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

      console.log("[LoadingScene] textures generated, loading market caps from Railway DB...");

      // Pre-load market caps from Railway DB BEFORE gameplay starts.
      // This ensures HP (derived from market cap) is always available at troop spawn.
      // Railway DB updates every 5 min — this is live data, not static.
      await priceService.fetchAllMarketCaps();

      console.log("[LoadingScene] market caps loaded, starting TitleScene");
      this.scene.start("TitleScene");
    } catch (e) {
      console.error("[LoadingScene] error:", e);
      // Still start the game even if market cap fetch fails
      this.scene.start("TitleScene");
    }
  }
}
