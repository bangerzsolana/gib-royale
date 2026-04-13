import Player from "./Player.js";
import CardArea from "../entities/cards/CardArea.js";
import ManaBank from "../ManaBank.js";

export default class ControlledPlayer extends Player {
  constructor(scene, side = "bottom") {
    const worldWidth = scene.physics.world.bounds.width;
    const worldHeight = scene.physics.world.bounds.height;
    const halfWorldWidth = worldWidth / 2;
    const halfWorldHeight = worldHeight / 2;

    const isTop = side === "top";
    const spawnZoneY = isTop ? 0 : halfWorldHeight;
    const towerY = isTop ? 100 : worldHeight - 40;
    const velocityDirection = isTop ? 1 : -1;

    super(scene, 0, spawnZoneY, halfWorldWidth, towerY, velocityDirection);

    this.side = side;

    // ManaBank — both render at bottom card area position
    const gameWidth = scene.game.config.width;
    const gameHeight = scene.game.config.height;
    this.manaBank = new ManaBank(
      scene,
      gameWidth / 2,
      gameHeight - scene.cardHolderHeight - 16,
      gameWidth - 40,
      28
    );

    // Player cards and UI — both at bottom of screen, toggled by Tab
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
        const spawnPrice = currentCard.spawnPrice || null;

        const spawnedTroop = this.spawnTroop(
          pointer.worldX,
          pointer.worldY,
          this.troopVelocityDirection,
          troopClass,
          tokenId,
          spawnPrice
        );

        if (spawnedTroop) {
          if (this.opponent) this.opponent.spawnZoneOverlay.setAlpha(0);
          playerCardHand.drawNextCard();
          playerCardHand.deselectAll();
        }
      });
  }

  setOpponent(opponent) {
    super.setOpponent(opponent);
    if (this.cardArea && this.cardArea.hand) {
      this.cardArea.hand.opponentOverlay = opponent.spawnZoneOverlay;
    }
  }

  setActive(active) {
    this.cardArea.setVisible(active);
    if (this.manaBank.displayBar) {
      this.manaBank.displayBar.setVisible(active);
    }
    if (!active) {
      this.cardArea.hand.deselectAll();
    }
  }

  destroy() {
    super.destroy();
  }
}
