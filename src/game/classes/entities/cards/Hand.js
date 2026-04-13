import Phaser from "phaser";
import CardSlot from "./CardSlot.js";

class Hand extends Phaser.GameObjects.Container {
  constructor(scene, cardSource, x, y, width, height, manaBank) {
    super(scene, x, y);

    this.cardSource = cardSource;
    this.manaBank = manaBank;
    this.selectedCardSlot = null;
    this.spawnOverlay = null;   // Player's own spawn zone overlay
    this.siblingHand = null;    // Other player's hand (for cross-deselection)

    scene.add.existing(this).setDepth(10000);

    // 4 card slots evenly spaced
    const slotWidth = 94;
    const slotSpacing = 100;
    const totalSlotsWidth = slotSpacing * 3 + slotWidth;
    const startX = (width - totalSlotsWidth) / 2;

    this.slots = [
      new CardSlot(scene, this, startX, 6),
      new CardSlot(scene, this, startX + slotSpacing, 6),
      new CardSlot(scene, this, startX + slotSpacing * 2, 6),
      new CardSlot(scene, this, startX + slotSpacing * 3, 6)
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
    // Hide own spawn overlay when nothing selected
    if (this.spawnOverlay) {
      this.spawnOverlay.setAlpha(0);
    }
  }

  setSelectedCardSlot(cardSlot) {
    // Cross-deselect: deselect the other player's hand
    if (this.siblingHand) {
      this.siblingHand.deselectAll();
    }
    // Show own spawn zone overlay
    if (this.spawnOverlay) {
      this.spawnOverlay.setAlpha(0.3);
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
