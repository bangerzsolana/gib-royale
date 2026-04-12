import Phaser from "phaser";

export default class DialogBox extends Phaser.GameObjects.Container {
  constructor(scene, text) {
    const gameWidth = scene.game.config.width;
    const gameHeight = scene.game.config.height;
    super(scene, 0, parseInt(gameHeight / 2 + gameHeight / 4, 0));
    this.scene = scene;

    scene.add.existing(this).setScrollFactor(0);

    this.backgroundBox = scene.add
      .rectangle(
        gameWidth / 2,
        0,
        gameWidth - 8,
        gameHeight / 4 - 4,
        0x000000,
        0.6
      )
      .setOrigin(0.5, 0);

    this.text = scene.add
      .text(gameWidth / 2, 8, text, {
        fontSize: "13px",
        fontFamily: "Arial, sans-serif",
        color: "#ffffff",
        wordWrap: { width: gameWidth - 40 },
        align: "center"
      })
      .setOrigin(0.5, 0);

    this.add(this.backgroundBox);
    this.add(this.text);

    this.setDepth(99999);
  }

  destroy() {
    super.destroy();
  }
}
