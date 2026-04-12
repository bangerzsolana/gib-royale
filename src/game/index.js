import Phaser from "phaser";
import { config } from "./settings/config.js";

let game = null;

export function launchGame() {
  if (game) {
    game.destroy(true);
  }
  game = new Phaser.Game(config);
  return game;
}

export function destroyGame() {
  if (game) {
    game.destroy(true);
    game = null;
  }
}
