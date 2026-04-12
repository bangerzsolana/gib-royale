import { Scene } from "phaser";

class WinScene extends Scene {
  constructor() {
    super("WinScene");
  }

  create() {
    this.cameras.main.setBackgroundColor("#1a3a1a");
    const centerX = this.cameras.main.centerX;
    const centerY = this.cameras.main.centerY;

    this.add
      .text(centerX, centerY - 40, "You Win!", {
        fontSize: "36px",
        fontFamily: "Arial, sans-serif",
        fontStyle: "bold",
        color: "#44ff44"
      })
      .setOrigin(0.5, 0.5);

    this.add
      .text(centerX, centerY + 20, "Tap to play again", {
        fontSize: "16px",
        fontFamily: "Arial, sans-serif",
        color: "#aaccaa"
      })
      .setOrigin(0.5, 0.5);

    this.input.on("pointerdown", () => {
      this.nextScene();
    });
  }

  nextScene() {
    this.scene.start("TitleScene");
  }
}

export default WinScene;
