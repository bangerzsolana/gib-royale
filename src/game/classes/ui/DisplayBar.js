import Phaser from "phaser";

export default class DisplayBar extends Phaser.GameObjects.Container {
  constructor(
    scene,
    x,
    y,
    width,
    height,
    value = 100,
    barColor = 0xfff,
    backgroundColor = 0x000
  ) {
    super(scene, x, y);
    this.scene = scene;
    this.value = value;
    this.denominator = value;

    scene.add.existing(this).setScrollFactor(0.5);

    // background bar
    this.backgroundBar = scene.add
      .rectangle(0, 0, width, height, backgroundColor)
      .setOrigin(0.5);
    this.add(this.backgroundBar);

    // foreground bar
    this.foregroundBar = scene.add
      .rectangle(0, 0, width, height, barColor)
      .setOrigin(0.5);
    this.add(this.foregroundBar);

    // value text display
    this.text = scene.add
      .text(0, 0, value, {
        fontSize: "12px",
        fontFamily: "Arial, sans-serif",
        color: "#ffffff",
        fontStyle: "bold"
      })
      .setOrigin(0.5);
    this.add(this.text);

    this.setDepth(99999);
  }

  setValue(value) {
    this.value = value;
    this.updateDisplay();
  }

  updateDisplay() {
    const fullBarWidth = this.backgroundBar.width;
    const fullBarHeight = this.backgroundBar.height;
    const foregroundRatio = parseFloat(this.value) / this.denominator;
    const foregroundWidth = fullBarWidth * foregroundRatio;
    this.foregroundBar.setSize(foregroundWidth, fullBarHeight);
    this.text.setText(Math.floor(this.value));
  }

  destroy() {
    super.destroy();
  }
}
