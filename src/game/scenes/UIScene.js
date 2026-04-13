import { Scene } from "phaser";

class UIScene extends Scene {
  constructor() {
    super("UIScene");
  }

  create() {
    // Menu button (top-left)
    let menuButton = this.add
      .text(20, 20, "MENU", {
        fontSize: "24px",
        fontFamily: "Arial, sans-serif",
        fontStyle: "bold",
        color: "#ffffff",
        backgroundColor: "#00000066",
        padding: { x: 12, y: 8 }
      })
      .setOrigin(0, 0)
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", () => {
        uiMenuContainer.setVisible(!uiMenuContainer.visible);
      });

    let uiMenuContainer = this.add
      .container(menuButton.x, menuButton.y + menuButton.height + 8)
      .setVisible(false);

    // RESTART
    uiMenuContainer.add(
      this.add
        .text(0, 0, "RESTART", {
          fontSize: "24px",
          fontFamily: "Arial, sans-serif",
          fontStyle: "bold",
          color: "#ffcc00",
          backgroundColor: "#00000088",
          padding: { x: 12, y: 8 }
        })
        .setInteractive({ useHandCursor: true })
        .on("pointerdown", () => {
          let sceneManager = this.scene.manager;
          sceneManager.getScenes().forEach(function(scene) {
            let sceneKey = scene.scene.key;
            scene.scene.stop(sceneKey);
          });
          sceneManager.start("TitleScene");
        })
        .setOrigin(0, 0)
    );

    // CREDITS
    uiMenuContainer.add(
      this.add
        .text(0, 56, "CREDITS", {
          fontSize: "24px",
          fontFamily: "Arial, sans-serif",
          fontStyle: "bold",
          color: "#ffcc00",
          backgroundColor: "#00000088",
          padding: { x: 12, y: 8 }
        })
        .setInteractive({ useHandCursor: true })
        .on("pointerdown", () => {
          uiMenuContainer.setVisible(false);
          this.scene.manager.start("CreditsScene");
        })
        .setOrigin(0, 0)
    );
  }

  update(time, delta) {
    if (parseInt(time) % 20 === 0) {
      this.scene.bringToTop();
    }
  }
}

export default UIScene;
