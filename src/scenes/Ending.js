import * as Phaser from "phaser";

import bfd from "/assets/images/bfd.png";

export default class Ending extends Phaser.Scene {
  constructor() {
    super("Ending");
  }

  init(data) {
    this.map = data.map;
  }

  preload() {
    this.load.image("bfd", bfd);
  }

  create() {
    const { width, height } = this.scale;
    this.add.image(width / 2, height / 2, "bfd");

    [
      { sprite: "sam", anim: "sam-walk-down" },
      { sprite: "dragon", anim: "dragon-idle" },
      { sprite: "cyclope", anim: "cyclope-blink" },
      { sprite: "panda", anim: "panda-walk-down" },
      { sprite: "trex", anim: "trex-walk-down" },
      { sprite: "slime", anim: "slime-bounce" },
      { sprite: "flam", anim: "flam-idle" },
      { sprite: "octopus", anim: "octopus-happy" },
      { sprite: "beast", anim: "beast-walk" },
    ].forEach((character) => {
      let ang = Phaser.Math.Between(0, 360);
      let speed = Phaser.Math.Between(70, 90);
      let vel = {
        x: speed * Math.cos(Phaser.Math.DegToRad(ang)),
        y: speed * Math.sin(Phaser.Math.DegToRad(ang)),
      };
      this.physics.add
        .sprite(width / 2, height / 2, character.sprite)
        .setOrigin(0.5, 0.5)
        .setScale(4)
        .setAlpha(0.5)
        .setCollideWorldBounds(true)
        .setBounce(1, 1)
        .setVelocity(vel.x, vel.y)
        .play({ key: character.anim, frameRate: 3, repeat: -1 });
    });
  }
}
