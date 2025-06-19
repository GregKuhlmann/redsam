import * as Phaser from "phaser";
import Start from "/src/scenes/Start.js";
import Game from "/src/scenes/Game.js";

const config = {
  type: Phaser.WEBGL,
  width: 320,
  height: 224,
  pixelArt: true,
  antialias: false,
  parent: "game-container",
  scene: [Start, Game],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
};

new Phaser.Game(config);
