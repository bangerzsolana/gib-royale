import { Scene } from "phaser";

class TitleScene extends Scene {
  constructor() {
    super("TitleScene");
  }

  create() {
    const centerX = this.cameras.main.centerX;
    const centerY = this.cameras.main.centerY;

    this.add
      .bitmapText(
        centerX,
        centerY - 25,
        "teeny-tiny-pixls",
        "Gib\nRoyale",
        15
      )
      .setOrigin(0.5, 0.5);

    this.add
      .bitmapText(
        centerX,
        centerY + 12,
        "teeny-tiny-pixls",
        "Click or touch to begin!",
        5
      )
      .setOrigin(0.5, 0.5);

    // Cards gallery button
    const cardsBtn = this.add
      .bitmapText(
        centerX,
        centerY + 35,
        "teeny-tiny-pixls",
        "[ CARDS ]",
        5
      )
      .setOrigin(0.5, 0.5)
      .setTint(0xffcc00)
      .setInteractive();

    let cardsBtnClicked = false;
    cardsBtn.on("pointerdown", () => {
      cardsBtnClicked = true;
      this.scene.start("CardGalleryScene");
    });

    this.input.on("pointerdown", () => {
      if (!cardsBtnClicked) {
        this.nextScene();
      }
    });
  }

  nextScene() {
    this.scene.start("PlayScene");
  }
}

export default TitleScene;
