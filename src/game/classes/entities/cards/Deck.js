import Phaser from "phaser";
import Walkers from "../troops/walkers/index.js";
import Card from "./Card.js";

class Deck extends Phaser.GameObjects.Container {
  constructor(scene, x, y, width, height) {
    super(scene, x, y);

    scene.add
      .existing(this)
      .setDepth(10000)
      .setScale(0.9);

    this.populate();
    this.shuffle();
  }

  populate() {
    for (let troopClass of Object.values(Walkers)) {
      if (troopClass.IS_IN_DECK) {
        const thisCard = new Card(this.scene, 0, 0, troopClass);
        this.add(thisCard);
      }
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
