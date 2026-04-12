import Player from "./Player.js";
import CardArea from "../entities/cards/CardArea.js";
import ManaBank from "../ManaBank.js";

export default class ControlledPlayer extends Player {
  constructor(scene) {
    const worldWidth = scene.physics.world.bounds.width;
    const worldHeight = scene.physics.world.bounds.height;
    const halfWorldWidth = worldWidth / 2;
    const halfWorldHeight = worldHeight / 2;

    super(scene, 0, halfWorldHeight, halfWorldWidth, worldHeight - 20, -1);

    // ManaBank
    const gameWidth = scene.game.config.width;
    const gameHeight = scene.game.config.height;
    this.manaBank = new ManaBank(
      scene,
      gameWidth / 2,
      gameHeight - scene.cardHolderHeight - 8,
      gameWidth - 20,
      14
    );

    // Player cards and UI
    this.cardArea = new CardArea(
      scene,
      0,
      gameHeight - scene.cardHolderHeight,
      scene.cardHolderWidth,
      scene.cardHolderHeight,
      this.manaBank
    );

    // Handle the player clicking on the play area
    this.spawnZone
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", pointer => {
        const playerCardHand = this.cardArea.hand;
        if (!playerCardHand.selectedCardSlot || !playerCardHand.selectedCardSlot.card) return;

        const currentCard = playerCardHand.selectedCardSlot.card;
        const troopClass = currentCard.troopClass;
        const tokenId = currentCard.coinSymbol || null;

        const spawnedTroop = this.spawnTroop(
          pointer.worldX,
          pointer.worldY,
          this.troopVelocityDirection,
          troopClass,
          tokenId
        );

        if (spawnedTroop) {
          this.opponent.spawnZoneOverlay.setAlpha(0);
          playerCardHand.drawNextCard();
          playerCardHand.deselectAll();
        }
      });
  }

  destroy() {
    super.destroy();
  }
}
