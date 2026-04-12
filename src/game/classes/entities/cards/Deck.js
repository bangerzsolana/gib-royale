import Phaser from "phaser";
import Card from "./Card.js";
import COIN_DECK from "../../../data/CoinDeck.js";

class Deck extends Phaser.GameObjects.Container {
  constructor(scene, x, y, width, height) {
    super(scene, x, y);

    scene.add
      .existing(this)
      .setDepth(10000);

    // Build a lookup for Card.js to use for coin colors
    if (!scene.game.__coinDeckLookup) {
      scene.game.__coinDeckLookup = {};
      for (const entry of COIN_DECK) {
        scene.game.__coinDeckLookup[entry.symbol] = entry;
      }
    }

    this.populate();
    this.shuffle();
  }

  populate() {
    // Build deck from coin-mapped cards
    for (const coinEntry of COIN_DECK) {
      const thisCard = new Card(
        this.scene,
        0, 0,
        coinEntry.troopClass,
        coinEntry.symbol
      );
      thisCard.coinEntry = coinEntry;
      this.add(thisCard);
    }
  }

  drawCard() {
    const nextCard = this.getAt(this.length - 1);
    return nextCard;
  }

  destroy() {
    super.destroy();
  }
}

export default Deck;
