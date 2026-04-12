import { Scene } from "phaser";

let CREDITS_STRING = `
Code:
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
Original_Hojocat
`;

export default class CreditsScene extends Scene {
  constructor() {
    super("CreditsScene");
  }

  create() {
    let centerX = this.cameras.main.centerX;
    this.add
      .bitmapText(centerX, 20, "teeny-tiny-pixls", "Credits", 10)
      .setOrigin(0.5, 0.5);

    this.add
      .bitmapText(centerX, 30, "teeny-tiny-pixls", CREDITS_STRING, 10)
      .setOrigin(0.5, 0);

    this.input.on("pointerdown", () => {
      this.scene.manager.stop("CreditsScene");
    });
  }
}
