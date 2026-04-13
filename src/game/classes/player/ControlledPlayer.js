import Player from "./Player.js";
import CardArea from "../entities/cards/CardArea.js";
import ManaBank from "../ManaBank.js";

export default class ControlledPlayer extends Player {
  constructor(scene, side = "bottom") {
    const bounds = scene.physics.world.bounds;
    const worldY = bounds.y;
    const worldWidth = bounds.width;
    const worldHeight = bounds.height;
    const halfWorldWidth = worldWidth / 2;
    const halfWorldHeight = worldHeight / 2;

    const isTop = side === "top";
    const spawnZoneY = isTop ? worldY : worldY + halfWorldHeight;
    const towerY = isTop ? worldY + 100 : worldY + worldHeight - 40;
    const velocityDirection = isTop ? 1 : -1;

    super(scene, 0, spawnZoneY, halfWorldWidth, towerY, velocityDirection);

    this.side = side;

    const gameWidth = scene.game.config.width;
    const gameHeight = scene.game.config.height;

    // Position mana bar in the dedicated gap between card area and field
    const manaBarY = isTop
      ? scene.topCardHolderHeight + scene.manaBarHeight / 2
      : gameHeight - scene.cardHolderHeight - scene.manaBarHeight / 2;

    const cardAreaY = isTop ? 0 : gameHeight - scene.cardHolderHeight;

    this.manaBank = new ManaBank(
      scene,
      gameWidth / 2,
      manaBarY,
      gameWidth - 40,
      28
    );

    this.cardArea = new CardArea(
      scene,
      0,
      cardAreaY,
      scene.cardHolderWidth,
      scene.cardHolderHeight,
      this.manaBank
    );

    // Player label on the card area
    const labelText = isTop ? "P2 (RED)" : "P1 (BLUE)";
    const labelColor = isTop ? "#ff4444" : "#4488ff";
    const labelY = isTop ? 8 : gameHeight - scene.cardHolderHeight + 8;
    scene.add
      .text(gameWidth - 8, labelY, labelText, {
        fontSize: "12px",
        fontFamily: "Arial, sans-serif",
        color: labelColor,
        fontStyle: "bold"
      })
      .setOrigin(1, 0)
      .setDepth(10002);

    // Handle click on spawn zone to deploy
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
          playerCardHand.drawNextCard();
          playerCardHand.deselectAll();
        }
      });
  }

  setOpponent(opponent) {
    super.setOpponent(opponent);
    if (this.cardArea && this.cardArea.hand) {
      // Show own spawn zone when selecting a card
      this.cardArea.hand.spawnOverlay = this.spawnZoneOverlay;
      // Cross-deselect: selecting from one hand deselects the other
      this.cardArea.hand.siblingHand = opponent.cardArea.hand;
    }
  }

  destroy() {
    super.destroy();
  }
}
