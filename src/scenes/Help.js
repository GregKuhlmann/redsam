import * as Phaser from "phaser";

import help from "/assets/images/help.png";

import { MUSIC_VOLUME } from "/src/scenes/Game.js";

export default class Help extends Phaser.Scene {
  constructor() {
    super("Help");
  }

  init(data) {
    this.map = data.map;
  }

  preload() {
    this.load.image("help", help);
  }

  create() {
    const { width, height } = this.scale;

    const music = this.registry.get("bgm");
    if (music && music.isPlaying) {
      music.setVolume(MUSIC_VOLUME * 0.3);
    }

    this.overlay = this.add
      .rectangle(0, 0, width, height, 0x000000, 0.6)
      .setOrigin(0, 0);

    this.modalImage = this.add
      .image(width / 2, height / 2, "help")
      .setInteractive();

    // Close on click anywhere (including modal itself)
    this.input.once("pointerdown", () => {
      this.scene.stop(); // Remove modal
      if (music && music.isPlaying) {
        music.setVolume(MUSIC_VOLUME);
      }
      this.scene.resume("Game"); // Resume main scene
    });
  }
}
