import { Scene } from "phaser";

class LoseScene extends Scene {
  constructor() {
    super("LoseScene");
  }

  create() {
    this.cameras.main.setBackgroundColor("#3a1a1a");
    const centerX = this.cameras.main.centerX;
    const centerY = this.cameras.main.centerY;

    this.add
      .text(centerX, centerY - 80, "You Lose", {
        fontSize: "72px",
        fontFamily: "Arial, sans-serif",
        fontStyle: "bold",
        color: "#ff4444"
      })
      .setOrigin(0.5, 0.5);

    this.add
      .text(centerX, centerY + 40, "Tap to try again", {
        fontSize: "32px",
        fontFamily: "Arial, sans-serif",
        color: "#ccaaaa"
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

export default LoseScene;
