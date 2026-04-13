import { Scene } from "phaser";

import ControlledPlayer from "../classes/player/ControlledPlayer.js";

import Components from "../classes/entities/components/index.js";

import genTerrain from "../helpers/generateTerrain.js";

import { priceService } from "../services/PriceService.js";

export default class PlayScene extends Scene {
  constructor() {
    super("PlayScene");
  }

  create() {
    try {
      // Start UIScene overlay
      this.scene.run("UIScene");

      const gameWidth = this.game.config.width;
      const gameHeight = this.game.config.height;

      this.cardHolderWidth = gameWidth;
      this.cardHolderHeight = 130;
      this.topCardHolderHeight = 130;

      // Field area between the two card areas
      const fieldY = this.topCardHolderHeight;
      const fieldHeight = gameHeight - this.topCardHolderHeight - this.cardHolderHeight;

      // Set physics world size (field area only)
      this.physics.world.setBounds(0, fieldY, gameWidth, fieldHeight);

      this.camera = this.cameras.main;
      this.camera.setBounds(0, 0, gameWidth, gameHeight);

      // Reset from previous rounds
      Components.HasDestructionParticles.particles = null;

      // Create clean background (green field only)
      this.add
        .rectangle(gameWidth / 2, fieldY + fieldHeight / 2, gameWidth, fieldHeight, 0x2d5a27)
        .setOrigin(0.5, 0.5);

      // Start live price polling for the battle
      priceService.startPolling();

      // 2-player mode: both card areas visible simultaneously
      this.player = new ControlledPlayer(this, "bottom");
      this.opponent = new ControlledPlayer(this, "top");

      this.player.setOpponent(this.opponent);
      this.opponent.setOpponent(this.player);

      // Opponent troops attacking player troops
      this.physics.add.overlap(
        this.opponent.aggroAreas,
        this.player.troops,
        (aggroArea, enemyTroop) => {
          const thisTroop = aggroArea.troop;
          thisTroop.initiateEffect(enemyTroop);
        }
      );

      // Player troops attacking opponent troops
      this.physics.add.overlap(
        this.player.aggroAreas,
        this.opponent.troops,
        (aggroArea, enemyTroop) => {
          const thisTroop = aggroArea.troop;
          thisTroop.initiateEffect(enemyTroop);
        }
      );

      genTerrain(this);

      // Troop colliders - enemy troops collide with each other
      // Same-team troops pass through each other (like Clash Royale)
      this.physics.add.collider(
        this.player.walkingTroops,
        this.opponent.walkingTroops
      );
      this.physics.add.collider(
        this.player.flyingTroops,
        this.opponent.flyingTroops
      );

      // River colliders for walking troops
      this.physics.add.collider(this.player.walkingTroops, this.river);
      this.physics.add.collider(this.opponent.walkingTroops, this.river);

      // Win/lose conditions
      this.events.on("tower-destroyed", () => {
        try {
          if (this.player.towers.getLength() === 0) {
            this.events.off("tower-destroyed");
            priceService.stopPolling();
            this.scene.start("LoseScene");
          } else if (this.opponent.towers.getLength() === 0) {
            this.events.off("tower-destroyed");
            priceService.stopPolling();
            this.scene.start("WinScene");
          }
        } catch (e) {
          console.error(e);
        }
      });
    } catch (e) {
      console.error(e);
    }
  }

  update(time, delta) {}

  destroy() {
    priceService.stopPolling();
    this.player.destroy();
    this.opponent.destroy();
    super.destroy();
  }
}
