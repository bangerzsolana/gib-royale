import Phaser from "phaser";

class CardSlot extends Phaser.GameObjects.Container {
  constructor(scene, hand, x, y) {
    super(scene, x, y);

    this.hand = hand;
    this.width = 94;
    this.height = 110;
    this.originalY = y;

    this.card = null;
    this.isSelected = false;
    this.isAffordable = true;

    scene.add.existing(this).setDepth(10000);

    // Slot background
    this.background = scene.add
      .rectangle(0, 0, this.width, this.height, 0x222244)
      .setOrigin(0, 0)
      .setStrokeStyle(1, 0x444466);
    this.add(this.background);

    // Dimming overlay for unaffordable cards
    this.dimOverlay = scene.add
      .rectangle(0, 0, this.width, this.height, 0x000000, 0.5)
      .setOrigin(0, 0);
    this.add(this.dimOverlay);
    this.dimOverlay.setVisible(false);

    // Make interactive
    this.background
      .setInteractive({ useHandCursor: true })
      .on("pointerup", () => {
        this.handleClick();
      });
  }

  insertCard(card) {
    if (this.card) this.removeCard();
    this.card = card;
    this.card.setPosition(2, 2);
    this.add(card);
    // Keep dim overlay on top
    this.bringToTop(this.dimOverlay);
    // Start price tracking when card enters hand
    card.startPriceTracking();
  }

  removeCard() {
    let cardRef = this.card;
    // Stop price tracking when card leaves hand
    cardRef.stopPriceTracking();
    this.remove(this.card);
    this.card = null;
    return cardRef;
  }

  handleClick() {
    // If already selected, deselect (toggle)
    if (this.isSelected) {
      this.hand.deselectAll();
      return;
    }
    // Block selection if can't afford
    if (!this.isAffordable) return;
    this.select();
  }

  select() {
    this.hand.deselectAll();
    this.isSelected = true;
    this.y = this.originalY - 16;
    this.background.setFillStyle(0x445588);
    this.background.setStrokeStyle(2, 0x88bbff);
    this.hand.setSelectedCardSlot(this);
  }

  deselect() {
    this.isSelected = false;
    this.y = this.originalY;
    // Restore to affordable or default style
    this.updateAffordability(this.isAffordable);
  }

  updateAffordability(canAfford) {
    this.isAffordable = canAfford;
    if (this.isSelected) return; // Don't change visuals while selected

    if (canAfford) {
      this.background.setFillStyle(0x222244);
      this.background.setStrokeStyle(2, 0x4488cc);
      this.dimOverlay.setVisible(false);
      this.setAlpha(1);
    } else {
      this.background.setFillStyle(0x1a1a2a);
      this.background.setStrokeStyle(1, 0x333344);
      this.dimOverlay.setVisible(true);
      this.setAlpha(0.6);
    }
  }

  destroy() {
    if (this.card) this.card.destroy();
    super.destroy();
  }
}

export default CardSlot;
