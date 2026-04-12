import { Scene } from "phaser";

class TitleScene extends Scene {
  constructor() {
    super("TitleScene");
  }

  create() {
    const centerX = this.cameras.main.centerX;
    const centerY = this.cameras.main.centerY;

    this.cameras.main.setBackgroundColor("#1a1a2e");

    this.add
      .text(centerX, centerY - 60, "Gib\nRoyale", {
        fontSize: "48px",
        fontFamily: "Arial, sans-serif",
        color: "#ffffff",
        fontStyle: "bold",
        align: "center"
      })
      .setOrigin(0.5, 0.5);

    this.add
      .text(centerX, centerY + 20, "Tap to play", {
        fontSize: "16px",
        fontFamily: "Arial, sans-serif",
        color: "#aaaacc"
      })
      .setOrigin(0.5, 0.5);

    // Cards gallery button
    const cardsBtn = this.add
      .text(centerX, centerY + 70, "[ CARD GALLERY ]", {
        fontSize: "14px",
        fontFamily: "Arial, sans-serif",
        color: "#ffcc00",
        fontStyle: "bold"
      })
      .setOrigin(0.5, 0.5)
      .setInteractive({ useHandCursor: true });

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
