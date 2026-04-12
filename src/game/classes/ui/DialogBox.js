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
        gameWidth - 4,
        gameHeight / 4 - 2,
        0x000,
        0.5
      )
      .setOrigin(0.5, 0);

    this.text = scene.add
      .bitmapText(
        gameWidth / 2,
        2,
        "teeny-tiny-pixls",
        text,
        5,
        1
      )
      .setOrigin(0.5, 0)
      .setMaxWidth(100);

    this.add(this.backgroundBox);
    this.add(this.text);

    this.setDepth(99999);
  }

  destroy() {
    super.destroy();
  }
}
