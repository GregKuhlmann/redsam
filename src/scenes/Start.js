import * as Phaser from "phaser";

import GrayscalePipeline from "/src/shaders/grayscale.js";
import ShadowPipeline from "/src/shaders/shadow.js";

import desert1 from "/assets/maps/desert1.json";
import desert2 from "/assets/maps/desert2.json";
import desert3 from "/assets/maps/desert3.json";
import desert4 from "/assets/maps/desert4.json";
import desert5 from "/assets/maps/desert5.json";
import desert6 from "/assets/maps/desert6.json";
import desert7 from "/assets/maps/desert7.json";
import desert8 from "/assets/maps/desert8.json";
import tilesetHouse from "/assets/Ninja/Backgrounds/Tilesets/TilesetHouse.png";
import tilesetNature from "/assets/Ninja/Backgrounds/Tilesets/TilesetNature.png";
import tilesetWater from "/assets/Ninja/Backgrounds/Tilesets/TilesetWater.png";
import tilesetItems from "/assets/Ninja/TilesetItems.png";
import tilesetGUI from "/assets/Ninja/TilesetGUI.png";
import spriteSheetRedNinja3 from "/assets/Ninja/Actor/Characters/RedNinja3/SpriteSheet.png";
import spriteSheetPanda from "/assets/Ninja/Actor/Monsters/Panda/SpriteSheet.png";
import spriteSheetTrex from "/assets/Ninja/Actor/Monsters/Grey Trex/SpriteSheet.png";
import spriteSheetDragon from "/assets/Ninja/Actor/Monsters/Dragon/SpriteSheet.png";
import spriteSheetCyclope from "/assets/Ninja/Actor/Monsters/Cyclope/SpriteSheet.png";
import spriteSheetSlime from "/assets/Ninja/Actor/Monsters/Slime/Slime.png";
import spriteSheetFlam from "/assets/Ninja/flam.png";
import spriteSheetOctopus from "/assets/Ninja/Actor/Monsters/Octopus/SpriteSheet.png";
import spriteSheetBeast from "/assets/Ninja/Actor/Monsters/Beast/BeastPink.png";
import spriteSheetLightning from "/assets/Ninja/FX/Elemental/Thunder/SpriteSheet.png";
import spriteSheetSpark from "/assets/Ninja/FX/Magic/Spark/SpriteSheet.png";
import spriteSheetAura from "/assets/Ninja/FX/Magic/Aura/SpriteSheet.png";
import spriteSheetSmoke from "/assets/Ninja/FX/Smoke/Smoke/SpriteSheet.png";
import spriteSheetIce from "/assets/Ninja/FX/Elemental/Ice/SpriteSheet.png";
import spriteSheetShadow from "/assets/Ninja/shadow.png";
import spriteSheetChest from "/assets/Ninja/Items/Treasure/BigTreasureChest.png";
import spriteSheetCrystal from "/assets/Ninja/purple-crystal.png";
import spriteSheetFont from "/assets/Ninja/font.png";
import audioExplosion from "/assets/Ninja/Audio/Sounds/Elemental/Fire3.wav";
import audioCollect from "/assets/Ninja/Audio/Sounds/Bonus/PowerUp1.wav";
import audioChestOpen from "/assets/Ninja/Audio/Sounds/Bonus/Bonus.wav";
import audioCelebrate from "/assets/Ninja/Audio/Jingles/Success4.wav";
import audioStep from "/assets/Ninja/Audio/Sounds/Elemental/Grass2.wav";
import audioSlash from "/assets/Ninja/Audio/Sounds/Whoosh & Slash/Slash2.wav";
import audioSlashReverse from "/assets/audio/Slash2Reverse.mp3";
import audioFreeze from "/assets/Ninja/Audio/Sounds/Elemental/Water9.wav";
import audioKilled from "/assets/Ninja/Audio/Sounds/Hit & Impact/Impact2.wav";
import audioGameOver from "/assets/Ninja/Audio/Jingles/GameOver.wav";
import audioMainTheme from "/assets/audio/lolo-main-theme.mp3";
import audioLaser from "/assets/Ninja/Audio/Sounds/Whoosh & Slash/Slash5.wav";
import startBackground from "/assets/images/start-bg.png";
import redSam from "/assets/images/red-sam.png";
import clickToStart from "/assets/images/click-to-start.png";
import laser from "/assets/Ninja/laser.png";
import sword from "/assets/Ninja/Items/Weapons/BigSword/Sprite.png";

export default class Start extends Phaser.Scene {
  constructor() {
    super("Start");
  }

