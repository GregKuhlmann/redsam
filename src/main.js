import * as Phaser from "phaser";
import Start from "/src/scenes/Start.js";
import Game from "/src/scenes/Game.js";
import GameOver from "/src/scenes/GameOver.js";
import Ending from "/src/scenes/Ending.js";

const config = {
  type: Phaser.WEBGL,
  width: 320,
  height: 224,
  pixelArt: true,
  antialias: false,
  parent: "game-container",
  scene: [Start, Ending, Game, GameOver],
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: false,
    },
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
};

new Phaser.Game(config);
