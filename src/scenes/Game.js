import * as Phaser from "phaser";

import easystarjs from "easystarjs";

const MAPS = ["desert4", "desert3", "desert1", "desert2"];

export default class Game extends Phaser.Scene {
  constructor() {
    super("Game");
  }

  init(data) {
    this.map = data.map || MAPS[0];
    this.lives = data.lives || 5;
  }

  preload() {}

  create() {
    this.cameras.main.setBackgroundColor("#71ddee");
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

    this.dragons = [];
    this.cyclopes = [];
    this.slimes = [];
    this.flams = [];
    this.crystals = [];
    this.blocks = [];
    this.crystalsRemaining = 0;
    this.textLives.setFrame(this.lives);
    this.ammo = 0;
    this.textAmmo.setFrame(this.ammo);

    // iterate over the key, value pairs in the tilesetItems.tileProperties
    this.level.getLayer("LayerItems").data.forEach((row) => {
      row.forEach((tile) => {
        if (tile.index !== -1) {
          const name = tilesetItems.getTileProperties(tile.index)?.name;
          if (!name) {
            console.error(
              `Tile at (${tile.x}, ${tile.y}) with index ${tile.index} has no name`
            );
            return;
          }
          if (name === "sam") {
            const sprite = this.add
              .sprite(tile.x * 16, tile.y * 16, "sam")
              .setOrigin(0);
            const aura = this.add
              .sprite(tile.x * 16, tile.y * 16, "aura")
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
              state: "alive",
            };
          } else if (name === "dragon") {
            const sprite = this.add
              .sprite(tile.x * 16, tile.y * 16, "dragon")
              .setOrigin(0)
              .play("dragon-idle");
            this.dragons.push({
              x: tile.x,
              y: tile.y,
              sprite,
              state: "idle",
              respawns: true,
            });
          } else if (name.startsWith("cyclope")) {
            const direction = name.split("-")[1];
            const sprite = this.add
              .sprite(tile.x * 16, tile.y * 16, "cyclope")
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
            const sprite = this.add
              .sprite(tile.x * 16, tile.y * 16, "slime")
              .setOrigin(0)
              .play("slime-bounce");
            const ice = this.add
              .sprite(tile.x * 16, tile.y * 16, "ice")
              .setScale(16 / 32)
              .setOrigin(0)
              .setVisible(false)
              .play("ice");
            this.slimes.push({
              x: tile.x,
              y: tile.y,
              sprite,
              ice,
              state: "pursuing",
              dx: 0,
              dy: -1,
              moving: false,
            });
          } else if (name === "flam") {
            const sprite = this.add
              .sprite(tile.x * 16, tile.y * 16, "flam")
              .setOrigin(0)
              .play("flam-idle");
            const finder = new easystarjs.js();
            this.flams.push({
              x: tile.x,
              y: tile.y,
              sprite,
              finder,
              state: "idle",
              moving: false,
            });
          } else if (name === "door") {
            const sprite = this.add
              .sprite(tile.x * 16, tile.y * 16, "items")
              .setFrame(tile.index - tilesetItems.firstgid)
              .setOrigin(0);
            this.door = { x: tile.x, y: tile.y, sprite, state: "closed" };
          } else if (name === "block") {
            const sprite = this.add
              .sprite(tile.x * 16, tile.y * 16, "items")
              .setFrame(tile.index - tilesetItems.firstgid)
              .setOrigin(0);
            this.blocks.push({ x: tile.x, y: tile.y, sprite });
          } else if (name.startsWith("crystal")) {
            const ammo = parseInt(name.split("-")[1], 10);
            const sprite = this.add
              .sprite(tile.x * 16, tile.y * 16, "crystal")
              .setOrigin(0);
            const spark = this.add
              .sprite(tile.x * 16, tile.y * 16, "spark")
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
              .sprite(tile.x * 16, tile.y * 16, "chest")
              .setOrigin(0)
              .play("chest-closed");
            const spark = this.add
              .sprite(tile.x * 16, tile.y * 16, "spark")
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

    this.enemies = [
      ...this.dragons,
      ...this.cyclopes,
      ...this.slimes,
      ...this.flams,
    ];

    this.makeGrid();
    this.slimes.forEach((slime) => {
      this.setPath(slime, this.sam.x, this.sam.y);
    });
    this.flams.forEach((flam) => {
      flam.finder.setAcceptableTiles([0]);
      flam.finder.setGrid(this.grid);
      flam.finder.findPath(flam.x, flam.y, this.sam.x, this.sam.y, (path) => {
        this.setPath(flam, path);
      });
      flam.finder.calculate();
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
    if (this.sam.state === "dead") return;
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

    this.makeGrid(); // Inefficient, optimize later by updating only changed tiles
    this.slimes.forEach((slime) => {
      this.setPath(slime, this.sam.x, this.sam.y);
    });
    this.flams.forEach((flam) => {
      if (flam.state !== "pursuing") return;
      if (this.distance(flam.x, flam.y, this.sam.x, this.sam.y) <= 1) {
        this.sam.state = "dead";
        this.sam.sprite.anims.pause();
        this.sound.play("killed");

        let heroCam = this.cameras.add(
          0,
          0,
          this.scale.width,
          this.scale.height
        );

        this.children.list.forEach((obj) => {
          if (obj !== this.sam.sprite) heroCam.ignore(obj);
        });

        this.cameras.main.setVisible(false);

        // Optional: Fade out the heroCam after a delay
        this.time.delayedCall(
          1000,
          () => {
            this.sound.play("game-over");
            heroCam.fadeOut(1000, 255, 0, 0);
            this.time.delayedCall(2000, () => {
              this.scene.restart({ map: this.map, lives: this.lives - 1 });
            });
          },
          [],
          this
        );

        return;
      }
      flam.finder.setGrid(this.grid);
      flam.finder.findPath(flam.x, flam.y, this.sam.x, this.sam.y, (path) => {
        this.setFlamPath(flam, path);
      });
      flam.finder.calculate();
    });
  }

  makeGrid() {
    this.grid = [];
    for (var y = 0; y < this.level.height; y++) {
      var col = [];
      for (var x = 0; x < this.level.width; x++) {
        const tile = this.level.getTileAt(x, y, true, "LayerObstacles");
        if (tile.index !== -1 || this.outOfBounds(x, y)) {
          col.push(1);
        } else if (this.chest.x == x && this.chest.y == y) {
          col.push(1);
        } else if (this.blocks.some((block) => block.x == x && block.y == y)) {
          col.push(1);
        } else if (
          this.enemies.some(
            (enemy) =>
              enemy.x == x &&
              enemy.y == y &&
              enemy.state !== "destroyed" &&
              enemy.state !== "pursuing"
          )
        ) {
          col.push(1);
        } else if (
          this.crystals.some(
            (crystal) =>
              crystal.x == x && crystal.y == y && crystal.state !== "collected"
          )
        ) {
          col.push(1);
        } else if (
          this.blocks.some((block) => block.x === x && block.y === y)
        ) {
          col.push(1);
        } else {
          col.push(0);
        }
      }
      this.grid.push(col);
    }
  }

  distance(x1, y1, x2, y2) {
    return Math.abs(x1 - x2) + Math.abs(y1 - y2);
  }

  moveSlime(slime, targetX, targetY) {
    slime.moving = true;
    slime.dx = targetX - slime.x;
    slime.dy = targetY - slime.y;
    this.tweens.add({
      targets: slime.sprite,
      x: targetX * 16,
      y: targetY * 16,
      duration: 350,
      onComplete: () => {
        slime.x = targetX;
        slime.y = targetY;
        slime.moving = false;
      },
    });
  }

  moveFlam(flam, targetX, targetY) {
    flam.moving = true;
    flam.dx = targetX - flam.x;
    flam.dy = targetY - flam.y;
    this.tweens.add({
      targets: flam.sprite,
      x: targetX * 16,
      y: targetY * 16,
      duration: 150,
      onComplete: () => {
        flam.x = targetX;
        flam.y = targetY;
        flam.moving = false;
      },
    });
  }

  setFlamPath(flam, path) {
    if (!path || path.length < 2) {
      flam.moving = false;
      return;
    }
    path.shift();
    const next = path.shift();
    this.moveFlam(flam, next.x, next.y);
  }

  setPath(slime, targetX, targetY) {
    if (slime.moving) return;
    if (slime.state !== "pursuing") return;
    const options = [];
    for (const option of [
      { dx: slime.dx, dy: slime.dy, dir: "forward" },
      { dx: -slime.dy, dy: slime.dx, dir: "left" },
      { dx: slime.dy, dy: -slime.dx, dir: "right" },
      { dx: -slime.dx, dy: -slime.dy, dir: "backward" },
    ]) {
      const { dx, dy, dir } = option;
      const newX = slime.x + dx;
      const newY = slime.y + dy;
      if (this.grid[newY][newX] === 0) {
        options.push({
          x: newX,
          y: newY,
          dir,
          dist: this.distance(newX, newY, targetX, targetY),
        });
      }
    }
    options.sort((a, b) => a.dist - b.dist);
    if (options.length === 0) return;
    if (options[0].dir === "backward" && options.length > 1) {
      options.shift(); // remove backward option if there are other options
    }
    if (options[0].dist <= 1) {
      this.sound.play("freeze");
      slime.state = "frozen";
      slime.ice.setPosition(slime.sprite.x, slime.sprite.y);
      slime.ice.setVisible(true);
      slime.sprite.play("slime-frozen");
      return;
    } else {
      this.moveSlime(slime, options[0].x, options[0].y);
    }
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
      if (enemy.respawns) {
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
      }
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
      .sprite(this.sam.x * 16, this.sam.y * 16, "shadow")
      .setOrigin(0)
      .setAlpha(0.2)
      .play("shadow");
    shadow.on("animationcomplete", () => {
      shadow.destroy();
    });
    this.tweens.add({
      targets: this.sam.sprite,
      x: this.sam.sprite.x + dx * 16,
      y: this.sam.sprite.y + dy * 16,
      duration: 200,
      onUpdate: () => {
        this.sam.aura.setPosition(this.sam.sprite.x, this.sam.sprite.y);
        if (pushed) {
          pushed.sprite.x = this.sam.sprite.x + dx * 16;
          pushed.sprite.y = this.sam.sprite.y + dy * 16;
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
            this.anims.resumeAll(); // TODO: is this necessary?
            this.scene.restart({
              map: MAPS[MAPS.indexOf(this.map) + 1],
              lives: this.lives,
            });
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
            .sprite(this.door.x * 16, this.door.y * 16, "smoke")
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
              this.flams.forEach((flam) => {
                flam.state = "pursuing";
                flam.sprite.play("flam-pursue");
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