  preload() {
    this.load.image("tilesetHouse", tilesetHouse);
    this.load.image("tilesetNature", tilesetNature);
    this.load.image("tilesetWater", tilesetWater);
    this.load.image("tilesetItems", tilesetItems);
    this.load.image("tilesetGUI", tilesetGUI);
    this.load.audio("explosion", audioExplosion);
    this.load.audio("collect", audioCollect);
    this.load.audio("chestOpen", audioChestOpen);
    this.load.audio("celebrate", audioCelebrate);
    this.load.audio("step", audioStep);
    this.load.audio("slash", audioSlash);
    this.load.audio("slash-reverse", audioSlashReverse);
    this.load.audio("freeze", audioFreeze);
    this.load.audio("killed", audioKilled);
    this.load.audio("game-over", audioGameOver);
    this.load.audio("laser", audioLaser);
    this.load.audio("main-theme", audioMainTheme);
    this.load.tilemapTiledJSON("desert1", desert1);
    this.load.tilemapTiledJSON("desert2", desert2);
    this.load.tilemapTiledJSON("desert3", desert3);
    this.load.tilemapTiledJSON("desert4", desert4);
    this.load.tilemapTiledJSON("desert5", desert5);
    this.load.tilemapTiledJSON("desert6", desert6);
    this.load.tilemapTiledJSON("desert7", desert7);
    this.load.tilemapTiledJSON("desert8", desert8);
    this.game.renderer.pipelines.add(
      "Grayscale",
      new GrayscalePipeline(this.game)
    );
    this.game.renderer.pipelines.add("Shadow", new ShadowPipeline(this.game));
    this.load.spritesheet("dragon", spriteSheetDragon, {
      frameWidth: 16,
      frameHeight: 16,
    });
    this.load.spritesheet("cyclope", spriteSheetCyclope, {
      frameWidth: 16,
      frameHeight: 16,
    });
    this.load.spritesheet("slime", spriteSheetSlime, {
      frameWidth: 16,
      frameHeight: 16,
    });
    this.load.spritesheet("flam", spriteSheetFlam, {
      frameWidth: 16,
      frameHeight: 16,
    });
    this.load.spritesheet("octopus", spriteSheetOctopus, {
      frameWidth: 16,
      frameHeight: 16,
    });
    this.load.spritesheet("beast", spriteSheetBeast, {
      frameWidth: 16,
      frameHeight: 16,
    });
    this.load.spritesheet("sam", spriteSheetRedNinja3, {
      frameWidth: 16,
      frameHeight: 16,
    });
    this.load.spritesheet("panda", spriteSheetPanda, {
      frameWidth: 16,
      frameHeight: 16,
    });
    this.load.spritesheet("trex", spriteSheetTrex, {
      frameWidth: 16,
      frameHeight: 16,
    });
    this.load.spritesheet("items", tilesetItems, {
      frameWidth: 16,
      frameHeight: 16,
    });
    this.load.spritesheet("lightning", spriteSheetLightning, {
      frameWidth: 20,
      frameHeight: 28,
    });
    this.load.spritesheet("spark", spriteSheetSpark, {
      frameWidth: 30,
      frameHeight: 35,
    });
    this.load.spritesheet("aura", spriteSheetAura, {
      frameWidth: 25,
      frameHeight: 24,
    });
    this.load.spritesheet("smoke", spriteSheetSmoke, {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet("ice", spriteSheetIce, {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet("shadow", spriteSheetShadow, {
      frameWidth: 16,
      frameHeight: 16,
    });
    this.load.spritesheet("chest", spriteSheetChest, {
      frameWidth: 16,
      frameHeight: 16,
    });
    this.load.spritesheet("crystal", spriteSheetCrystal, {
      frameWidth: 16,
      frameHeight: 16,
    });
    this.load.spritesheet("font", spriteSheetFont, {
      frameWidth: 8,
      frameHeight: 8,
    });
    this.load.image("start-bg", startBackground);
    this.load.image("red-sam", redSam);
    this.load.image("click-to-start", clickToStart);
    this.load.image("laser", laser);
    this.load.image("sword", sword);
  }

  create() {
    const { width, height } = this.scale;
    this.add.image(width / 2, height / 2, "start-bg");
    const redSam = this.add.image(width / 2, height / 2, "red-sam");
    const start = this.add.image(width / 2, height / 2, "click-to-start");
    this.tweens.add({
      targets: start,
      alpha: 0.5,
      duration: 100,
      ease: "Sine.easeInOut",
      yoyo: true,
      repeat: -1,
    });
    this.input.once("pointerdown", () => {
      // Uncomment for intro
      this.scene.start("Game");
      start.destroy();
      this.sound.play("slash");
      var faded = false;
      this.tweens.add({
        targets: redSam,
        y: 450,
        scale: 5,
        alpha: 0,
        duration: 1500,
        ease: "Sine.easeOut",
        onUpdate: (tween) => {
          if (tween.progress > 0.5) {
            if (!faded) {
              faded = true;
              this.sound.play("slash-reverse");
              this.tweens.add({
                targets: this.cameras.main,
                zoom: 50,
                scrollY: -50,
                alpha: 0,
                duration: 1000,
                ease: "Sine.easeInOut",
                onComplete: () => {
                  redSam.destroy();
                  this.time.delayedCall(500, () => {
                    this.scene.start("Game");
                  });
                },
              });
            }
          }
        },
      });
    });

    this.anims.create({
      key: "sam-idle-down",
      frames: this.anims.generateFrameNumbers("sam", {
        frames: [0],
      }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: "sam-walk-down",
      frames: this.anims.generateFrameNumbers("sam", {
        frames: [0, 4, 8, 12],
      }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: "sam-idle-up",
      frames: this.anims.generateFrameNumbers("sam", {
        frames: [1],
      }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: "sam-walk-up",
      frames: this.anims.generateFrameNumbers("sam", {
        frames: [1, 5, 9, 13],
      }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: "sam-idle-left",
      frames: this.anims.generateFrameNumbers("sam", {
        frames: [2],
      }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: "sam-walk-left",
      frames: this.anims.generateFrameNumbers("sam", {
        frames: [2, 6, 10, 14],
      }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: "sam-idle-right",
      frames: this.anims.generateFrameNumbers("sam", {
        frames: [3],
      }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: "sam-walk-right",
      frames: this.anims.generateFrameNumbers("sam", {
        frames: [3, 7, 11, 15],
      }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: "sam-celebrate",
      frames: this.anims.generateFrameNumbers("sam", {
        frames: [24, 25, 24, 25, 26, 27],
      }),
      frameRate: 5,
      repeat: 0,
    });
    this.anims.create({
      key: "panda-idle-down",
      frames: this.anims.generateFrameNumbers("panda", {
        frames: [0],
      }),
    });
    this.anims.create({
      key: "panda-walk-down",
      frames: this.anims.generateFrameNumbers("panda", {
        frames: [0, 4, 8, 12],
      }),
      frameRate: 5,
      repeat: -1,
    });
    this.anims.create({
      key: "panda-idle-up",
      frames: this.anims.generateFrameNumbers("panda", {
        frames: [1],
      }),
    });
    this.anims.create({
      key: "panda-walk-up",
      frames: this.anims.generateFrameNumbers("panda", {
        frames: [1, 5, 9, 13],
      }),
      frameRate: 5,
      repeat: -1,
    });
    this.anims.create({
      key: "panda-idle-left",
      frames: this.anims.generateFrameNumbers("panda", {
        frames: [2],
      }),
    });
    this.anims.create({
      key: "panda-walk-left",
      frames: this.anims.generateFrameNumbers("panda", {
        frames: [2, 6, 10, 14],
      }),
      frameRate: 5,
      repeat: -1,
    });
    this.anims.create({
      key: "panda-idle-right",
      frames: this.anims.generateFrameNumbers("panda", {
        frames: [3],
      }),
    });
    this.anims.create({
      key: "panda-walk-right",
      frames: this.anims.generateFrameNumbers("panda", {
        frames: [3, 7, 11, 15],
      }),
      frameRate: 5,
      repeat: -1,
    });
    this.anims.create({
      key: "trex-idle-down",
      frames: this.anims.generateFrameNumbers("trex", {
        frames: [0],
      }),
    });
    this.anims.create({
      key: "trex-walk-down",
      frames: this.anims.generateFrameNumbers("trex", {
        frames: [0, 4, 8, 12],
      }),
      frameRate: 5,
      repeat: -1,
    });
    this.anims.create({
      key: "trex-idle-up",
      frames: this.anims.generateFrameNumbers("trex", {
        frames: [1],
      }),
    });
    this.anims.create({
      key: "trex-walk-up",
      frames: this.anims.generateFrameNumbers("trex", {
        frames: [1, 5, 9, 13],
      }),
      frameRate: 5,
      repeat: -1,
    });
    this.anims.create({
      key: "trex-idle-left",
      frames: this.anims.generateFrameNumbers("trex", {
        frames: [2],
      }),
    });
    this.anims.create({
      key: "trex-walk-left",
      frames: this.anims.generateFrameNumbers("trex", {
        frames: [2, 6, 10, 14],
      }),
      frameRate: 5,
      repeat: -1,
    });
    this.anims.create({
      key: "trex-idle-right",
      frames: this.anims.generateFrameNumbers("trex", {
        frames: [3],
      }),
    });
    this.anims.create({
      key: "trex-walk-right",
      frames: this.anims.generateFrameNumbers("trex", {
        frames: [3, 7, 11, 15],
      }),
      frameRate: 5,
      repeat: -1,
    });
    this.anims.create({
      key: "dragon-idle",
      frames: this.anims.generateFrameNumbers("dragon", {
        frames: [0, 4, 8, 12, 2, 6, 10, 14],
      }),
      frameRate: 5,
      repeat: -1,
    });
    this.anims.create({
      key: "dragon-frozen",
      frames: this.anims.generateFrameNumbers("dragon", {
        frames: [0],
      }),
    });
    this.anims.create({
      key: "cyclope-down-closed",
      frames: this.anims.generateFrameNumbers("cyclope", {
        frames: [0],
      }),
    });
    this.anims.create({
      key: "cyclope-up-closed",
      frames: this.anims.generateFrameNumbers("cyclope", {
        frames: [1],
      }),
    });
    this.anims.create({
      key: "cyclope-left-closed",
      frames: this.anims.generateFrameNumbers("cyclope", {
        frames: [2],
      }),
    });
    this.anims.create({
      key: "cyclope-right-closed",
      frames: this.anims.generateFrameNumbers("cyclope", {
        frames: [3],
      }),
    });
    this.anims.create({
      key: "cyclope-down-open",
      frames: this.anims.generateFrameNumbers("cyclope", {
        frames: [4],
      }),
    });
    this.anims.create({
      key: "cyclope-up-open",
      frames: this.anims.generateFrameNumbers("cyclope", {
        frames: [5],
      }),
    });
    this.anims.create({
      key: "cyclope-left-open",
      frames: this.anims.generateFrameNumbers("cyclope", {
        frames: [6],
      }),
    });
    this.anims.create({
      key: "cyclope-right-open",
      frames: this.anims.generateFrameNumbers("cyclope", {
        frames: [7],
      }),
    });
    this.anims.create({
      key: "slime-bounce",
      frames: this.anims.generateFrameNumbers("slime", {
        frames: [1, 5, 9, 13],
      }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: "slime-frozen",
      frames: this.anims.generateFrameNumbers("slime", {
        frames: [9],
      }),
    });
    this.anims.create({
      key: "flam-idle",
      frames: this.anims.generateFrameNumbers("flam", {
        start: 0,
        end: 3,
      }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: "flam-pursue",
      frames: this.anims.generateFrameNumbers("flam", {
        start: 4,
        end: 7,
      }),
      frameRate: 20,
      repeat: -1,
    });
    this.anims.create({
      key: "flam-frozen",
      frames: this.anims.generateFrameNumbers("flam", {
        start: 0,
        end: 0,
      }),
    });
    this.anims.create({
      key: "octopus-happy",
      frames: this.anims.generateFrameNumbers("octopus", {
        frames: [0, 4, 8, 12],
      }),
      frameRate: 5,
      repeat: -1,
    });
    this.anims.create({
      key: "octopus-angry",
      frames: this.anims.generateFrameNumbers("octopus", {
        frames: [1],
      }),
      frameRate: 7,
      repeat: -1,
    });
    this.anims.create({
      key: "beast-idle",
      frames: this.anims.generateFrameNumbers("beast", {
        frames: [0],
      }),
    });
    this.anims.create({
      key: "beast-walk",
      frames: this.anims.generateFrameNumbers("beast", {
        frames: [0, 4, 8, 12],
      }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: "spark",
      frames: this.anims.generateFrameNumbers("spark", {
        start: 0,
        end: 8,
      }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: "lightning",
      frames: this.anims.generateFrameNumbers("lightning", {
        start: 0,
        end: 7,
      }),
      frameRate: 20,
      repeat: -1,
    });
    this.anims.create({
      key: "ice",
      frames: this.anims.generateFrameNumbers("ice", {
        start: 0,
        end: 2,
      }),
      frameRate: 10,
      repeat: 0,
    });
    this.anims.create({
      key: "shadow",
      frames: this.anims.generateFrameNumbers("shadow", {
        start: 0,
        end: 4,
      }),
      frameRate: 10,
    });
    this.anims.create({
      key: "aura",
      frames: this.anims.generateFrameNumbers("aura", {
        start: 0,
        end: 4,
      }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: "smoke",
      frames: this.anims.generateFrameNumbers("smoke", {
        start: 0,
        end: 5,
      }),
      frameRate: 10,
      repeat: 0,
    });
    this.anims.create({
      key: "chest-closed",
      frames: this.anims.generateFrameNumbers("chest", {
        start: 0,
        end: 0,
      }),
      frameRate: 10,
    });
    this.anims.create({
      key: "chest-sparkling",
      frames: this.anims.generateFrameNumbers("chest", {
        start: 1,
        end: 1,
      }),
      frameRate: 10,
    });
    this.anims.create({
      key: "chest-collected",
      frames: this.anims.generateFrameNumbers("chest", {
        start: 2,
        end: 2,
      }),
      frameRate: 10,
    });
  }
}
