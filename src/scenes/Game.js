import * as Phaser from "phaser";

export const MAPS = [
  "desert1",
  "snow2",
  "snow3",
  "snow4",
  "snow5",
  "snow6",
  "snow7",
  "snow8",
  "snow9",
  "snow10",
];

export const MUSIC_VOLUME = 0.5;

const DIRECTIONS = {
  up: { dx: 0, dy: -1 },
  down: { dx: 0, dy: 1 },
  left: { dx: -1, dy: 0 },
  right: { dx: 1, dy: 0 },
};

const ROCK = 319; // Tile index for rock in LayerObstacles
const SNOWBALL = 323; // Tile index for snowball in LayerObstacles
const GREEN = 813; // Tile index for green grass in LayerBackground

function isRock(tile) {
  return tile && (tile.index === ROCK || tile.index === SNOWBALL);
}

function getIntersectionSize(rectA, rectB) {
  const x1 = Math.max(rectA.x, rectB.x);
  const y1 = Math.max(rectA.y, rectB.y);
  const x2 = Math.min(rectA.x + rectA.width, rectB.x + rectB.width);
  const y2 = Math.min(rectA.y + rectA.height, rectB.y + rectB.height);

  const width = x2 - x1;
  const height = y2 - y1;

  if (width > 0 && height > 0) {
    return { width, height };
  } else {
    // No intersection
    return null;
  }
}

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
    if (!this.registry.get("bgm")) {
      const music = this.sound.add("main-theme", {
        loop: true,
        volume: MUSIC_VOLUME,
      });
      music.play();
      this.registry.set("bgm", music);
    } else {
      const music = this.registry.get("bgm");
      if (!music.isPlaying) {
        music.play();
      }
    }
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
    this.add.sprite(288, 134, "font").setOrigin(0).setFrame(10); // "P"
    this.add.sprite(296, 134, "font").setOrigin(0).setFrame(11); // "W"

    this.dragons = [];
    this.cyclopes = [];
    this.slimes = [];
    this.flams = [];
    this.flamBoxes = this.physics.add.group();
    this.octopuses = [];
    this.beasts = [];
    this.pandas = [];
    this.trexs = [];
    this.trexBoxes = this.physics.add.group();
    this.crystals = [];
    this.blocks = [];
    this.arrows = [];
    this.ladders = [];
    this.crystalsRemaining = 0;
    this.textLives.setFrame(this.lives);
    this.ammo = 0;
    this.textAmmo.setFrame(this.ammo);
    this.lasers = this.physics.add.group();
    this.lightnings = this.physics.add.group();
    this.swords = this.physics.add.group();
    this.absorbers = this.physics.add.group();
    this.starting = true;
    this.paused = true;
    this.hammering = false;
    this.hammer = null;
    this.arrowing = false;
    this.arrow = null;
    this.laddering = false;
    this.ladder = null;
    this.floatMap = {};

    // iterate over tiles in LayerObstacles and set collision for grass tiles
    this.level.getLayer("LayerObstacles").data.forEach((row) => {
      row.forEach((tile) => {
        if (isRock(tile)) {
          const absorber = this.physics.add
            .image(tile.getCenterX(), tile.getCenterY(), null)
            .setSize(16, 16)
            .setVisible(false);
          this.absorbers.add(absorber);
          absorber.body.setImmovable(true);
        }
      });
    });

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
              .setOrigin(0)
              .setDepth(10);
            const aura = this.physics.add
              .sprite(tile.x * 16, tile.y * 16, "aura")
              .setScale(16 / 25)
              .setOrigin(0)
              .setAlpha(0)
              .setDepth(100)
              .play("aura");
            aura.body.enable = false;
            this.sam = {
              x: tile.x,
              y: tile.y,
              sprite,
              aura,
              moving: false,
              direction: "down",
              state: "alive",
            };
          } else if (name.startsWith("arrow")) {
            const direction = name.split("-")[1];
            const sprite = this.add
              .sprite(tile.x * 16, tile.y * 16, "arrow")
              .setOrigin(0)
              .setDepth(0)
              .play(`arrow-${direction}`);
            if (tile.x === 18) {
              this.arrow = sprite;
            } else {
              this.arrows.push({
                x: tile.x,
                y: tile.y,
                sprite,
                direction,
              });
            }
          } else if (name === "chest") {
            const sprite = this.add
              .sprite(tile.x * 16, tile.y * 16, "chest")
              .setOrigin(0)
              .setDepth(0)
              .play("chest-closed");
            const spark = this.add
              .sprite(tile.x * 16, tile.y * 16, "spark")
              .setScale(16 / 35)
              .setOrigin(0)
              .setDepth(1)
              .setVisible(false)
              .play("spark");
            this.chest = {
              x: tile.x,
              y: tile.y,
              sprite,
              spark,
              state: "closed",
            };
          } else if (name.startsWith("crystal")) {
            const ammo = parseInt(name.split("-")[1], 10);
            const sprite = this.add
              .sprite(tile.x * 16, tile.y * 16, "crystal")
              .setOrigin(0)
              .setDepth(0);
            const spark = this.add
              .sprite(tile.x * 16, tile.y * 16, "spark")
              .setScale(16 / 35)
              .setOrigin(0)
              .setDepth(1)
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
          } else if (name === "dragon") {
            const sprite = this.physics.add
              .sprite(tile.x * 16, tile.y * 16, "dragon")
              .setOrigin(0)
              .setDepth(10)
              .play("dragon-idle");
            this.dragons.push({
              x: tile.x,
              y: tile.y,
              origX: tile.x,
              origY: tile.y,
              sprite,
              destroyed: false,
            });
          } else if (name.startsWith("cyclope")) {
            const direction = name.split("-")[1];
            const sprite = this.physics.add
              .sprite(tile.x * 16, tile.y * 16, "cyclope")
              .setOrigin(0)
              .setDepth(10)
              .setPushable(false)
              .play(`cyclope-${direction}-closed`);
            const laser = this.physics.add
              .image(0, 0, "laser")
              .setDisplaySize(2, 2)
              .setDepth(100)
              .setVisible(false);
            this.lasers.add(laser);
            this.cyclopes.push({
              x: tile.x,
              y: tile.y,
              origX: tile.x,
              origY: tile.y,
              sprite,
              laser,
              state: "closed",
              firing: false,
              lastFireTime: null,
              direction,
              destroyed: false,
            });
            laser.parent = this.cyclopes[this.cyclopes.length - 1];
          } else if (name.startsWith("panda")) {
            const direction = name.split("-")[1];
            const sprite = this.physics.add
              .sprite(tile.x * 16, tile.y * 16, "panda")
              .setOrigin(0)
              .setDepth(10)
              .play(`panda-walk-${direction}`);
            this.pandas.push({
              x: tile.x,
              y: tile.y,
              origX: tile.x,
              origY: tile.y,
              dx: DIRECTIONS[direction].dx,
              dy: DIRECTIONS[direction].dy,
              sprite,
              state: "pursuing",
              direction,
              moveDuration: 450,
              moving: false,
              destroyed: false,
            });
          } else if (name.startsWith("trex")) {
            const direction = name.split("-")[1];
            const sprite = this.physics.add
              .sprite(tile.x * 16, tile.y * 16, "trex")
              .setOrigin(0)
              .setDepth(10)
              .play(`trex-walk-${direction}`);
            this.trexBoxes.add(sprite);
            this.trexs.push({
              x: tile.x,
              y: tile.y,
              origX: tile.x,
              origY: tile.y,
              dx: DIRECTIONS[direction].dx,
              dy: DIRECTIONS[direction].dy,
              sprite,
              state: "pursuing",
              direction,
              moveDuration: 300,
              moving: false,
              destroyed: false,
            });
          } else if (name.startsWith("slime")) {
            const sprite = this.physics.add
              .sprite(tile.x * 16, tile.y * 16, "slime")
              .setOrigin(0)
              .setDepth(10)
              .play("slime-bounce");
            const ice = this.physics.add
              .sprite(tile.x * 16, tile.y * 16, "ice")
              .setScale(16 / 32)
              .setOrigin(0)
              .setDepth(11)
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
              destroyed: false,
            });
          } else if (name === "flam") {
            const sprite = this.physics.add
              .sprite(tile.x * 16, tile.y * 16, "flam")
              .setOrigin(0)
              .setDepth(10)
              .play("flam-idle");
            this.flamBoxes.add(sprite);
            this.flams.push({
              x: tile.x,
              y: tile.y,
              origX: tile.x,
              origY: tile.y,
              sprite,
              state: "idle",
              moveDuration: 175,
              dx: 1,
              dy: 0,
              moving: false,
              destroyed: false,
            });
          } else if (name === "octopus") {
            const sprite = this.physics.add
              .sprite(tile.x * 16, tile.y * 16, "octopus")
              .setOrigin(0)
              .setDepth(10)
              .play("octopus-happy");
            const lightning = this.physics.add
              .sprite(tile.x * 16 + 8, tile.y * 16 + 8, "lightning")
              .setOrigin(0.5, 0)
              .setBodySize(16, 16)
              .setDepth(100)
              .play("lightning")
              .setVisible(false);
            this.lightnings.add(lightning);
            lightning.body.enable = false;
            this.octopuses.push({
              x: tile.x,
              y: tile.y,
              origX: tile.x,
              origY: tile.y,
              sprite,
              lightning,
              state: "happy",
              destroyed: false,
            });
          } else if (name.startsWith("beast")) {
            const dir = DIRECTIONS[name.split("-")[1]];
            const sprite = this.physics.add
              .sprite(tile.x * 16, tile.y * 16, "beast")
              .setOrigin(0)
              .setDepth(10)
              .play("beast-idle");
            const sword = this.physics.add
              .image(tile.x * 16 + 8, tile.y * 16 + 8, "sword")
              .setOrigin(0.5, 1)
              .setDepth(100)
              .setVisible(false);
            this.swords.add(sword);
            sword.body.enable = false;
            this.beasts.push({
              x: tile.x,
              y: tile.y,
              origX: tile.x,
              origY: tile.y,
              sprite,
              sword,
              state: "stalking",
              moveDuration: 275,
              dx: dir.dx,
              dy: dir.dy,
              moving: false,
              destroyed: false,
            });
          } else if (name === "door") {
            const sprite = this.add
              .sprite(tile.x * 16, tile.y * 16, "items")
              .setFrame(tile.index - tilesetItems.firstgid)
              .setOrigin(0)
              .setDepth(0);
            this.door = { x: tile.x, y: tile.y, sprite, state: "closed" };
          } else if (name === "help") {
            const help = this.add
              .sprite(tile.x * 16, tile.y * 16, "items")
              .setFrame(tile.index - tilesetItems.firstgid)
              .setOrigin(0)
              .setDepth(0)
              .setInteractive();
            help.on("pointerdown", () => {
              this.scene.pause();
              this.scene.launch("Help");
            });
          } else if (name === "hammer") {
            this.hammer = this.add
              .sprite(tile.x * 16, tile.y * 16, "items")
              .setFrame(tile.index - tilesetItems.firstgid)
              .setOrigin(0)
              .setDepth(0);
          } else if (name === "ladder") {
            this.ladder = this.add
              .sprite(tile.x * 16, tile.y * 16, "items")
              .setFrame(tile.index - tilesetItems.firstgid)
              .setOrigin(0)
              .setDepth(0);
          } else if (name === "block") {
            const sprite = this.physics.add
              .sprite(tile.x * 16, tile.y * 16, "items")
              .setFrame(tile.index - tilesetItems.firstgid)
              .setOrigin(0)
              .setDepth(1);
            this.blocks.push({ x: tile.x, y: tile.y, sprite });
            this.absorbers.add(sprite);
            sprite.body.setImmovable(true);
          } else if (name.startsWith("float")) {
            const direction = name.split("-")[1];
            this.floatMap[tile.x + "-" + tile.y] = DIRECTIONS[direction];
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
      ...this.trexs,
      ...this.octopuses,
      ...this.beasts,
    ];
    this.enemySprites = this.physics.add.group(
      this.enemies.map((enemy) => enemy.sprite)
    );
    this.absorbers.addMultiple(this.enemySprites.getChildren());

    this.physics.add.overlap(
      this.sam.aura,
      this.enemySprites,
      (aura, enemySprite) => {
        this.freeze(enemySprite);
        aura.body.enable = false;
        this.tweens.add({
          targets: aura,
          alpha: 0,
          x: enemySprite.x,
          y: enemySprite.y,
          duration: 300,
        });
      }
    );
    this.physics.add.collider(
      this.sam.aura,
      this.absorbers,
      (aura, absorber) => {
        aura.body.enable = false;
        this.tweens.add({
          targets: aura,
          alpha: 0,
          x: absorber.x,
          y: absorber.y,
          duration: 300,
        });
      }
    );

    this.physics.add.overlap(
      this.sam.sprite,
      this.trexBoxes,
      (samSprite, trexBox) => {
        const trex = this.trexs.find((t) => t.sprite === trexBox);
        if (trex && !trex.floating && !trex.destroyed) {
          this.die();
        }
      }
    );
    this.physics.add.overlap(
      this.sam.sprite,
      this.lightnings,
      (sam, lightning) => {
        const overlap = getIntersectionSize(
          sam.getBounds(),
          lightning.getBounds()
        );
        if (overlap && (overlap.width > 6 || overlap.height > 6)) {
          this.die();
        }
      }
    );
    this.physics.add.overlap(this.sam.sprite, this.swords, () => {
      this.die();
    });
    this.physics.add.overlap(this.sam.sprite, this.lasers, (sam, laser) => {
      const overlap = getIntersectionSize(sam.getBounds(), laser.getBounds());
      if (overlap && (overlap.width > 6 || overlap.height > 6)) {
        this.die();
      }
    });
    this.physics.add.collider(
      this.lasers,
      this.absorbers,
      (laser, absorber) => {
        if (laser.parent.sprite === absorber) return; // ignore collision with parent
        this.tweens.killTweensOf(laser);
        laser.setVisible(false);
        laser.setVelocity(0, 0);
        laser.body.enable = false;
        laser.parent.firing = false;
      }
    );

    this.cursors = this.input.keyboard.createCursorKeys();
    window.myCursorKeys = this.cursors;
    window.myPhaserInput = this.input.keyboard;

    this.input.keyboard.on("keydown-SPACE", () => {
      if (this.paused) return;
      (this.arrowing && this.arrowIt()) ||
        (this.hammering && this.hammerIt()) ||
        (this.laddering && this.ladderIt()) ||
        this.shoot();
    });
    this.input.keyboard.on("keydown-H", () => {
      if (this.paused) return;
      this.die();
    });
    this.input.keyboard.on("keydown", () => {
      if (this.starting) {
        this.paused = false;
        this.starting = false;
      }
    });
  }

  update(_time, delta) {
    if (this.paused) return;
    if (this.sam.state === "dead") return;
    this.enemies.forEach((enemy, i) => {
      if (enemy.destroyed) return;
      if (enemy.sprite.statued == null) return;
      if (enemy.floating) {
        if (!enemy.moving && !enemy.docking) {
          const floatDir = this.floatMap[`${enemy.x}-${enemy.y}`];
          if (floatDir) {
            this.moveEnemy(
              enemy,
              enemy.x + floatDir.dx,
              enemy.y + floatDir.dy,
              1300
            );
          } else {
            this.sink(enemy);
          }
        }
        return;
      }
      enemy.sprite.statued += delta;
      if (enemy.sprite.statued > 6500) {
        enemy.sprite.statued = null;
        //enemy.sprite.body.enable = true;
        enemy.sprite.resetPipeline();
        enemy.sprite.anims.resume();
      } else if (enemy.sprite.statued > 4500) {
        const frame = Math.floor((enemy.sprite.statued / 75) % 2);
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
          cyclope.laser.body.enable = false;
        }
      }
      if (
        cyclope.state !== "open" ||
        cyclope.sprite.statued ||
        cyclope.destroyed ||
        cyclope.firing ||
        this.time.now - cyclope.lastFireTime < 200
      )
        return;
      cyclope.sprite.play(`cyclope-${cyclope.direction}-open`);
      if (
        cyclope.direction === "down" &&
        cyclope.x == this.sam.x &&
        cyclope.y < this.sam.y
      ) {
        cyclope.firing = true;
        cyclope.lastFireTime = this.time.now;
        this.sound.play("laser");
        cyclope.laser.setDisplaySize(2, 2);
        cyclope.laser.setVisible(true);
        cyclope.laser.body.enable = true;
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
        cyclope.direction === "up" &&
        cyclope.x == this.sam.x &&
        cyclope.y > this.sam.y
      ) {
        cyclope.firing = true;
        cyclope.lastFireTime = this.time.now;
        this.sound.play("laser");
        cyclope.laser.setDisplaySize(2, 2);
        cyclope.laser.setVisible(true);
        cyclope.laser.body.enable = true;
        cyclope.laser
          .setPosition(cyclope.x * 16 + 7, cyclope.y * 16 + 10)
          .setOrigin(0, 1);
        this.tweens.add({
          targets: cyclope.laser,
          displayHeight: 50,
          duration: 300,
          onComplete: () => {
            cyclope.laser.setVelocityY(-300);
          },
        });
      } else if (
        cyclope.direction === "right" &&
        cyclope.y == this.sam.y &&
        cyclope.x < this.sam.x
      ) {
        cyclope.firing = true;
        cyclope.lastFireTime = this.time.now;
        this.sound.play("laser");
        cyclope.laser.setDisplaySize(2, 2);
        cyclope.laser.setVisible(true);
        cyclope.laser.body.enable = true;
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
        cyclope.lastFireTime = this.time.now;
        this.sound.play("laser");
        cyclope.laser.setDisplaySize(2, 2);
        cyclope.laser.setVisible(true);
        cyclope.laser.body.enable = true;
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
    this.octopuses.forEach((octopus) => {
      if (octopus.sprite.statued || octopus.destroyed) return;
      if (octopus.x === this.sam.x || octopus.y === this.sam.y) {
        octopus.state = "angry";
        octopus.sprite.play("octopus-angry", true);
        this.stun(octopus);
      } else {
        octopus.state = "happy";
        octopus.sprite.play("octopus-happy", true);
      }
    });
    this.slimes.forEach((slime) => {
      if (slime.sprite.statued || slime.destroyed) return;
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
        if (path && (path.x !== this.sam.x || path.y !== this.sam.y)) {
          this.moveEnemy(slime, path.x, path.y);
        }
      }
    });
    this.flams.forEach((flam) => {
      if (this.chest.state === "sparkling") {
        flam.state = "pursuing";
      }
      if (flam.destroyed || flam.sprite.statued) return;
      flam.sprite.setFlipX(flam.sprite.x <= this.sam.sprite.x);
      if (flam.state === "pursuing" && !flam.moving) {
        flam.sprite.play("flam-pursue", true);
        const path = this.getPath(flam, this.sam.x, this.sam.y);
        if (path) {
          this.moveEnemy(flam, path.x, path.y);
        }
      }
    });
    this.pandas.forEach((panda) => {
      if (panda.destroyed || panda.sprite.statued) return;
      if (panda.state === "pursuing" && !panda.moving) {
        const path = this.getPath(panda, this.sam.x, this.sam.y);
        if (path && (path.x !== this.sam.x || path.y !== this.sam.y)) {
          this.moveEnemy(panda, path.x, path.y);
          const dir = this.getDir(panda.dx, panda.dy);
          panda.sprite.play(`panda-walk-${dir}`, true);
        }
      }
    });
    this.beasts.forEach((beast) => {
      if (beast.destroyed || beast.sprite.statued) return;
      if (beast.x === this.sam.x || beast.y === this.sam.y) {
        this.stab(beast);
      }
      if (beast.state === "stalking" && !beast.moving) {
        const path = this.getBeastPath(beast);
        if (path) {
          this.moveEnemy(beast, path.x, path.y);
          beast.sprite.play(`beast-walk`, true);
        }
      }
    });

    this.trexs.forEach((trex) => {
      if (trex.destroyed || trex.sprite.statued) return;
      if (trex.state === "pursuing" && !trex.moving) {
        const path = this.getPath(trex, this.sam.x, this.sam.y);
        if (path) {
          this.moveEnemy(trex, path.x, path.y);
          const dir = this.getDir(trex.dx, trex.dy);
          trex.sprite.play(`trex-walk-${dir}`, true);
        }
      }
    });

    if (this.cursors.left.isDown) {
      this.move("left");
    } else if (this.cursors.right.isDown) {
      this.move("right");
    } else if (this.cursors.up.isDown) {
      this.move("up");
    } else if (this.cursors.down.isDown) {
      this.move("down");
    } else if (!this.sam.moving) {
      this.sam.sprite.play(`sam-idle-${this.sam.direction}`);
    }
  }

  stun(octopus) {
    const dx = Math.sign(this.sam.x - octopus.x);
    const dy = Math.sign(this.sam.y - octopus.y);
    if (dx === 0 && dy === 1) {
      octopus.lightning.setOffset(2, 6).setRotation(Phaser.Math.DegToRad(0));
    } else if (dx === -1 && dy === 0) {
      octopus.lightning
        .setOffset(-12, -8)
        .setRotation(Phaser.Math.DegToRad(90));
    } else if (dx === 0 && dy === -1) {
      octopus.lightning
        .setOffset(2, -22)
        .setRotation(Phaser.Math.DegToRad(180));
    } else if (dx === 1 && dy === 0) {
      octopus.lightning
        .setOffset(16, -8)
        .setRotation(Phaser.Math.DegToRad(270));
    } else {
      console.error("Invalid direction for octopus lightning stun:", dx, dy);
      return;
    }
    const box = { x: octopus.x, y: octopus.y };
    while (box.x !== this.sam.x || box.y !== this.sam.y) {
      if (this.collides(box, dx, dy, false, true)) {
        return;
      }
      box.x += dx;
      box.y += dy;
    }

    this.sam.state = "stunned";
    octopus.lightning.setVisible(true);
    octopus.lightning.body.enable = true;
    octopus.lightning.setVelocity(dx * 150, dy * 150);
  }

  stab(beast) {
    const dx = Math.sign(this.sam.x - beast.x);
    const dy = Math.sign(this.sam.y - beast.y);
    if (dx === 0 && dy === 1) {
      beast.sword.setRotation(Phaser.Math.DegToRad(180));
    } else if (dx === -1 && dy === 0) {
      beast.sword.setRotation(Phaser.Math.DegToRad(270));
    } else if (dx === 0 && dy === -1) {
      beast.sword.setRotation(Phaser.Math.DegToRad(0));
    } else if (dx === 1 && dy === 0) {
      beast.sword.setRotation(Phaser.Math.DegToRad(90));
    } else {
      console.error("Invalid direction for beast sword stab:", dx, dy);
      return;
    }
    const box = { x: beast.x, y: beast.y };
    while (box.x !== this.sam.x || box.y !== this.sam.y) {
      if (this.collides(box, dx, dy, true, true)) {
        return;
      }
      box.x += dx;
      box.y += dy;
      if (box.x > 100 || box.x < 0 || box.y > 100 || box.y < 0) {
        console.error("Stab out of bounds:", box.x, box.y);
        return; // out of bounds
      }
    }

    this.sam.state = "stunned";
    if (!beast.moving && beast.state === "stalking") {
      beast.state = "idle";
      beast.sprite.play("beast-idle");
      beast.sword
        .setPosition(beast.sprite.x + 8, beast.sprite.y + 8)
        .setVisible(true);
      beast.sword.body.enable = true;
      beast.sword.setVelocity(dx * 200, dy * 200);
    }
  }

  endGame() {
    this.paused = true;
    this.sam.sprite.play("sam-idle-down");
    const celebrate = this.sound.add("celebrate");
    // when celebrate sound ends...
    celebrate.once("complete", () => {
      this.sound.stopAll();
      this.sound.play("ending", {
        loop: true,
        volume: 0.5,
      });
      this.sam.sprite.play({ key: "sam-celebrate", repeat: -1 });
      this.tweens.add({
        targets: this.cameras.main,
        rotation: Phaser.Math.DegToRad(360), // full spin
        zoom: 4,
        scrollX: this.sam.sprite.x + 8 - this.cameras.main.width / 2,
        scrollY: this.sam.sprite.y + 8 - this.cameras.main.height / 2,
        duration: 5000,
        ease: "Sine.easeInOut",
      });
      this.time.delayedCall(5000, () => {
        this.cameras.main.fadeOut(5000, 0, 0, 0);
        this.cameras.main.once("camerafadeoutcomplete", () => {
          this.time.delayedCall(1000, () => {
            this.scene.start("Ending");
          });
        });
      });
    });
    celebrate.play();
  }

  die() {
    this.paused = true;
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
          this.lives--;
          if (this.lives <= 0) {
            this.scene.start("GameOver", { map: this.map });
            return;
          }
          this.scene.restart({ map: this.map, lives: this.lives });
        });
      },
      [],
      this
    );
  }

  distance(x1, y1, x2, y2) {
    return Math.abs(x1 - x2) + Math.abs(y1 - y2);
  }

  moveEnemy(enemy, targetX, targetY, moveDuration = null) {
    enemy.moving = true;
    enemy.dx = targetX - enemy.x;
    enemy.dy = targetY - enemy.y;
    enemy.x = targetX;
    enemy.y = targetY;
    this.tweens.add({
      targets: enemy.sprite,
      x: targetX * 16,
      y: targetY * 16,
      duration: moveDuration || enemy.moveDuration,
      onUpdate: () => {
        if (enemy.docked) {
          this.sam.x = enemy.x;
          this.sam.y = enemy.y;
          this.sam.sprite.setPosition(enemy.sprite.x, enemy.sprite.y);
        }
      },
      onComplete: () => {
        enemy.moving = false;
      },
    });
  }

  getDir(dx, dy) {
    if (dx === 0 && dy === -1) return "up";
    if (dx === 0 && dy === 1) return "down";
    if (dx === -1 && dy === 0) return "left";
    if (dx === 1 && dy === 0) return "right";
    return null;
  }

  getPath(enemy, targetX, targetY, avoidGreen = true) {
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
      const tile = this.level.getTileAt(newX, newY, true, "LayerBackground");
      if (avoidGreen && tile && tile.index === GREEN) continue;
      if (this.chest.x === newX && this.chest.y === newY) continue;
      if (
        this.crystals.some(
          (crystal) =>
            crystal.x == newX &&
            crystal.y == newY &&
            crystal.state === "uncollected"
        )
      )
        continue;
      if (!this.collides(enemy, dx, dy)) {
        options.push({
          x: newX,
          y: newY,
          dir,
          dist: this.distance(newX, newY, targetX, targetY),
        });
      }
    }
    Phaser.Utils.Array.Shuffle(options);
    options.sort((a, b) => a.dist - b.dist);
    if (options.length === 0) {
      return;
    }
    if (options[0].dir === "backward" && options.length > 1) {
      options.shift(); // remove backward option if there are other options
    }
    return options[0];
  }

  getBeastPath(beast) {
    if (!this.collides(beast, beast.dx, beast.dy)) {
      return { x: beast.x + beast.dx, y: beast.y + beast.dy };
    }
    beast.dx *= -1; // reverse direction
    beast.dy *= -1;
    if (!this.collides(beast, beast.dx, beast.dy)) {
      return { x: beast.x + beast.dx, y: beast.y + beast.dy };
    }
  }

  glowUp(sprite) {
    const glow = sprite.postFX.addGlow(0xffd700, 2, 0.2, false);
    this.tweens.addCounter({
      from: 0,
      to: 100,
      duration: 300,
      repeat: -1,
      yoyo: true,
      onUpdate: (tween) => {
        const value = tween.getValue(); // 0 to 100
        const color = Phaser.Display.Color.Interpolate.ColorWithColor(
          Phaser.Display.Color.ValueToColor(0xffd700), // gold
          Phaser.Display.Color.ValueToColor(0xff0000), // blue
          100,
          value
        );
        const hex = Phaser.Display.Color.GetColor(color.r, color.g, color.b);
        glow.color = hex;
      },
    });
    return glow;
  }

  hammerIt() {
    const dir = DIRECTIONS[this.sam.direction];
    let tile = this.level.getTileAt(
      this.sam.x + dir.dx,
      this.sam.y + dir.dy,
      true,
      "LayerObstacles"
    );
    if (isRock(tile)) {
      // remove the rock tile
      tile.index = -1;
      tile.setCollision(false);
      tile.setVisible(false);
      this.hammering = false;
      this.hammer.setVisible(false);
      this.sound.play("hammer");
      return true;
    }
    return false;
  }

  arrowIt() {
    let arrowed = false;
    const dir = DIRECTIONS[this.sam.direction];
    this.arrows.forEach((arrow) => {
      if (arrow.x !== this.sam.x + dir.dx || arrow.y !== this.sam.y + dir.dy)
        return;
      arrow.direction = {
        up: "right",
        right: "down",
        down: "left",
        left: "up",
      }[arrow.direction];
      arrow.sprite.play(`arrow-${arrow.direction}`);
      arrowed = true;
      this.arrowing = false;
      this.arrow.setVisible(false);
      this.sound.play("arrow");
    });
    return arrowed;
  }

  ladderIt() {
    const dir = DIRECTIONS[this.sam.direction];
    const newX = this.sam.x + dir.dx;
    const newY = this.sam.y + dir.dy;
    let tile = this.level.getTileAt(newX, newY, true, "LayerObstacles");
    if (tile.tileset && tile.tileset.name === "TilesetWater") {
      const sprite = this.add
        .sprite(newX * 16, newY * 16, "ladder")
        .setOrigin(0)
        .setDepth(0);
      const orientation =
        this.sam.direction === "up" || this.sam.direction === "down"
          ? "vertical"
          : "horizontal";
      sprite.play(`ladder-${orientation}`);
      this.ladders.push({
        x: newX,
        y: newY,
        sprite,
        orientation,
      });
      this.laddering = false;
      this.ladder.setVisible(false);
      this.sound.play("arrow");
      return true;
    }
    return false;
  }

  shoot() {
    if (this.ammo <= 0) return;
    this.ammo--;
    this.textAmmo.setFrame(this.ammo);
    let jettisoned = false;
    const dir = DIRECTIONS[this.sam.direction];
    this.enemies.forEach((enemy) => {
      if (
        this.sam.x + dir.dx === enemy.x &&
        this.sam.y + dir.dy === enemy.y &&
        enemy.sprite.statued
      ) {
        this.sound.play("jettison");
        this.jettison(enemy, dir);
        jettisoned = true;
      }
    });
    if (!jettisoned) {
      this.sam.aura.body.enable = true;
      this.sam.aura.setPosition(this.sam.sprite.x, this.sam.sprite.y);
      this.sam.aura.setAlpha(1);
      this.sam.aura.setVelocity(dir.dx * 350, dir.dy * 350);
      this.sound.play("freeze");
    }
  }

  freeze(enemySprite) {
    enemySprite.statued = 1e-12; // small value to avoid 0
    //enemySprite.body.enable = false;
    enemySprite.anims.pause();
    enemySprite.setPipeline("Grayscale");
  }

  sink(enemy) {
    enemy.floating = false;
    enemy.sprite.statued = null;
    enemy.moving = false;
    enemy.sprite
      .setPosition(enemy.sprite.x + 8, enemy.sprite.y + 8)
      .setOrigin(0.5);
    this.tweens.add({
      targets: enemy.sprite,
      angle: 720,
      scale: 0.1,
      ease: "Power2",
      duration: 1000,
      repeat: 0,
      onComplete: () => {
        enemy.sprite.setVisible(false);
      },
    });
    enemy.x = null;
    enemy.y = null;
    this.respawn(enemy);
  }

  jettison(enemy, direction) {
    enemy.sprite.statued = null;
    enemy.moving = false;
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
      duration: 1200,
      repeat: 0,
    });
    enemy.x = null;
    enemy.y = null;
    this.respawn(enemy);
  }

  respawn(enemy) {
    // wait 9 seconds then respawn the enemy
    this.time.delayedCall(9000, () => {
      if (this.chest.state === "collected") return;
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
          enemy.x = enemy.origX;
          enemy.y = enemy.origY;
          enemy.sprite.setPosition(enemy.x * 16, enemy.y * 16);
          //enemy.sprite.body.enable = true;
        }
      });
    });
  }

  destroy(enemy) {
    this.tweens.killTweensOf(enemy.sprite);
    enemy.sprite.anims.pause();
    if (enemy.firing) {
      enemy.laser.setVisible(false);
      enemy.laser.setVelocity(0, 0);
      enemy.laser.body.enable = false;
    }
    const smoke = this.add
      .sprite(enemy.sprite.x, enemy.sprite.y, "smoke")
      .setScale(16 / 32)
      .setOrigin(0)
      .setDepth(100)
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

  move(direction) {
    if (this.sam.state === "stunned") return;
    const { dx, dy } = DIRECTIONS[direction];
    if (this.sam.moving) return;
    this.sam.direction = direction;
    this.sam.sprite.play(`sam-walk-${direction}`, true);

    const pushed = this.pushable(dx, dy);
    if (
      pushed &&
      !this.intoWater(pushed, dx, dy) &&
      this.collides(pushed, dx, dy, true)
    )
      return;
    const floater = this.enemies.find(
      (enemy) =>
        enemy.sprite.x === this.sam.sprite.x + dx * 16 &&
        enemy.sprite.y === this.sam.sprite.y + dy * 16 &&
        enemy.floating &&
        !enemy.destroyed
    );
    if (!pushed && floater) {
      floater.moving = false;
      floater.docking = true;
      this.tweens.killTweensOf(floater.sprite);
      floater.x = this.sam.x + dx;
      floater.y = this.sam.y + dy;
    } else if (!pushed && this.collides(this.sam, dx, dy)) return;

    // sam is moving, so if docked, detach from docker
    if (this.sam.docker) {
      if (this.sam.sprite.x % 16 !== 0 || this.sam.sprite.y % 16 !== 0) return;
      this.sam.docker.docked = false;
      this.sam.docker = null;
    }

    this.sam.moving = true;
    this.sound.play("step");
    this.sam.x += dx;
    this.sam.y += dy;
    if (pushed) {
      if (this.intoWater(pushed, dx, dy)) {
        this.freeze(pushed.sprite);
        pushed.floating = true;
        pushed.moving = true;
      }
      pushed.x += dx;
      pushed.y += dy;
    }
    const shadow = this.add
      .sprite(this.sam.sprite.x, this.sam.sprite.y, "shadow")
      .setOrigin(0)
      .setDepth(0)
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
        if (pushed) {
          pushed.sprite.x = this.sam.sprite.x + dx * 16;
          pushed.sprite.y = this.sam.sprite.y + dy * 16;
        }
      },
      onComplete: () => {
        this.sam.moving = false;
        if (pushed) {
          pushed.moving = false;
        }
        const docker = this.enemies.find((enemy) => enemy.docking);
        if (docker) {
          docker.docking = false;
          docker.docked = true;
          this.sam.docker = docker;
        }
        if (this.door.x == this.sam.x && this.door.y == this.sam.y) {
          //this.sam.moving = true;
          this.paused = true;
          this.tweens.killAll();
          this.sam.aura.setAlpha(0);
          if (this.map === MAPS[MAPS.length - 1]) {
            this.endGame();
            return;
          }
          this.sam.sprite.play(`sam-idle-${this.sam.direction}`);
          this.cameras.main.fadeOut(500, 0, 0, 0); // duration in ms, RGB fade color
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
            .setDepth(100)
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
            if (
              (this.crystalsRemaining == 3 && this.hammer) ||
              (this.crystalsRemaining === 3 && this.arrow) ||
              (this.crystalsRemaining === 4 && this.ladder)
            ) {
              this.crystals.forEach((crystal) => {
                if (crystal.state !== "collected") {
                  this.glowUp(crystal.sprite);
                }
              });
            }
            if (this.crystalsRemaining == 2 && this.hammer) {
              this.hammering = true;
              this.sound.play("glow");
              this.glowUp(this.hammer);
              this.crystals.forEach((crystal) => {
                if (crystal.sprite) {
                  crystal.sprite.clearFX();
                }
              });
            } else if (this.crystalsRemaining == 2 && this.arrow) {
              this.arrowing = true;
              this.sound.play("glow");
              this.glowUp(this.arrow);
              this.crystals.forEach((crystal) => {
                if (crystal.sprite) {
                  crystal.sprite.clearFX();
                }
              });
            } else if (
              ((this.crystalsRemaining == 3 && this.map != "snow9") ||
                (this.crystalsRemaining == 1 && this.map == "snow9")) &&
              this.ladder
            ) {
              this.laddering = true;
              this.sound.play("glow");
              this.glowUp(this.ladder);
              this.crystals.forEach((crystal) => {
                if (crystal.sprite) {
                  crystal.sprite.clearFX();
                }
              });
            }
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
        enemy.sprite.statued &&
        !enemy.floating &&
        !enemy.destroyed
    );
    if (enemy) return enemy;
  }

  opposingArrow(direction, dx, dy) {
    if (direction === "up" && dx === 0 && dy === 1) return true;
    if (direction === "down" && dx === 0 && dy === -1) return true;
    if (direction === "left" && dx === 1 && dy === 0) return true;
    if (direction === "right" && dx === -1 && dy === 0) return true;
    return false;
  }

  intoWater(obj, dx, dy) {
    if (!obj.sprite || !obj.sprite.statued) return false; // only frozen enemies can be pushed into water
    const x = obj.x + dx;
    const y = obj.y + dy;
    let tile = this.level.getTileAt(x, y, true, "LayerObstacles");
    if (tile && tile.tileset && tile.tileset.name === "TilesetWater") {
      return this.floatMap[`${x}-${y}`] != null;
    }
    return false;
  }

  collides(obj, dx, dy, isPushed = false, rockOnly = false) {
    const x = obj.x + dx;
    const y = obj.y + dy;

    if (this.door.x == x && this.door.y == y) {
      return this.door.state === "closed" || isPushed;
    }

    if (this.outOfBounds(x, y)) return true;

    if (this.ladders.some((ladder) => ladder.x == x && ladder.y == y)) {
      return false;
    }

    let tile = this.level.getTileAt(x, y, true, "LayerObstacles");
    if (tile && tile.index !== -1 && !(rockOnly && !isRock(tile))) {
      return true;
    }

    if (
      this.arrows.some(
        (arrow) =>
          arrow.x == x &&
          arrow.y == y &&
          this.opposingArrow(arrow.direction, dx, dy)
      )
    ) {
      return true;
    }

    if (this.blocks.some((block) => block.x == x && block.y == y)) {
      return true;
    }

    if (
      this.enemies.some(
        (enemy) => enemy.x == x && enemy.y == y && !enemy.destroyed
      )
    ) {
      return true;
    }

    if (isPushed) {
      if (this.chest.x == x && this.chest.y == y) {
        return true;
      }

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
