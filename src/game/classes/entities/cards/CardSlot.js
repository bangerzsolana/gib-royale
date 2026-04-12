import Phaser from "phaser";

class CardSlot extends Phaser.GameObjects.Container {
  constructor(scene, hand, x, y) {
    super(scene, x, y);

    this.hand = hand;
    this.width = 72;
    this.height = 90;
    this.originalY = y;

    this.card = null;
    this.isSelected = false;

    scene.add.existing(this).setDepth(10000);

    // Slot background
    this.background = scene.add
      .rectangle(0, 0, this.width, this.height, 0x222244)
      .setOrigin(0, 0)
      .setStrokeStyle(1, 0x444466);
    this.add(this.background);

    // Make interactive
    this.background
      .setInteractive({ useHandCursor: true })
      .on("pointerup", () => {
        this.select();
      });
  }

  insertCard(card) {
    if (this.card) this.removeCard();
    this.card = card;
    this.card.setPosition(2, 2);
    this.add(card);
  }

  removeCard() {
    let cardRef = this.card;
    this.remove(this.card);
    this.card = null;
    return cardRef;
  }

  select() {
    this.hand.deselectAll();
    this.isSelected = true;
    this.y = this.originalY - 8;
    this.background.setFillStyle(0x445588);
    this.background.setStrokeStyle(2, 0x6688cc);
    this.hand.setSelectedCardSlot(this);
  }

  deselect() {
    this.isSelected = false;
    this.y = this.originalY;
    this.background.setFillStyle(0x222244);
    this.background.setStrokeStyle(1, 0x444466);
  }

  destroy() {
    if (this.card) this.card.destroy();
    super.destroy();
  }
}

export default CardSlot;
