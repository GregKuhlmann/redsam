import * as Phaser from "phaser";
import Start from "/src/scenes/Start.js";
import Game from "/src/scenes/Game.js";

import samuraiWarrior from "/assets/fonts/Samurai Warrior.ttf";

const config = {
  type: Phaser.WEBGL,
  width: 320,
  height: 224,
  pixelArt: true,
  parent: "game-container",
  scene: [Start, Game],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
};

const font = new FontFace("SamuraiWarrior", `url(${samuraiWarrior})`);

font.load().then(function (loadedFace) {
  document.fonts.add(loadedFace);
  new Phaser.Game(config);
});
