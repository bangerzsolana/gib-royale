import { Scene } from "phaser";

let CREDITS_STRING = `Code:
pyxld_kris
Austyn (cosmic)

Art:
pyxld_kris
ava (dskjsdkmlj)
guillermo
Calliope
auburn
otter
komo
brian

Special Thanks:
Original_Hojocat`;

export default class CreditsScene extends Scene {
  constructor() {
    super("CreditsScene");
  }

  create() {
    this.cameras.main.setBackgroundColor("#1a1a2e");
    let centerX = this.cameras.main.centerX;

    this.add
      .text(centerX, 30, "Credits", {
        fontSize: "24px",
        fontFamily: "Arial, sans-serif",
        fontStyle: "bold",
        color: "#ffffff"
      })
      .setOrigin(0.5, 0.5);

    this.add
      .text(centerX, 70, CREDITS_STRING, {
        fontSize: "14px",
        fontFamily: "Arial, sans-serif",
        color: "#cccccc",
        align: "center",
        lineSpacing: 4
      })
      .setOrigin(0.5, 0);

    this.add
      .text(centerX, this.cameras.main.height - 30, "Tap to close", {
        fontSize: "12px",
        fontFamily: "Arial, sans-serif",
        color: "#888888"
      })
      .setOrigin(0.5, 0.5);

    this.input.on("pointerdown", () => {
      this.scene.manager.stop("CreditsScene");
    });
  }
}
