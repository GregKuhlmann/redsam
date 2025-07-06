import * as Phaser from "phaser";

import spriteSheetRestartContinue from "/assets/images/restart-continue.png";
import audioRestart from "/assets/audio/ascension.mp3";

import { MAPS } from "/src/scenes/Game.js";

export default class GameOver extends Phaser.Scene {
  constructor() {
    super("GameOver");
  }

  init(data) {
    this.map = data.map;
  }

  preload() {
    this.load.audio("restart", audioRestart);
    this.load.spritesheet("restart-continue", spriteSheetRestartContinue, {
      frameWidth: 89,
      frameHeight: 21,
    });
  }

  create() {
    let restartMode = false;
    const { width, height } = this.scale;
    this.sound.stopAll();
    this.sound.play("restart", {
      loop: true,
      volume: 0.5,
    });
    this.cameras.main.setBackgroundColor("#000000");

    this.restart = this.add
      .sprite(width / 2, height / 2 + 20, "restart-continue")
      .setOrigin(0.5)
      .setFrame(0)
      .setInteractive();
    this.restart
      .on("pointerover", () => {
        this.restart.setTint(0xff0000);
      })
      .on("pointerout", () => {
        this.restart.clearTint();
      })
      .on("pointerdown", () => {
        this.restart.disableInteractive();
        this.cont.disableInteractive();
        restartMode = true;
        this.sound.stopAll();
        this.sound.play("slash-reverse");
        this.cameras.main.fadeOut(500, 0, 0, 0);
      });
    this.cameras.main.once("camerafadeoutcomplete", () => {
      this.time.delayedCall(500, () => {
        this.scene.start("Game", {
          map: restartMode ? MAPS[0] : this.map,
          lives: 5,
        });
      });
    });

    this.cont = this.add
      .sprite(width / 2, height / 2 - 20, "restart-continue")
      .setOrigin(0.5)
      .setFrame(1)
      .setInteractive();
    this.cont
      .on("pointerover", () => {
        this.cont.setTint(0xff0000);
      })
      .on("pointerout", () => {
        this.cont.clearTint();
      })
      .on("pointerdown", () => {
        this.cont.disableInteractive();
        this.restart.disableInteractive();
        this.sound.stopAll();
        this.sound.play("slash");
        this.cameras.main.fadeOut(500, 0, 0, 0);
      });
  }
}
