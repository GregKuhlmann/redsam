import * as Phaser from "phaser";

import heroIdle from "/assets/metroidvania/herochar sprites(new)/herochar_idle_anim_strip_4.png";
import background from "/assets/metroidvania/tiles and background_foreground (new)/background.png";
import tileset from "/assets/metroidvania/tiles and background_foreground (new)/tileset.png";
import coin from "/assets/metroidvania/miscellaneous sprites/coin_anim_strip_6.png";
import coinPickup from "/assets/metroidvania/miscellaneous sprites/coin_pickup_anim_strip_6.png";
import level1 from "/assets/maps/level1.json";
import collect from "/assets/sounds/collect.mp3";
import bounce from "/assets/sounds/bounce.mp3";

const fog = `precision mediump float;
#define MAX_MARCH_STEPS 16
#define MARCH_STEP_SIZE 0.2

#define NOISE_AMPLITUDE 0.75

#define FBM_ITERATIONS 3
#define FBM_AMPLITUDE_GAIN 0.8
#define FBM_FREQUENCY_GAIN 1.9

// 2*tan(radians(45)/2)
#define FOV45 0.82842693331417825056778150945139

uniform float time;
uniform vec2 resolution;

varying vec2 fragCoord;

vec3 UvToWorld(vec2 uv) { return normalize(vec3((uv-0.5) * resolution.xy, -resolution.y / FOV45)); }
vec3 Hash3( vec3 p ) { return fract(sin(vec3( dot(p,vec3(127.1,311.7,786.6)), dot(p,vec3(269.5,183.3,455.8)), dot(p,vec3(419.2,371.9,948.6))))*43758.5453); }
float Voronoi(vec3 p)
{
	vec3 n = floor(p);
	vec3 f = fract(p);

	float shortestDistance = 1.0;
	for (int x = -1; x < 1; x++) {
		for (int y = -1; y < 1; y++) {
			for (int z = -1; z < 1; z++) {
				vec3 o = vec3(x,y,z);
				vec3 r = (o - f) + 1.0 + sin(Hash3(n + o)*50.0)*0.2;
				float d = dot(r,r);
				if (d < shortestDistance) {
					shortestDistance = d;
				}
			}
		}
	}
	return shortestDistance;
}

float FractalVoronoi(vec3 p)
{
	float n = 0.0;
	float f = 0.5, a = 0.5;
	mat2 m = mat2(0.8, 0.6, -0.6, 0.8);
	for (int i = 0; i < FBM_ITERATIONS; i++) {
		n += Voronoi(p * f) * a;
		f *= FBM_FREQUENCY_GAIN;
		a *= FBM_AMPLITUDE_GAIN;
		p.xy = m * p.xy;
	}
	return n;
}

vec2 March(vec3 origin, vec3 direction)
{
	float depth = MARCH_STEP_SIZE;
	float d = 0.0;
	for (int i = 0; i < MAX_MARCH_STEPS; i++) {
		vec3 p = origin + direction * depth;
		d = FractalVoronoi(p) * NOISE_AMPLITUDE;
		depth += max(MARCH_STEP_SIZE, d);
	}
	return vec2(depth, d);
}

void main()
{
	vec2 res = resolution.xy;
	vec2 uv = (fragCoord.xy / res);

	vec3 direction = UvToWorld(uv);
	vec3 origin = vec3(0.0, -time*0.2, 0.0);
	vec2 data = March(origin, direction);
    
	gl_FragColor = vec4(1, 1, 1, 1) * data.y * data.x * 0.7;
}
`;

export class Game extends Phaser.Scene {
  constructor() {
    super("Game");
  }

  preload() {
    this.load.spritesheet("heroIdle", heroIdle, {
      frameWidth: 16,
      frameHeight: 16,
    });
    this.load.spritesheet("coin", coin, {
      frameWidth: 8,
      frameHeight: 8,
    });
    this.load.spritesheet("coinPickup", coinPickup, {
      frameWidth: 8,
      frameHeight: 8,
    });
    this.load.image("background", background);
    this.load.image("tileset", tileset);
    this.load.tilemapTiledJSON("level1", level1);
    this.load.audio("collect", collect);
    this.load.audio("bounce", bounce);
  }

  create() {
    const { height } = this.scale;

    const level = this.make.tilemap({ key: "level1" });
    const tileset = level.addTilesetImage("metroidvania", "tileset");

    this.add
      .tileSprite(0, 0, level.widthInPixels, height, "background")
      .setOrigin(0)
      .setScrollFactor(0.3, 0); // Parallax at 0.3
    level.createLayer("mountains", tileset, 0, 0).setScrollFactor(0.6, 0); // Parallax at 0.6

    const baseShader = new Phaser.Display.BaseShader("BufferShader", fog);
    this.add
      .shader(baseShader, 0, 0, level.widthInPixels, height)
      .setOrigin(0)
      .setScrollFactor(0.5);

    const ground = level
      .createLayer("ground", tileset, 0, 0)
      .setCollisionBetween(1, 1000); // Choose which tile IDs collide

    this.hero = this.physics.add
      .sprite(16, height - 16, "heroIdle")
      .setOrigin(0.5, 1)
      .setBounce(0)
      .setCollideWorldBounds(true);

    // Set the hero's bounding box
    this.hero.body.setSize(10, 16).setOffset(3, 0);

    this.anims.create({
      key: "idle",
      frames: this.anims.generateFrameNumbers("heroIdle", { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1,
    });
    this.hero.play("idle");
    this.physics.add.collider(this.hero, ground);

    // Coins
    this.anims.create({
      key: "coinSpin",
      frames: this.anims.generateFrameNumbers("coin", { start: 0, end: 5 }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: "coinPickup",
      frames: this.anims.generateFrameNumbers("coinPickup", {
        start: 0,
        end: 5,
      }),
      frameRate: 20,
    });
    this.coins = this.physics.add.staticGroup();
    level.getObjectLayer("items").objects.forEach((item) => {
      if (item.name !== "coin") return;
      this.coins.create(item.x, item.y, "coin").setOrigin(0).play("coinSpin");
    });
    this.physics.add.overlap(
      this.hero,
      this.coins,
      this.collectCoin,
      null,
      this
    );

    // Set up camera
    this.cameras.main.setBounds(
      0,
      0,
      level.widthInPixels,
      level.heightInPixels
    );
    this.cameras.main.startFollow(this.hero, true, 0.1, 0.1);

    // Set up physics
    this.physics.world.setBounds(
      0,
      0,
      level.widthInPixels,
      level.heightInPixels
    );

    this.cursors = this.input.keyboard.createCursorKeys();
  }

  update() {
    if (this.cursors.left.isDown) {
      this.hero.setVelocityX(-100);
      this.hero.flipX = true;
    } else if (this.cursors.right.isDown) {
      this.hero.setVelocityX(100);
      this.hero.flipX = false;
    } else {
      this.hero.setVelocityX(0);
    }
    if (this.cursors.up.isDown && this.hero.body.blocked.down) {
      this.hero.setVelocityY(-160);
      this.sound.play("bounce");
    }
  }

  collectCoin(hero, coin) {
    coin.disableBody(false, false);
    this.sound.play("collect");
    coin.play("coinPickup", true).once("animationcomplete", () => {
      coin.destroy();
    });
  }
}
