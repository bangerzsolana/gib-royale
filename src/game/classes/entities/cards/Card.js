import Phaser from "phaser";

class Card extends Phaser.GameObjects.Container {
  constructor(scene, x, y, troopClass, coinSymbol) {
    super(scene, x, y);

    this.troopClass = troopClass;
    this.coinSymbol = coinSymbol || null;
    this.width = 25;
    this.height = 25;

    this.isSelected = false;

    scene.add.existing(this).setDepth(10000);

    // Add background
    this.background = scene.add
      .rectangle(0, 0, this.width, this.height, 0xbbbbbb)
      .setOrigin(0, 0);
    this.add(this.background);

    // Add troop image
    const animKey = troopClass.ANIM_KEY_PREFIX;
    this.add(scene.add.sprite(this.width / 2, this.height / 2, animKey));

    // Add coin name label at bottom (if linked to a coin)
    if (coinSymbol) {
      this.add(
        scene.add
          .bitmapText(this.width / 2, this.height - 1, "teeny-tiny-pixls", coinSymbol, 5)
          .setOrigin(0.5, 1)
      );
    }

    // Add mana cost text at top-left
    const cost = troopClass.COST;
    this.add(
      scene.add
        .text(0, 0, cost, { color: "blue", fontSize: "8px" })
        .setOrigin(0, 0)
    );
  }

  destroy() {
    super.destroy();
  }
}

export default Card;
