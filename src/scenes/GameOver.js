import * as Phaser from "phaser";

import spriteSheetThumbnails from "/assets/images/level-thumbnails.png";
import spriteSheetRestartContinue from "/assets/images/restart-continue.png";
import audioRestart from "/assets/audio/ascension.mp3";

import { MAPS, PASSWORDS } from "/src/scenes/Start.js";

export default class GameOver extends Phaser.Scene {
  constructor() {
    super("GameOver");
  }

  preload() {
    this.load.audio("restart", audioRestart);
    this.load.spritesheet("thumbnails", spriteSheetThumbnails, {
      frameWidth: 22,
      frameHeight: 22,
    });
    this.load.spritesheet("restart-continue", spriteSheetRestartContinue, {
      frameWidth: 113,
      frameHeight: 21,
    });
  }

  border(sprite, color = 0xff0000) {
    const border = this.add.graphics();
    border.lineStyle(2, color);
    border.strokeRect(
      sprite.x - 2,
      sprite.y - 2,
      sprite.width + 4,
      sprite.height + 4
    );
    return border;
  }

  create() {
    this.selected = null;
    this.chosen = null;
    const { width, height } = this.scale;
    let lastMap = MAPS.indexOf(localStorage.getItem("lastMap")) || 0;
    const password = PASSWORDS.indexOf(localStorage.getItem("password")) || 0;
    if (lastMap > password) {
      lastMap = password;
    }
    this.sound.stopAll();
    this.sound.play("restart", {
      loop: true,
      volume: 0.5,
    });
    this.cameras.main.setBackgroundColor("#000000");

    this.add.sprite(width / 2, 22, "restart-continue", 0).setOrigin(0.5);

    for (let r = 0; r < 5; r++) {
      for (let c = 0; c < 10; c++) {
        const idx = r * 10 + c;
        const thumbnail = this.add
          .sprite(23 + c * 28, 45 + r * 28, "thumbnails", idx)
          .setOrigin(0);
        thumbnail.on("pointerdown", () => {
          if (this.chosen) return;
          this.chosen = idx;
          this.cont.disableInteractive();
          this.sound.stopAll();
          this.sound.play("slash");
          this.cameras.main.fadeOut(500, 0, 0, 0);
          this.cameras.main.once("camerafadeoutcomplete", () => {
            this.time.delayedCall(500, () => {
              this.scene.start("Game", { map: MAPS[this.chosen], lives: 5 });
            });
          });
        });
        if (idx > password) {
          thumbnail.setPipeline("Dull");
        } else {
          thumbnail.setInteractive();
        }
        if (idx === lastMap) {
          this.selected = thumbnail;
          this.selected.idx = idx;
          this.border(thumbnail, 0xaa0000);
        }
        thumbnail.on("pointerover", () => {
          thumbnail.border = this.border(thumbnail);
        });
        thumbnail.on("pointerout", () => {
          thumbnail.border?.destroy();
          thumbnail.border = null;
        });
      }
    }

    this.cont = this.add
      .sprite(width / 2, height - 22, "restart-continue", 1)
      .setOrigin(0.5)
      .setInteractive();
    this.cont
      .on("pointerover", () => {
        this.cont.setTint(0xff0000);
        this.selected.border = this.border(this.selected);
      })
      .on("pointerout", () => {
        this.cont.clearTint();
        this.selected.border?.destroy();
        this.selected.border = null;
      })
      .on("pointerdown", () => {
        if (this.chosen) return;
        this.chosen = this.selected.idx;
        this.cont.disableInteractive();
        this.sound.stopAll();
        this.sound.play("slash");
        this.cameras.main.fadeOut(500, 0, 0, 0);
        this.cameras.main.once("camerafadeoutcomplete", () => {
          this.time.delayedCall(500, () => {
            this.scene.start("Game", {
              map: MAPS[this.chosen],
              lives: 5,
            });
          });
        });
      });
  }
}
