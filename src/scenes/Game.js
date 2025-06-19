import * as Phaser from "phaser";

import GrayscalePipeline from "/src/shaders/grayscale.js";
import ShadowPipeline from "/src/shaders/shadow.js";

import easystarjs from "easystarjs";

import desert1 from "/assets/maps/desert1.json";
import desert2 from "/assets/maps/desert2.json";
import desert3 from "/assets/maps/desert3.json";
import tilesetHouse from "/assets/Ninja/Backgrounds/Tilesets/TilesetHouse.png";
import tilesetNature from "/assets/Ninja/Backgrounds/Tilesets/TilesetNature.png";
import tilesetWater from "/assets/Ninja/Backgrounds/Tilesets/TilesetWater.png";
import tilesetItems from "/assets/Ninja/TilesetItems.png";
import tilesetGUI from "/assets/Ninja/TilesetGUI.png";
import spriteSheetRedNinja3 from "/assets/Ninja/Actor/Characters/RedNinja3/SpriteSheet.png";
import spriteSheetDragon from "/assets/Ninja/Actor/Monsters/Dragon/SpriteSheet.png";
import spriteSheetCyclope from "/assets/Ninja/Actor/Monsters/Cyclope/SpriteSheet.png";
import spriteSheetSlime from "/assets/Ninja/Actor/Monsters/Slime/Slime.png";
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

const TILESIZE = 16;

const MAPS = ["desert3", "desert1", "desert2"];

export class Game extends Phaser.Scene {
  constructor() {
    super("Game");
  }

  init(data) {
    this.map = data.map || MAPS[0];
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
    this.load.tilemapTiledJSON("desert1", desert1);
    this.load.tilemapTiledJSON("desert2", desert2);
    this.load.tilemapTiledJSON("desert3", desert3);
    this.game.renderer.pipelines.add(
      "Grayscale",
      new GrayscalePipeline(this.game)
    );
    this.game.renderer.pipelines.add("Shadow", new ShadowPipeline(this.game));
    this.load.spritesheet("dragon", spriteSheetDragon, {
      frameWidth: TILESIZE,
      frameHeight: TILESIZE,
    });
    this.load.spritesheet("cyclope", spriteSheetCyclope, {
      frameWidth: TILESIZE,
      frameHeight: TILESIZE,
    });
    this.load.spritesheet("slime", spriteSheetSlime, {
      frameWidth: TILESIZE,
      frameHeight: TILESIZE,
    });
    this.load.spritesheet("sam", spriteSheetRedNinja3, {
      frameWidth: TILESIZE,
      frameHeight: TILESIZE,
    });
    this.load.spritesheet("items", tilesetItems, {
      frameWidth: TILESIZE,
      frameHeight: TILESIZE,
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
      frameWidth: TILESIZE,
      frameHeight: TILESIZE,
    });
    this.load.spritesheet("crystal", spriteSheetCrystal, {
      frameWidth: 16,
      frameHeight: 16,
    });
    this.load.spritesheet("font", spriteSheetFont, {
      frameWidth: 8,
      frameHeight: 8,
    });
  }

