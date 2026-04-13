import Phaser from "phaser";
import Deck from "./Deck.js";
import Hand from "./Hand.js";

class CardArea extends Phaser.GameObjects.Container {
  constructor(scene, x, y, width, height, manaBank) {
    super(scene, x, y);

    scene.add.existing(this).setDepth(10000);

    // Dark background for card area
    this.add(
      scene.add.rectangle(0, 0, width, height, 0x1a1a2e, 0.9).setOrigin(0, 0)
    );

    // Top border line
    this.add(
      scene.add.rectangle(0, 0, width, 4, 0x333355).setOrigin(0, 0)
    );

    // "Next" card preview on the left (small)
    this.deck = new Deck(scene, 8, 36, 72, 96);
    this.add(this.deck);

    // "NEXT" label above deck preview
    this.add(
      scene.add
        .text(44, 16, "NEXT", {
          fontSize: "12px",
          fontFamily: "Arial, sans-serif",
          color: "#888899"
        })
        .setOrigin(0.5, 0.5)
    );

    // Hand starts after deck area to avoid overlap
    this.hand = new Hand(scene, this.deck, 92, 20, width - 100, 200, manaBank);
    this.add(this.hand);
  }

  destroy() {
    super.destroy();
  }
}

export default CardArea;
