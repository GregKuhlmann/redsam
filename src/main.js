import * as Phaser from "phaser";
import { Game } from "./scenes/Game.js";

const config = {
  type: Phaser.WEBGL,
  width: 320,
  height: 224,
  pixelArt: true,
  parent: "game-container",
  backgroundColor: "#71ddee",
  scene: [Game],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
};

new Phaser.Game(config);
