import Phaser from "phaser";
import Waypoint from "../classes/entities/waypoints/Waypoint.js";

function genTerrain(scene) {
  const worldWidth = scene.physics.world.bounds.width;
  const worldHeight = scene.physics.world.bounds.height;

  // Field line markings (subtle)
  scene.add
    .rectangle(worldWidth / 2, worldHeight / 4, worldWidth - 40, 1, 0x3a7a33, 0.5)
    .setOrigin(0.5, 0.5);
  scene.add
    .rectangle(worldWidth / 2, (worldHeight * 3) / 4, worldWidth - 40, 1, 0x3a7a33, 0.5)
    .setOrigin(0.5, 0.5);

  // Create the river in the middle of the playing field
  scene.river = scene.add.group();

  // Main river body
  scene.river.add(
    scene.physics.add
      .existing(
        scene.add.rectangle(
          worldWidth / 2,
          worldHeight / 2,
          worldWidth,
          20,
          0x3366cc
        ),
        true
      )
      .setOrigin(0.5, 0.5)
  );

  // Bridge left
  scene.add
    .rectangle(worldWidth * 0.2, worldHeight / 2, 50, 28, 0x8B7355)
    .setOrigin(0.5, 0.5)
    .setDepth(5);
  scene.add
    .rectangle(worldWidth * 0.2, worldHeight / 2, 46, 24, 0xA0926B)
    .setOrigin(0.5, 0.5)
    .setDepth(6);

  // Bridge right
  scene.add
    .rectangle(worldWidth * 0.8, worldHeight / 2, 50, 28, 0x8B7355)
    .setOrigin(0.5, 0.5)
    .setDepth(5);
  scene.add
    .rectangle(worldWidth * 0.8, worldHeight / 2, 46, 24, 0xA0926B)
    .setOrigin(0.5, 0.5)
    .setDepth(6);

  // Populate waypoints
  try {
    scene.waypoints = [];
    const wWidth = scene.physics.world.bounds.width;
    const wHeight = scene.physics.world.bounds.height;
    const oneTenthWidth = wWidth / 10;
    const oneTwelfthHeight = wHeight / 12;
    for (let i = 0; i < 2; i++) {
      for (let j = 2; j < 8; j += 1) {
        scene.waypoints.push(
          new Waypoint(
            scene,
            oneTenthWidth * 2 + i * oneTenthWidth * 6,
            oneTwelfthHeight * 2 + oneTwelfthHeight * j
          ).setTint(0xff0000)
        );
      }
    }
  } catch (e) {
    console.error(e);
  }
}

export default genTerrain;
