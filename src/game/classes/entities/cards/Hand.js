import Phaser from "phaser";
import CardSlot from "./CardSlot.js";

class Hand extends Phaser.GameObjects.Container {
  constructor(scene, cardSource, x, y, width, height) {
    super(scene, x, y);

    this.cardSource = cardSource;
    this.selectedCardSlot = null;

    scene.add.existing(this).setDepth(10000);

    // Add background
    this.add(
      scene.add.rectangle(0, 0, width, height, 0xdddddd).setOrigin(0, 0)
    );

    // Add card slots
    this.slots = [
      new CardSlot(scene, this, 2, 5),
      new CardSlot(scene, this, 32, 5),
      new CardSlot(scene, this, 62, 5),
      new CardSlot(scene, this, 92, 5)
    ];
    for (let i = 0; i < this.slots.length; i++) {
      this.add(this.slots[i]);
    }

    // Populate card slots with cards
    for (let i = 0; i < this.slots.length; i++) {
      const thisSlot = this.slots[i];
      thisSlot.insertCard(this.cardSource.drawCard());
    }
  }

  deselectAll() {
    this.selectedCard = null;
    this.slots.forEach(slot => {
      slot.deselect();
    });
  }

  setSelectedCardSlot(cardSlot) {
    this.scene.opponent.spawnZoneOverlay.setAlpha(0.5);
    this.selectedCardSlot = cardSlot;
  }

  drawNextCard() {
    const usedCard = this.selectedCardSlot.removeCard();
    this.selectedCardSlot.insertCard(this.cardSource.drawCard());

    this.cardSource.shuffle();
    this.cardSource.addAt(usedCard, 0);
  }

  destroy() {
    super.destroy();
  }
}

export default Hand;
