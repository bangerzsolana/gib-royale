import Phaser from "phaser";
import CardSlot from "./CardSlot.js";

class Hand extends Phaser.GameObjects.Container {
  constructor(scene, cardSource, x, y, width, height, manaBank) {
    super(scene, x, y);

    this.cardSource = cardSource;
    this.manaBank = manaBank;
    this.selectedCardSlot = null;
    this.opponentOverlay = null; // Set by ControlledPlayer.setOpponent()

    scene.add.existing(this).setDepth(10000);

    // 4 card slots evenly spaced
    const slotWidth = 144;
    const slotSpacing = 150;
    const startX = (width - slotSpacing * 3 - slotWidth) / 2;

    this.slots = [
      new CardSlot(scene, this, startX, 10),
      new CardSlot(scene, this, startX + slotSpacing, 10),
      new CardSlot(scene, this, startX + slotSpacing * 2, 10),
      new CardSlot(scene, this, startX + slotSpacing * 3, 10)
    ];
    for (let i = 0; i < this.slots.length; i++) {
      this.add(this.slots[i]);
    }

    // Populate card slots with cards
    for (let i = 0; i < this.slots.length; i++) {
      const thisSlot = this.slots[i];
      thisSlot.insertCard(this.cardSource.drawCard());
    }

    // Check affordability every 200ms
    scene.time.addEvent({
      delay: 200,
      loop: true,
      callback: () => this.updateAffordability()
    });
    this.updateAffordability();
  }

  updateAffordability() {
    if (!this.manaBank) return;
    const mana = this.manaBank.getManaAmount();
    for (const slot of this.slots) {
      if (slot.card) {
        const cost = slot.card.troopClass.COST;
        slot.updateAffordability(mana >= cost);
      }
    }
  }

  deselectAll() {
    this.selectedCardSlot = null;
    this.slots.forEach(slot => {
      slot.deselect();
    });
    // Hide spawn overlay when nothing selected
    if (this.opponentOverlay) {
      this.opponentOverlay.setAlpha(0);
    }
  }

  setSelectedCardSlot(cardSlot) {
    if (this.opponentOverlay) {
      this.opponentOverlay.setAlpha(0.5);
    }
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
