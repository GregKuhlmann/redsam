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
import desert9 from "/assets/maps/desert9.json";
import desert10 from "/assets/maps/desert10.json";
import snow1 from "/assets/maps/snow1.json";
import snow2 from "/assets/maps/snow2.json";
import snow3 from "/assets/maps/snow3.json";
import snow4 from "/assets/maps/snow4.json";
import snow5 from "/assets/maps/snow5.json";
import snow6 from "/assets/maps/snow6.json";
import snow7 from "/assets/maps/snow7.json";
import snow8 from "/assets/maps/snow8.json";
import snow9 from "/assets/maps/snow9.json";
import snow10 from "/assets/maps/snow10.json";
import moon1 from "/assets/maps/moon1.json";
import moon2 from "/assets/maps/moon2.json";
import moon3 from "/assets/maps/moon3.json";
import moon4 from "/assets/maps/moon4.json";
import moon5 from "/assets/maps/moon5.json";
import moon6 from "/assets/maps/moon6.json";
import moon7 from "/assets/maps/moon7.json";
import moon8 from "/assets/maps/moon8.json";
import moon9 from "/assets/maps/moon9.json";
import moon10 from "/assets/maps/moon10.json";
import ice1 from "/assets/maps/ice1.json";
import ice2 from "/assets/maps/ice2.json";
import ice3 from "/assets/maps/ice3.json";
import ice4 from "/assets/maps/ice4.json";
import ice5 from "/assets/maps/ice5.json";
import ice6 from "/assets/maps/ice6.json";
import ice7 from "/assets/maps/ice7.json";
import ice8 from "/assets/maps/ice8.json";
import ice9 from "/assets/maps/ice9.json";
import ice10 from "/assets/maps/ice10.json";
import lake1 from "/assets/maps/lake1.json";
import lake2 from "/assets/maps/lake2.json";
import lake3 from "/assets/maps/lake3.json";
import lake4 from "/assets/maps/lake4.json";
import lake5 from "/assets/maps/lake5.json";
import lake6 from "/assets/maps/lake6.json";
import lake7 from "/assets/maps/lake7.json";
import tilesetHouse from "/assets/maps/tilesets/TilesetHouse.png";
import tilesetNature from "/assets/maps/tilesets/TilesetNature.png";
import tilesetWater from "/assets/maps/tilesets/TilesetWater.png";
import tilesetItems from "/assets/maps/tilesets/TilesetItems.png";
import tilesetGUI from "/assets/maps/tilesets/TilesetGUI.png";

import spriteSheetRedNinja3 from "/assets/sprites/spriteSheetRedNinja3.png";
import spriteSheetPanda from "/assets/sprites/spriteSheetPanda.png";
import spriteSheetTrex from "/assets/sprites/spriteSheetTrex.png";
import spriteSheetDragon from "/assets/sprites/spriteSheetDragon.png";
import spriteSheetCyclope from "/assets/sprites/spriteSheetCyclope.png";
import spriteSheetSlime from "/assets/sprites/spriteSheetSlime.png";
import spriteSheetFlam from "/assets/sprites/spriteSheetFlam.png";
import spriteSheetOctopus from "/assets/sprites/spriteSheetOctopus.png";
import spriteSheetBeast from "/assets/sprites/spriteSheetBeast.png";
import spriteSheetLightning from "/assets/sprites/spriteSheetLightning.png";
import spriteSheetSpark from "/assets/sprites/spriteSheetSpark.png";
import spriteSheetAura from "/assets/sprites/spriteSheetAura.png";
import spriteSheetSmoke from "/assets/sprites/spriteSheetSmoke.png";
import spriteSheetIce from "/assets/sprites/spriteSheetIce.png";
import spriteSheetShadow from "/assets/sprites/spriteSheetShadow.png";
import spriteSheetChest from "/assets/sprites/spriteSheetChest.png";
import spriteSheetArrow from "/assets/sprites/spriteSheetArrow.png";
import spriteSheetLadder from "/assets/sprites/spriteSheetLadder.png";
import spriteSheetCrystal from "/assets/sprites/spriteSheetCrystal.png";
import spriteSheetFont from "/assets/sprites/spriteSheetFont.png";

import audioGlow from "/assets/audio/glow.mp3";
import audioArrow from "/assets/audio/Magic2.wav";
import audioExplosion from "/assets/audio/Fire3.wav";
import audioCollect from "/assets/audio/PowerUp1.wav";
import audioChestOpen from "/assets/audio/Bonus.wav";
import audioCelebrate from "/assets/audio/Bonus3.wav";
import audioStep from "/assets/audio/Grass2.wav";
import audioSlash from "/assets/audio/Slash2.wav";
import audioSlashReverse from "/assets/audio/Slash2Reverse.mp3";
import audioHammer from "/assets/audio/Hit8.wav";
import audioFreeze from "/assets/audio/Water9.wav";
import audioJettison from "/assets/audio/Magic3.wav";
import audioKilled from "/assets/audio/Impact2.wav";
import audioGameOver from "/assets/audio/GameOver.wav";
import audioLaser from "/assets/audio/Slash5.wav";
import audioMainTheme from "/assets/audio/windmill-hut.mp3";
import audioEnding from "/assets/audio/redsam-ending.mp3";

