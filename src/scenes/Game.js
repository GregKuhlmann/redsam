import * as Phaser from "phaser";

const MAPS = ["desert1", "desert2", "desert3", "desert4", "desert5"];

const DIRECTIONS = {
  up: { dx: 0, dy: -1 },
  down: { dx: 0, dy: 1 },
  left: { dx: -1, dy: 0 },
  right: { dx: 1, dy: 0 },
};

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
    // this.sound.play("main-theme", {
    //   loop: true,
    //   volume: 0.2,
    // });
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
    this.flamBoxes = this.physics.add.group();
    this.pandas = [];
    this.crystals = [];
    this.blocks = [];
    this.crystalsRemaining = 0;
    this.textLives.setFrame(this.lives);
    this.ammo = 0;
    this.textAmmo.setFrame(this.ammo);
    this.projectiles = this.physics.add.group();

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
            const sprite = this.physics.add
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
            const sprite = this.physics.add
              .sprite(tile.x * 16, tile.y * 16, "dragon")
              .setOrigin(0)
              .play("dragon-idle");
            this.dragons.push({
              x: tile.x,
              y: tile.y,
              origX: tile.x,
              origY: tile.y,
              sprite,
              statued: false,
              destroyed: false,
              jettisoned: false,
            });
          } else if (name.startsWith("cyclope")) {
            const direction = name.split("-")[1];
            const sprite = this.physics.add
              .sprite(tile.x * 16, tile.y * 16, "cyclope")
              .setOrigin(0)
              .play(`cyclope-${direction}-closed`);
            const laser = this.physics.add
              .image(0, 0, "laser")
              .setDisplaySize(2, 2)
              .setDepth(1100)
              .setVisible(false);
            this.projectiles.add(laser);
            this.cyclopes.push({
              x: tile.x,
              y: tile.y,
              origX: tile.x,
              origY: tile.y,
              sprite,
              laser,
              state: "closed",
              firing: false,
              direction,
              statued: false,
              destroyed: false,
              jettisoned: false,
            });
          } else if (name.startsWith("panda")) {
            const direction = name.split("-")[1];
            const sprite = this.physics.add
              .sprite(tile.x * 16, tile.y * 16, "panda")
              .setOrigin(0)
              .play(`panda-walk-${direction}`);
            this.pandas.push({
              x: tile.x,
              y: tile.y,
              origX: tile.x,
              origY: tile.y,
              sprite,
              state: "pursuing",
              direction,
              moveDuration: 200,
              moving: false,
              statued: false,
              destroyed: false,
              jettisoned: false,
            });
          } else if (name.startsWith("slime")) {
            const sprite = this.physics.add
              .sprite(tile.x * 16, tile.y * 16, "slime")
              .setOrigin(0)
              .play("slime-bounce");
            const ice = this.physics.add
              .sprite(tile.x * 16, tile.y * 16, "ice")
              .setScale(16 / 32)
              .setOrigin(0)
              .setVisible(false)
              .play("ice");
            this.slimes.push({
              x: tile.x,
              y: tile.y,
              origX: tile.x,
              origY: tile.y,
              sprite,
              ice,
              state: "pursuing",
              moveDuration: 350,
              dx: 0,
              dy: -1,
              moving: false,
              statued: false,
              destroyed: false,
              jettisoned: false,
            });
          } else if (name === "flam") {
            const sprite = this.physics.add
              .sprite(tile.x * 16, tile.y * 16, "flam")
              .setOrigin(0)
              .play("flam-idle");
            this.flamBoxes.add(sprite);
            this.flams.push({
              x: tile.x,
              y: tile.y,
              origX: tile.x,
              origY: tile.y,
              sprite,
              state: "idle",
              moveDuration: 150,
              dx: 1,
              dy: 0,
              moving: false,
              destroyed: false,
              jettisoned: false,
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
      ...this.pandas,
    ];

    this.physics.add.overlap(this.sam.sprite, this.projectiles, () => {
      this.die();
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
    this.input.keyboard.on("keydown-R", () => {
      this.die();
    });
  }

  update() {
    if (this.sam.state === "dead") return;
    this.enemies.forEach((enemy) => {
      const timeDiff = this.time.now - enemy.statued;
      if (enemy.statued && timeDiff > 6500) {
        enemy.statued = null;
        enemy.sprite.body.enable = true;
        enemy.sprite.resetPipeline();
        enemy.sprite.anims.resume();
      } else if (enemy.statued && timeDiff > 4500) {
        const frame = Math.floor((timeDiff / 75) % 2);
        console.log(
          `Enemy statu: ${enemy.sprite.texture.key} - frame: ${frame}`
        );
        if (frame === 0) {
          enemy.sprite.resetPipeline();
        } else {
          enemy.sprite.setPipeline("Grayscale");
        }
      }
    });
    this.cyclopes.forEach((cyclope) => {
      if (this.chest.state === "sparkling") {
        cyclope.state = "open";
      }
      if (cyclope.firing) {
        if (
          !Phaser.Geom.Intersects.RectangleToRectangle(
            this.scale.getViewPort(),
            cyclope.laser.getBounds()
          )
        ) {
          cyclope.laser.setVisible(false);
          cyclope.firing = false;
          cyclope.laser.setVelocity(0, 0);
        }
      }
      if (
        cyclope.state !== "open" ||
        cyclope.statued ||
        cyclope.destroyed ||
        cyclope.jettisoned ||
        cyclope.firing
      )
        return;
      cyclope.sprite.play(`cyclope-${cyclope.direction}-open`);
      if (
        cyclope.direction === "down" &&
        cyclope.x == this.sam.x &&
        cyclope.y < this.sam.y
      ) {
        cyclope.firing = true;
        this.sound.play("laser");
        cyclope.laser.setDisplaySize(2, 2);
        cyclope.laser.setVisible(true);
        cyclope.laser
          .setPosition(cyclope.x * 16 + 7, cyclope.y * 16 + 10)
          .setOrigin(0);
        this.tweens.add({
          targets: cyclope.laser,
          displayHeight: 50,
          duration: 300,
          onComplete: () => {
            cyclope.laser.setVelocityY(300);
          },
        });
      } else if (
        cyclope.direction === "right" &&
        cyclope.y == this.sam.y &&
        cyclope.x < this.sam.x
      ) {
        cyclope.firing = true;
        this.sound.play("laser");
        cyclope.laser.setDisplaySize(2, 2);
        cyclope.laser.setVisible(true);
        cyclope.laser
          .setPosition(cyclope.x * 16 + 13, cyclope.y * 16 + 9)
          .setOrigin(0);
        this.tweens.add({
          targets: cyclope.laser,
          displayWidth: 50,
          duration: 300,
          onComplete: () => {
            cyclope.laser.setVelocityX(300);
          },
        });
      } else if (
        cyclope.direction === "left" &&
        cyclope.y == this.sam.y &&
        cyclope.x > this.sam.x
      ) {
        cyclope.firing = true;
        this.sound.play("laser");
        cyclope.laser.setDisplaySize(2, 2);
        cyclope.laser.setVisible(true);
        cyclope.laser
          .setPosition(cyclope.x * 16 + 3, cyclope.y * 16 + 9)
          .setOrigin(1, 0);
        this.tweens.add({
          targets: cyclope.laser,
          displayWidth: 50,
          duration: 300,
          onComplete: () => {
            cyclope.laser.setVelocityX(-300);
          },
        });
      }
    });

    this.slimes.forEach((slime) => {
      if (slime.statued || slime.destroyed || slime.jettisoned) return;
      if (slime.state === "pursuing" && !slime.moving) {
        if (
          Math.abs(slime.x - this.sam.x) <= 1 &&
          Math.abs(slime.y - this.sam.y) <= 1 // include diagonal movement
        ) {
          this.sound.play("freeze");
          slime.state = "frozen";
          slime.ice.setPosition(slime.sprite.x, slime.sprite.y);
          slime.ice.setVisible(true);
          slime.sprite.play("slime-frozen");
          return;
        }
        const path = this.getPath(slime, this.sam.x, this.sam.y);
        if (path.x !== this.sam.x || path.y !== this.sam.y) {
          this.moveEnemy(slime, path.x, path.y);
        }
      }
    });
    this.flams.forEach((flam) => {
      if (this.chest.state === "sparkling") {
        flam.state = "pursuing";
      }
      if (flam.destroyed || flam.jettisoned || flam.statued) return;
      flam.sprite.setFlipX(flam.sprite.x <= this.sam.sprite.x);
      if (flam.state === "pursuing" && !flam.moving) {
        flam.sprite.play("flam-pursue", true);
        const path = this.getPath(flam, this.sam.x, this.sam.y);
        this.moveEnemy(flam, path.x, path.y);
      }
    });
    this.pandas.forEach((panda) => {
      if (panda.destroyed || panda.jettisoned || panda.statued) return;
      if (panda.state === "pursuing" && !panda.moving) {
        const path = this.getPath(panda, this.sam.x, this.sam.y);
        if (path.x !== this.sam.x || path.y !== this.sam.y) {
          this.moveEnemy(panda, path.x, path.y);
        }
      }
    });

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

  die() {
    if (this.sam.state === "dead") return;
    this.sam.state = "dead";
    this.sam.sprite.anims.pause();
    this.tweens.killAll();
    this.sound.stopAll();
    this.sound.play("killed");

    let heroCam = this.cameras.add(0, 0, this.scale.width, this.scale.height);

    this.children.list.forEach((obj) => {
      if (obj !== this.sam.sprite) heroCam.ignore(obj);
    });

    this.cameras.main.setVisible(false);

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
  }

  distance(x1, y1, x2, y2) {
    return Math.abs(x1 - x2) + Math.abs(y1 - y2);
  }

  moveEnemy(enemy, targetX, targetY) {
    enemy.moving = true;
    enemy.dx = targetX - enemy.x;
    enemy.dy = targetY - enemy.y;
    enemy.x = targetX;
    enemy.y = targetY;
    this.tweens.add({
      targets: enemy.sprite,
      x: targetX * 16,
      y: targetY * 16,
      duration: enemy.moveDuration,
      onComplete: () => {
        enemy.moving = false;
      },
    });
  }

  getPath(enemy, targetX, targetY) {
    if (enemy.direction) {
      enemy.dx = DIRECTIONS[enemy.direction].dx;
      enemy.dy = DIRECTIONS[enemy.direction].dy;
    }
    const options = [];
    for (const option of [
      { dx: enemy.dx, dy: enemy.dy, dir: "forward" },
      { dx: -enemy.dy, dy: enemy.dx, dir: "left" },
      { dx: enemy.dy, dy: -enemy.dx, dir: "right" },
      { dx: -enemy.dx, dy: -enemy.dy, dir: "backward" },
    ]) {
      const { dx, dy, dir } = option;
      const newX = enemy.x + dx;
      const newY = enemy.y + dy;
      if (!this.collides(enemy, dx, dy, true)) {
        options.push({
          x: newX,
          y: newY,
          dir,
          dist: this.distance(newX, newY, targetX, targetY),
        });
      }
    }
    options.sort((a, b) => a.dist - b.dist);
    if (options.length === 0) return { x: enemy.x, y: enemy.y };
    if (options[0].dir === "backward" && options.length > 1) {
      options.shift(); // remove backward option if there are other options
    }
    return options[0];
  }

  shoot() {
    if (this.ammo <= 0) return;
    this.ammo--;
    this.textAmmo.setFrame(this.ammo);
    this.sound.play("freeze");
    const dir = DIRECTIONS[this.sam.direction];
    this.enemies.forEach((enemy) => {
      if (this.sam.x + dir.dx === enemy.x && this.sam.y + dir.dy === enemy.y) {
        if (enemy.statued) {
          this.jettison(enemy, dir);
        } else {
          enemy.statued = this.time.now;
          enemy.sprite.body.enable = false;
          enemy.sprite.anims.pause();
          enemy.sprite.setPipeline("Grayscale");
        }
      }
    });
  }

  jettison(enemy, direction) {
    enemy.jettisoned = true;
    enemy.statued = null;
    enemy.sprite
      .setPosition(enemy.sprite.x + 8, enemy.sprite.y + 8)
      .setOrigin(0.5);
    this.tweens.add({
      targets: enemy.sprite,
      angle: 720,
      scale: 4,
      x: enemy.sprite.x + this.scale.width * direction.dx,
      y: enemy.sprite.y + this.scale.width * direction.dy,
      ease: "Power2",
      duration: 1000,
      repeat: 0,
    });
    // wait 9 seconds then respawn the enemy
    this.time.delayedCall(9000, () => {
      if (this.chest.state === "collected") return;
      this.tweens.killTweensOf(enemy.sprite);
      enemy.sprite
        .setPosition(enemy.origX * 16, enemy.origY * 16)
        .setOrigin(0)
        .setAngle(0)
        .setScale(1)
        .setPipeline("Shadow")
        .setVisible(true);
      this.time.delayedCall(1000, () => {
        if (!enemy.destroyed) {
          enemy.sprite.resetPipeline();
          enemy.sprite.anims.resume();
          enemy.jettisoned = false;
          enemy.statued = null;
          enemy.x = enemy.origX;
          enemy.y = enemy.origY;
          enemy.sprite.setPosition(enemy.x * 16, enemy.y * 16);
          enemy.sprite.body.enable = true;
        }
      });
    });
  }

  destroy(enemy) {
    this.tweens.killTweensOf(enemy.sprite);
    enemy.sprite.anims.pause();
    const smoke = this.add
      .sprite(enemy.sprite.x, enemy.sprite.y, "smoke")
      .setScale(16 / 32)
      .setOrigin(0)
      .play("smoke");
    smoke.on("animationupdate", (animation, frame) => {
      if (frame.index === 3) {
        enemy.destroyed = true;
        enemy.sprite.destroy();
        if (enemy.ice) {
          enemy.ice.destroy();
        }
      }
    });
    smoke.on("animationcomplete", () => {
      smoke.destroy();
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
    this.sam.x += dx;
    this.sam.y += dy;
    if (pushed) {
      pushed.x += dx;
      pushed.y += dy;
    }
    const shadow = this.add
      .sprite(this.sam.sprite.x, this.sam.sprite.y, "shadow")
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
        this.sam.moving = false;
        if (this.door.x == this.sam.x && this.door.y == this.sam.y) {
          this.sam.moving = true;
          this.tweens.killAll();
          this.sound.stopAll();
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
            this.destroy(enemy);
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
              this.physics.add.overlap(this.sam.sprite, this.flamBoxes, () => {
                this.die();
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

    const enemy = this.enemies.find(
      (enemy) =>
        enemy.x === targetX &&
        enemy.y === targetY &&
        enemy.statued &&
        !enemy.destroyed &&
        !enemy.jettisoned
    );
    if (enemy) return enemy;
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
        (enemy) =>
          enemy.x == x && enemy.y == y && !enemy.destroyed && !enemy.jettisoned
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
