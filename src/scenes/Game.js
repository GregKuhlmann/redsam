import * as Phaser from "phaser";

import level1 from "/assets/maps/desert2.json";
import tilesetHouse from "/assets/Ninja/Backgrounds/Tilesets/TilesetHouse.png";
import tilesetNature from "/assets/Ninja/Backgrounds/Tilesets/TilesetNature.png";
import tilesetWater from "/assets/Ninja/Backgrounds/Tilesets/TilesetWater.png";
import tilesetItems from "/assets/Ninja/TilesetItems.png";
import tilesetGUI from "/assets/Ninja/TilesetGUI.png";
import spriteSheetRedNinja3 from "/assets/Ninja/Actor/Characters/RedNinja3/SpriteSheet.png";
import spriteSheetDragon from "/assets/Ninja/Actor/Monsters/Dragon/SpriteSheet.png";
import spriteSheetSpark from "/assets/Ninja/FX/Magic/Spark/SpriteSheet.png";
import spriteSheetAura from "/assets/Ninja/FX/Magic/Aura/SpriteSheet.png";
import spriteSheetSmoke from "/assets/Ninja/FX/Smoke/Smoke/SpriteSheet.png";
import spriteSheetChest from "/assets/Ninja/Items/Treasure/BigTreasureChest.png";
import spriteSheetFont from "/assets/Ninja/font.png";
import audioExplosion from "/assets/Ninja/Audio/Sounds/Elemental/Fire3.wav";
import audioCollect from "/assets/Ninja/Audio/Sounds/Bonus/PowerUp1.wav";
import audioChestOpen from "/assets/Ninja/Audio/Sounds/Bonus/Bonus.wav";
import audioCelebrate from "/assets/Ninja/Audio/Jingles/Success4.wav";

const TILESIZE = 16;

class GrayscalePipeline extends Phaser.Renderer.WebGL.Pipelines.SinglePipeline {
  constructor(game) {
    super({
      game,
      fragShader: `
        precision mediump float;
        uniform sampler2D uMainSampler;
        varying vec2 outTexCoord;

        void main() {
          vec4 color = texture2D(uMainSampler, outTexCoord);
          float gray = (color.r + color.g + color.b) / 2.0;
          gl_FragColor = vec4(vec3(gray), color.a);
        }
      `,
    });
  }
}

export class Game extends Phaser.Scene {
  constructor() {
    super("Game");
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
    this.load.tilemapTiledJSON("level1", level1);
    this.game.renderer.pipelines.add(
      "Grayscale",
      new GrayscalePipeline(this.game)
    );

    this.load.spritesheet("dragon", spriteSheetDragon, {
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
    this.load.spritesheet("chest", spriteSheetChest, {
      frameWidth: TILESIZE,
      frameHeight: TILESIZE,
    });
    this.load.spritesheet("font", spriteSheetFont, {
      frameWidth: 8,
      frameHeight: 8,
    });
  }

  create() {
    //const { width, height } = this.scale;

    this.level = this.make.tilemap({ key: "level1" });
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
      frameRate: 5,
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
    this.crystals = [];
    this.blocks = [];
    this.crystalsRemaining = 0;
    this.lives = 5;
    this.textLives.setFrame(this.lives);
    this.ammo = 2;
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
          } else if (name === "crystal") {
            const sprite = this.add
              .sprite(tile.x * TILESIZE, tile.y * TILESIZE, "items")
              .setFrame(tile.index - tilesetItems.firstgid)
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
  }

  shoot() {
    if (this.ammo <= 0) return;
    this.ammo--;
    this.textAmmo.setFrame(this.ammo);
    this.dragons.forEach((dragon) => {
      dragon.state = "frozen";
      dragon.sprite.play("dragon-frozen");
      dragon.sprite.setPipeline("Grayscale");
    });
  }

  move(dx, dy, direction) {
    if (this.sam.moving) return;
    this.sam.direction = direction;
    this.sam.sprite.play(`sam-walk-${direction}`, true);

    const pushed = this.pushable(dx, dy);
    if (pushed && this.collides(pushed, dx, dy, true)) return;
    if (!pushed && this.collides(this.sam, dx, dy)) return;

    console.log(`Pushed: ${pushed}, dx: ${dx}, dy: ${dy}`);

    this.sam.moving = true;
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
            this.scene.restart(); // or use this.scene.start('SceneName') to go to a different scene
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
            if (this.crystalsRemaining == 0) {
              this.sound.play("chestOpen");
              this.chest.state = "sparkling";
              this.chest.sprite.play("chest-sparkling");
              this.chest.spark.setVisible(true);
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

    if (this.dragons.some((dragon) => dragon.x == x && dragon.y == y)) {
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