import startBackground from "/assets/images/start-bg.png";
import redSam from "/assets/images/red-sam.png";
import clickToStart from "/assets/images/click-to-start.png";
import laser from "/assets/images/laser.png";
import sword from "/assets/images/big-sword.png";

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
    this.load.audio("glow", audioGlow);
    this.load.audio("arrow", audioArrow);
    this.load.audio("explosion", audioExplosion);
    this.load.audio("collect", audioCollect);
    this.load.audio("chestOpen", audioChestOpen);
    this.load.audio("celebrate", audioCelebrate);
    this.load.audio("step", audioStep);
    this.load.audio("slash", audioSlash);
    this.load.audio("slash-reverse", audioSlashReverse);
    this.load.audio("hammer", audioHammer);
    this.load.audio("freeze", audioFreeze);
    this.load.audio("jettison", audioJettison);
    this.load.audio("killed", audioKilled);
    this.load.audio("game-over", audioGameOver);
    this.load.audio("laser", audioLaser);
    this.load.audio("main-theme", audioMainTheme);
    this.load.audio("ending", audioEnding);
    this.load.tilemapTiledJSON("desert1", desert1);
    this.load.tilemapTiledJSON("desert2", desert2);
    this.load.tilemapTiledJSON("desert3", desert3);
    this.load.tilemapTiledJSON("desert4", desert4);
    this.load.tilemapTiledJSON("desert5", desert5);
    this.load.tilemapTiledJSON("desert6", desert6);
    this.load.tilemapTiledJSON("desert7", desert7);
    this.load.tilemapTiledJSON("desert8", desert8);
    this.load.tilemapTiledJSON("desert9", desert9);
    this.load.tilemapTiledJSON("desert10", desert10);
    this.load.tilemapTiledJSON("snow1", snow1);
    this.load.tilemapTiledJSON("snow2", snow2);
    this.load.tilemapTiledJSON("snow3", snow3);
    this.load.tilemapTiledJSON("snow4", snow4);
    this.load.tilemapTiledJSON("snow5", snow5);
    this.load.tilemapTiledJSON("snow6", snow6);
    this.load.tilemapTiledJSON("snow7", snow7);
    this.load.tilemapTiledJSON("snow8", snow8);
    this.load.tilemapTiledJSON("snow9", snow9);
    this.load.tilemapTiledJSON("snow10", snow10);
    this.load.tilemapTiledJSON("moon1", moon1);
    this.load.tilemapTiledJSON("moon2", moon2);
    this.load.tilemapTiledJSON("moon3", moon3);
    this.load.tilemapTiledJSON("moon4", moon4);
    this.load.tilemapTiledJSON("moon5", moon5);
    this.load.tilemapTiledJSON("moon6", moon6);
    this.load.tilemapTiledJSON("moon7", moon7);
    this.load.tilemapTiledJSON("moon8", moon8);
    this.load.tilemapTiledJSON("moon9", moon9);
    this.load.tilemapTiledJSON("moon10", moon10);
    this.load.tilemapTiledJSON("ice1", ice1);
    this.load.tilemapTiledJSON("ice2", ice2);
    this.load.tilemapTiledJSON("ice3", ice3);
    this.load.tilemapTiledJSON("ice4", ice4);
    this.load.tilemapTiledJSON("ice5", ice5);
    this.load.tilemapTiledJSON("ice6", ice6);
    this.load.tilemapTiledJSON("ice7", ice7);
    this.load.tilemapTiledJSON("ice8", ice8);
    this.load.tilemapTiledJSON("ice9", ice9);
    this.load.tilemapTiledJSON("ice10", ice10);
    this.load.tilemapTiledJSON("lake1", lake1);
    this.load.tilemapTiledJSON("lake2", lake2);
    this.load.tilemapTiledJSON("lake3", lake3);
    this.load.tilemapTiledJSON("lake4", lake4);
    this.load.tilemapTiledJSON("lake5", lake5);
    this.load.tilemapTiledJSON("lake6", lake6);
    this.load.tilemapTiledJSON("lake7", lake7);
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
    this.load.spritesheet("arrow", spriteSheetArrow, {
      frameWidth: 16,
      frameHeight: 16,
    });
    this.load.spritesheet("ladder", spriteSheetLadder, {
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
      key: "cyclope-blink",
      frames: this.anims.generateFrameNumbers("cyclope", {
        frames: [4, 4, 4, 4, 4, 4, 0],
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
        frames: [0],
      }),
    });
    this.anims.create({
      key: "chest-sparkling",
      frames: this.anims.generateFrameNumbers("chest", {
        frames: [1],
      }),
    });
    this.anims.create({
      key: "chest-collected",
      frames: this.anims.generateFrameNumbers("chest", {
        frames: [2],
      }),
    });
    this.anims.create({
      key: "arrow-right",
      frames: this.anims.generateFrameNumbers("arrow", {
        frames: [0],
      }),
    });
    this.anims.create({
      key: "arrow-left",
      frames: this.anims.generateFrameNumbers("arrow", {
        frames: [1],
      }),
    });
    this.anims.create({
      key: "arrow-up",
      frames: this.anims.generateFrameNumbers("arrow", {
        frames: [2],
      }),
    });
    this.anims.create({
      key: "arrow-down",
      frames: this.anims.generateFrameNumbers("arrow", {
        frames: [3],
      }),
    });
    this.anims.create({
      key: "ladder-vertical",
      frames: this.anims.generateFrameNumbers("ladder", {
        frames: [0],
      }),
    });
    this.anims.create({
      key: "ladder-horizontal",
      frames: this.anims.generateFrameNumbers("ladder", {
        frames: [1],
      }),
    });
  }
}
