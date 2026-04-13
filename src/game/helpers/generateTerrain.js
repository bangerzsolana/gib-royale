import Phaser from "phaser";
import Waypoint from "../classes/entities/waypoints/Waypoint.js";

function genTerrain(scene) {
  const worldY = scene.physics.world.bounds.y;
  const worldWidth = scene.physics.world.bounds.width;
  const worldHeight = scene.physics.world.bounds.height;

  // Field line markings (subtle)
  scene.add
    .rectangle(worldWidth / 2, worldY + worldHeight / 4, worldWidth - 80, 2, 0x3a7a33, 0.5)
    .setOrigin(0.5, 0.5);
  scene.add
    .rectangle(worldWidth / 2, worldY + (worldHeight * 3) / 4, worldWidth - 80, 2, 0x3a7a33, 0.5)
    .setOrigin(0.5, 0.5);

  // Create the river in the middle of the playing field
  scene.river = scene.add.group();

  const bridgeWidth = 100;
  const riverY = worldY + worldHeight / 2;
  const riverHeight = 40;
  const leftBridgeX = worldWidth * 0.2;
  const rightBridgeX = worldWidth * 0.8;

  // Left segment (before left bridge)
  const leftEnd = leftBridgeX - bridgeWidth / 2;
  if (leftEnd > 0) {
    scene.river.add(
      scene.physics.add
        .existing(
          scene.add.rectangle(leftEnd / 2, riverY, leftEnd, riverHeight, 0x3366cc),
          true
        )
        .setOrigin(0.5, 0.5)
    );
  }

  // Middle segment (between bridges)
  const midStart = leftBridgeX + bridgeWidth / 2;
  const midEnd = rightBridgeX - bridgeWidth / 2;
  const midWidth = midEnd - midStart;
  scene.river.add(
    scene.physics.add
      .existing(
        scene.add.rectangle(midStart + midWidth / 2, riverY, midWidth, riverHeight, 0x3366cc),
        true
      )
      .setOrigin(0.5, 0.5)
  );

  // Right segment (after right bridge)
  const rightStart = rightBridgeX + bridgeWidth / 2;
  const rightWidth = worldWidth - rightStart;
  if (rightWidth > 0) {
    scene.river.add(
      scene.physics.add
        .existing(
          scene.add.rectangle(rightStart + rightWidth / 2, riverY, rightWidth, riverHeight, 0x3366cc),
          true
        )
        .setOrigin(0.5, 0.5)
    );
  }

  // Bridge left
  scene.add
    .rectangle(worldWidth * 0.2, riverY, 100, 56, 0x8B7355)
    .setOrigin(0.5, 0.5)
    .setDepth(5);
  scene.add
    .rectangle(worldWidth * 0.2, riverY, 92, 48, 0xA0926B)
    .setOrigin(0.5, 0.5)
    .setDepth(6);

  // Bridge right
  scene.add
    .rectangle(worldWidth * 0.8, riverY, 100, 56, 0x8B7355)
    .setOrigin(0.5, 0.5)
    .setDepth(5);
  scene.add
    .rectangle(worldWidth * 0.8, riverY, 92, 48, 0xA0926B)
    .setOrigin(0.5, 0.5)
    .setDepth(6);

  // Populate waypoints
  try {
    scene.waypoints = [];
    const wWidth = worldWidth;
    const wHeight = worldHeight;
    const oneTenthWidth = wWidth / 10;
    const oneTwelfthHeight = wHeight / 12;
    for (let i = 0; i < 2; i++) {
      for (let j = 2; j < 8; j += 1) {
        scene.waypoints.push(
          new Waypoint(
            scene,
            oneTenthWidth * 2 + i * oneTenthWidth * 6,
            worldY + oneTwelfthHeight * 2 + oneTwelfthHeight * j
          ).setTint(0xff0000)
        );
      }
    }
  } catch (e) {
    console.error(e);
  }
}

export default genTerrain;