  create() {
    //const { width, height } = this.scale;

    this.level = this.make.tilemap({ key: this.map });
    const tilesetHouse = this.level.addTilesetImage(
      "TilesetHouse",
      "tilesetHouse"
    );
    const tilesetNature = this.level.addTilesetImage(
      "TilesetNature",
      "tilesetNature"
    );
    const tilesetWater = this.level.addTilesetImage(
      "TilesetWater",
      "tilesetWater"
    );
    const tilesetGUI = this.level.addTilesetImage("TilesetGUI", "tilesetGUI");
    const tilesetItems = this.level.addTilesetImage(
      "TilesetItems",
      "tilesetItems"
    );
    const tilesets = [
      tilesetHouse,
      tilesetNature,
      tilesetWater,
      tilesetGUI,
      tilesetItems,
    ];

    this.level.createLayer("LayerBackground", tilesets, 0, 0);
    this.level.createLayer("LayerDecorations", tilesets, 0, 0);
    this.level
      .createLayer("LayerObstacles", tilesets, 0, 0)
      .setCollisionBetween(1, 1000);

    this.textLives = this.add.sprite(296, 82, "font").setOrigin(0);
    this.textAmmo = this.add.sprite(296, 114, "font").setOrigin(0);

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
      frameRate: 8,
      repeat: -1,
    });
    this.anims.create({
      key: "slime-frozen",
      frames: this.anims.generateFrameNumbers("slime", {
        frames: [9],
      }),
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

    this.dragons = [];
    this.cyclopes = [];
    this.slimes = [];
    this.crystals = [];
    this.blocks = [];
    this.crystalsRemaining = 0;
    this.lives = 5;
    this.textLives.setFrame(this.lives);
    this.ammo = 0;
    this.textAmmo.setFrame(this.ammo);

    // iterate over the key, value pairs in the tilesetItems.tileProperties
    this.level.getLayer("LayerItems").data.forEach((row) => {
      row.forEach((tile) => {
        if (tile.index !== -1) {
          const name = tilesetItems.getTileProperties(tile.index)?.name;
          if (name === "sam") {
            const sprite = this.add
              .sprite(tile.x * TILESIZE, tile.y * TILESIZE, "sam")
              .setOrigin(0);
            const aura = this.add
              .sprite(tile.x * TILESIZE, tile.y * TILESIZE, "aura")
              .setScale(16 / 25)
              .setOrigin(0)
              .setAlpha(0)
              .play("aura");
            this.sam = {
              x: tile.x,
              y: tile.y,
              sprite,
              aura,
              moving: false,
              direction: "down",
              chargeTween: null,
            };
          } else if (name === "dragon") {
            const sprite = this.add
              .sprite(tile.x * TILESIZE, tile.y * TILESIZE, "dragon")
              .setOrigin(0)
              .play("dragon-idle");
            this.dragons.push({
              x: tile.x,
              y: tile.y,
              sprite,
              state: "idle",
            });
          } else if (name.startsWith("cyclope")) {
            const direction = name.split("-")[1];
            const sprite = this.add
              .sprite(tile.x * TILESIZE, tile.y * TILESIZE, "cyclope")
              .setOrigin(0)
              .play(`cyclope-${direction}-closed`);
            this.cyclopes.push({
              x: tile.x,
              y: tile.y,
              sprite,
              state: "closed",
              direction,
            });
          } else if (name.startsWith("slime")) {
            const finder = new easystarjs.js();
            finder.setAcceptableTiles([0]);
            this.setGrid(finder);
            const sprite = this.add
              .sprite(tile.x * TILESIZE, tile.y * TILESIZE, "slime")
              .setOrigin(0)
              .play("slime-bounce");
            const ice = this.add
              .sprite(tile.x * TILESIZE, tile.y * TILESIZE, "ice")
              .setScale(16 / 32)
              .setOrigin(0)
              .setVisible(false)
              .play("ice");
            this.slimes.push({
              x: tile.x,
              y: tile.y,
              sprite,
              ice,
              state: "bouncing",
              moving: false,
              finder,
            });
          } else if (name === "door") {
            const sprite = this.add
              .sprite(tile.x * TILESIZE, tile.y * TILESIZE, "items")
              .setFrame(tile.index - tilesetItems.firstgid)
              .setOrigin(0);
            this.door = { x: tile.x, y: tile.y, sprite, state: "closed" };
          } else if (name === "block") {
            const sprite = this.add
              .sprite(tile.x * TILESIZE, tile.y * TILESIZE, "items")
              .setFrame(tile.index - tilesetItems.firstgid)
              .setOrigin(0);
            this.blocks.push({ x: tile.x, y: tile.y, sprite });
          } else if (name.startsWith("crystal")) {
            const ammo = parseInt(name.split("-")[1], 10);
            const sprite = this.add
              .sprite(tile.x * TILESIZE, tile.y * TILESIZE, "crystal")
              .setOrigin(0);
            const spark = this.add
              .sprite(tile.x * TILESIZE, tile.y * TILESIZE, "spark")
              .setScale(16 / 35)
              .setOrigin(0)
              .play({
                key: "spark",
                repeatDelay: Phaser.Math.Between(500, 1500),
              });
            this.crystals.push({
              x: tile.x,
              y: tile.y,
              sprite,
              spark,
              ammo,
              state: "uncollected",
            });
            this.crystalsRemaining++;
          } else if (name === "chest") {
            const sprite = this.add
              .sprite(tile.x * TILESIZE, tile.y * TILESIZE, "chest")
              .setOrigin(0)
              .play("chest-closed");
            const spark = this.add
              .sprite(tile.x * TILESIZE, tile.y * TILESIZE, "spark")
              .setScale(16 / 35)
              .setOrigin(0)
              .setVisible(false)
              .play("spark");
            this.chest = {
              x: tile.x,
              y: tile.y,
              sprite,
              spark,
              state: "closed",
            };
          } else {
            console.error(
              `Unknown tile at (${tile.x}, ${tile.y}) with index ${tile.index} and name ${name}`
            );
          }
        }
      });
    });

    this.slimes.forEach((slime) => {
      slime.finder.findPath(
        slime.x,
        slime.y,
        this.sam.x,
        this.sam.y,
        (path) => {
          this.setPath(slime, path);
        }
      );
      slime.finder.calculate();
    });

    this.enemies = [...this.dragons, ...this.cyclopes, ...this.slimes];

    this.sam.sprite.setDepth(1000);
    this.sam.aura.setDepth(1001);
    this.cursors = this.input.keyboard.createCursorKeys();
    this.input.keyboard.on("keydown-SPACE", () => {
      if (this.sam.chargeTween) return;
      this.sam.chargeTween = this.tweens.add({
        targets: this.sam.aura,
        alpha: 1,
        duration: 500,
        ease: "Power2",
      });
    });
    this.input.keyboard.on("keyup-SPACE", () => {
      if (this.sam.chargeTween) {
        this.sam.chargeTween.destroy();
        this.sam.chargeTween = null;
        this.sam.aura.setAlpha(0);
      }
      this.shoot();
    });
  }

  update() {
    if (this.cursors.left.isDown) {
      this.move(-1, 0, "left");
    } else if (this.cursors.right.isDown) {
      this.move(1, 0, "right");
    } else if (this.cursors.up.isDown) {
      this.move(0, -1, "up");
    } else if (this.cursors.down.isDown) {
      this.move(0, 1, "down");
    } else if (!this.sam.moving) {
      this.sam.sprite.play(`sam-idle-${this.sam.direction}`);
    }

    this.slimes.forEach((slime) => {
      if (!slime.moving) {
        slime.finder.findPath(
          slime.x,
          slime.y,
          this.sam.x,
          this.sam.y,
          (path) => {
            this.setPath(slime, path);
          }
        );
        slime.finder.calculate();
      }
    });
  }

  setGrid(finder) {
    var grid = [];
    for (var y = 0; y < this.level.height; y++) {
      var col = [];
      for (var x = 0; x < this.level.width; x++) {
        const tile = this.level.getTileAt(x, y, true, "LayerObstacles");
        if (tile.index !== -1 || this.outOfBounds(x, y)) {
          col.push(1);
        } else {
          col.push(0);
        }
      }
      grid.push(col);
    }
    finder.setGrid(grid);
  }

  setPath(enemy, path) {
    if (!path || path.length < 2) {
      enemy.moving = false;
      return;
    }
    path.shift(); // remove the first point (the enemy's current position)
    enemy.moving = true;
    const next = path.shift();
    console.log(
      `Moving ${enemy.sprite.texture.key} from (${enemy.x}, ${enemy.y}) to (${next.x}, ${next.y})`
    );
    if (enemy.x === 14 && enemy.y === 7) {
      enemy.state = "frozen";
      enemy.ice.setPosition(enemy.sprite.x, enemy.sprite.y);
      enemy.ice.setVisible(true);
      enemy.sprite.play("slime-frozen");
      return;
    }
    this.tweens.add({
      targets: enemy.sprite,
      x: next.x * TILESIZE,
      y: next.y * TILESIZE,
      duration: 500,
      onComplete: () => {
        enemy.x = next.x;
        enemy.y = next.y;
        enemy.moving = false;
      },
    });
  }

  shoot() {
    if (this.ammo <= 0) return;
    this.ammo--;
    this.textAmmo.setFrame(this.ammo);
    this.dragons.forEach((dragon) => {
      if (dragon.state == "frozen") {
        this.destroy(dragon);
      } else {
        dragon.state = "frozen";
        dragon.sprite.play("dragon-frozen");
        dragon.sprite.setPipeline("Grayscale");
      }
    });
  }

  destroy(enemy) {
    const smoke = this.add
      .sprite(enemy.sprite.x, enemy.sprite.y, "smoke")
      .setScale(16 / 32)
      .setOrigin(0)
      .play("smoke");
    smoke.on("animationupdate", (animation, frame) => {
      if (frame.index === 3) {
        enemy.state = "destroyed";
        enemy.sprite.setVisible(false);
        if (enemy.ice) {
          enemy.ice.setVisible(false);
        }
      }
    });
    smoke.on("animationcomplete", () => {
      smoke.destroy();
      // wait 9 seconds then respawn the enemy
      this.time.delayedCall(9000, () => {
        if (this.chest.state !== "collected") {
          enemy.sprite.setPipeline("Shadow");
          enemy.sprite.setVisible(true);
          this.time.delayedCall(1000, () => {
            enemy.sprite.resetPipeline();
            enemy.sprite.play("dragon-idle");
            enemy.state = "idle";
          });
        }
      });
    });
  }

  move(dx, dy, direction) {
    if (this.sam.moving) return;
    this.sam.direction = direction;
    this.sam.sprite.play(`sam-walk-${direction}`, true);

    const pushed = this.pushable(dx, dy);
    if (pushed && this.collides(pushed, dx, dy, true)) return;
    if (!pushed && this.collides(this.sam, dx, dy)) return;

    this.sam.moving = true;
    this.sound.play("step");
    const shadow = this.add
      .sprite(this.sam.x * TILESIZE, this.sam.y * TILESIZE, "shadow")
      .setOrigin(0)
      .setAlpha(0.2)
      .play("shadow");
    shadow.on("animationcomplete", () => {
      shadow.destroy();
    });
    this.tweens.add({
      targets: this.sam.sprite,
      x: this.sam.sprite.x + dx * TILESIZE,
      y: this.sam.sprite.y + dy * TILESIZE,
      duration: 200,
      onUpdate: () => {
        this.sam.aura.setPosition(this.sam.sprite.x, this.sam.sprite.y);
        if (pushed) {
          pushed.sprite.x = this.sam.sprite.x + dx * TILESIZE;
          pushed.sprite.y = this.sam.sprite.y + dy * TILESIZE;
        }
      },
      onComplete: () => {
        this.sam.x += dx;
        this.sam.y += dy;
        if (pushed) {
          pushed.x += dx;
          pushed.y += dy;
        }
        this.sam.moving = false;

        if (this.door.x == this.sam.x && this.door.y == this.sam.y) {
          this.sam.moving = true;
          this.tweens.killAll();
          this.sound.play("celebrate");
          this.sam.sprite.play("sam-celebrate");
          this.sam.aura.setVisible(false);
          this.sam.sprite.on("animationcomplete", (animation) => {
            if (animation.key === "sam-celebrate") {
              this.cameras.main.fadeOut(500, 0, 0, 0); // duration in ms, RGB fade color
            }
          });
          this.cameras.main.once("camerafadeoutcomplete", () => {
            this.anims.resumeAll();
            this.scene.restart({ map: MAPS[MAPS.indexOf(this.map) + 1] });
          });
        }
        if (
          this.chest.x == this.sam.x &&
          this.chest.y == this.sam.y &&
          this.chest.state === "sparkling"
        ) {
          this.chest.state = "collected";
          this.chest.sprite.play("chest-collected");
          this.chest.spark.setVisible(false);
          this.cameras.main.shake(200, 0.01);
          this.sound.play("explosion");
          const smoke = this.add
            .sprite(this.door.x * TILESIZE, this.door.y * TILESIZE, "smoke")
            .setScale(16 / 32)
            .setOrigin(0)
            .play("smoke");
          smoke.on("animationupdate", (animation, frame) => {
            if (frame.index === 3) {
              this.door.state = "open";
              this.door.sprite.destroy();
            }
          });
          smoke.on("animationcomplete", () => {
            smoke.destroy();
          });
          this.enemies.forEach((enemy) => {
            if (enemy.state !== "destroyed") {
              this.destroy(enemy);
            }
          });
        }
        this.crystals.forEach((crystal) => {
          if (
            crystal.x == this.sam.x &&
            crystal.y == this.sam.y &&
            crystal.state === "uncollected"
          ) {
            crystal.state = "collected";
            this.sound.play("collect");
            crystal.sprite.destroy();
            crystal.spark.destroy();
            this.crystalsRemaining--;
            this.ammo = Math.min(2, this.ammo + crystal.ammo);
            this.textAmmo.setFrame(this.ammo);
            if (this.crystalsRemaining == 0) {
              this.sound.play("chestOpen");
              this.chest.state = "sparkling";
              this.chest.sprite.play("chest-sparkling");
              this.chest.spark.setVisible(true);
              this.cyclopes.forEach((cyclope) => {
                cyclope.state = "open";
                cyclope.sprite.play(`cyclope-${cyclope.direction}-open`);
              });
            }
          }
        });
      },
    });
  }

  outOfBounds(x, y) {
    return x < 4 || x > 14 || y < 2 || y > 12;
  }

  pushable(dx, dy) {
    const targetX = this.sam.x + dx;
    const targetY = this.sam.y + dy;

    if (this.outOfBounds(targetX, targetY)) return false;

    const block = this.blocks.find(
      (block) => block.x === targetX && block.y === targetY
    );
    if (block) return block;

    const dragon = this.dragons.find(
      (dragon) =>
        dragon.x === targetX &&
        dragon.y === targetY &&
        dragon.state === "frozen"
    );
    if (dragon) return dragon;
  }

  collides(obj, dx, dy, isPushed = false) {
    const x = obj.x + dx;
    const y = obj.y + dy;

    if (this.door.x == x && this.door.y == y) {
      return this.door.state === "closed";
    }

    if (this.outOfBounds(x, y)) return true;

    let tile = this.level.getTileAt(x, y, true, "LayerObstacles");
    if (tile && tile.index !== -1) {
      return true;
    }

    if (this.chest.x == x && this.chest.y == y) {
      return isPushed || this.chest.state === "closed";
    }

    if (this.blocks.some((block) => block.x == x && block.y == y)) {
      return true;
    }

    if (
      this.enemies.some(
        (enemy) => enemy.x == x && enemy.y == y && enemy.state !== "destroyed"
      )
    ) {
      return true;
    }

    if (isPushed) {
      if (
        this.crystals.some(
          (crystal) =>
            crystal.x == x && crystal.y == y && crystal.state === "uncollected"
        )
      ) {
        return true;
      }
    }

    return false;
  }
}
