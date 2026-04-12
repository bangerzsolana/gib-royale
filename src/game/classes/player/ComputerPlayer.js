import Player from "./Player.js";
import ManaBank from "../ManaBank.js";
import COIN_DECK from "../../data/CoinDeck.js";

export default class ComputerPlayer extends Player {
  constructor(scene) {
    const worldWidth = scene.physics.world.bounds.width;
    const worldHeight = scene.physics.world.bounds.height;
    const halfWorldWidth = worldWidth / 2;

    super(scene, 0, 0, halfWorldWidth, 50, 1);

    this.manaBank = new ManaBank(scene, 0, 0, 10, 10, 10);

    this.decisionInterval = scene.time.addEvent({
      delay: 250,
      callback: this.makeDecision,
      callbackScope: this,
      loop: true
    });
  }

  makeDecision() {
    const manaAmount = this.manaBank.getManaAmount();

    if (manaAmount >= 3) {
      if (Math.random() < 0.25) {
        // Pick a random coin from the deck — opponent uses the same coin system
        const pick = COIN_DECK[Math.floor(Math.random() * COIN_DECK.length)];
        this.spawnTroop(
          parseInt(Math.random() * this.scene.game.config.width, 0),
          80,
          this.troopVelocityDirection,
          pick.troopClass,
          pick.symbol
        );
      }
    }
  }

  destroy() {
    this.decisionInterval.remove();
    super.destroy();
  }
}
