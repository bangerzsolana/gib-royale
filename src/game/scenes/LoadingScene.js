import { Scene } from "phaser";

export default class LoadingScene extends Scene {
  constructor() {
    super("LoadingScene");
  }

  nextScene() {
    this.scene.start("TitleScene");
  }

  preload() {
    // Generate circle texture for troops (white circle, tinted per-coin)
    let circleGfx = this.add.graphics();
    circleGfx.fillStyle(0xffffff, 1);
    circleGfx.fillCircle(14, 14, 14);
    circleGfx.generateTexture("circle-troop", 28, 28);
    circleGfx.destroy();

    // Generate rectangle texture for towers
    let towerGfx = this.add.graphics();
    towerGfx.fillStyle(0xffffff, 1);
    towerGfx.fillRect(0, 0, 36, 44);
    towerGfx.generateTexture("rect-tower", 36, 44);
    towerGfx.destroy();

    // Generate waypoint texture
    let circle = this.add.graphics();
    circle.fillStyle(0xffffff, 1);
    circle.fillCircle(10, 10, 10);
    circle.generateTexture("waypoint");
    circle.destroy();

    // Generate particle texture
    let particleRect = this.add.graphics();
    particleRect.fillStyle(0xffffff, 1);
    particleRect.fillRect(0, 0, 6, 6);
    particleRect.generateTexture("particle-rect", 6, 6);
    particleRect.destroy();
  }

  create() {
    let centerX = this.cameras.main.centerX;
    let centerY = this.cameras.main.centerY;

    this.add
      .text(centerX, centerY - 24, "Loading...", {
        fontSize: "20px",
        fontFamily: "Arial, sans-serif",
        color: "#ffffff"
      })
      .setOrigin(0.5, 0.5);

    // Brief delay then proceed
    this.time.delayedCall(100, () => this.nextScene());
  }

  init() {
    let centerX = this.cameras.main.centerX;
    let centerY = this.cameras.main.centerY;
    let barWidth = this.cameras.main.width - 60;
    let barHeight = 16;

    var progressBox = this.add.rectangle(
      centerX,
      centerY,
      barWidth,
      barHeight,
      0x333333
    );
    var progressBar = this.add
      .rectangle(
        progressBox.x - parseInt(progressBox.width / 2),
        centerY,
        barWidth,
        barHeight,
        0x4488ff
      )
      .setOrigin(0, 0.5)
      .setScale(0, 1);

    this.load.on("progress", value => {
      progressBar.setScale(value, 1);
    });

    this.load.on("complete", () => {
      this.loadingProgressComplete = true;
    });
  }
}
