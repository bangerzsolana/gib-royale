import Phaser from "phaser";
import Deck from "./Deck.js";
import Hand from "./Hand.js";

class CardArea extends Phaser.GameObjects.Container {
  constructor(scene, x, y, width, height) {
    super(scene, x, y);

    scene.add.existing(this).setDepth(10000);

    // Dark background for card area
    this.add(
      scene.add.rectangle(0, 0, width, height, 0x1a1a2e, 0.9).setOrigin(0, 0)
    );

    // Top border line
    this.add(
      scene.add.rectangle(0, 0, width, 2, 0x333355).setOrigin(0, 0)
    );

    this.deck = new Deck(scene, 5, 15, 50, 50);
    this.add(this.deck);

    this.hand = new Hand(scene, this.deck, 10, 10, width - 20, 100);
    this.add(this.hand);
  }

  destroy() {
    super.destroy();
  }
}

export default CardArea;
