import { Scene } from "phaser";
import SpriteWithDynamicBody = Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
import Orientation = Phaser.Scale.Orientation;

class Play extends Scene {
	private player!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
	private arrow?: Phaser.Types.Input.Keyboard.CursorKeys;
	private walls?: Phaser.Tilemaps.TilemapLayer | null;
	private coin?: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
	private scoreLabel?: Phaser.GameObjects.Text;
	private score = 0;
	private enemies!: Phaser.Physics.Arcade.Group;
	private jumpSound:
		| Phaser.Sound.NoAudioSound
		| Phaser.Sound.HTML5AudioSound
		| Phaser.Sound.WebAudioSound
		| undefined;
	private coinSound:
		| Phaser.Sound.NoAudioSound
		| Phaser.Sound.HTML5AudioSound
		| Phaser.Sound.WebAudioSound
		| undefined;
	private deadSound:
		| Phaser.Sound.NoAudioSound
		| Phaser.Sound.HTML5AudioSound
		| Phaser.Sound.WebAudioSound
		| undefined;
	// private music:
	// 	| Phaser.Sound.NoAudioSound
	// 	| Phaser.Sound.HTML5AudioSound
	// 	| Phaser.Sound.WebAudioSound
	// 	| undefined;
	private emitter: Phaser.GameObjects.Particles.ParticleEmitter | undefined;
	private nextEnemy = 0;

	// movement
	private moveLeft = false;
	private moveRight = false;
	private rotateLabel: Phaser.GameObjects.Text | undefined;

	create() {
		this.coin = this.physics.add.sprite(60, 130, "coin");

		this.player = this.physics.add.sprite(250, 170, "player");
		this.player.body.gravity.y = 500;

		this.arrow = this.input.keyboard?.createCursorKeys();

		this.scoreLabel = this.add.text(30, 25, "score: 0", {
			font: "18px Arial",
			color: "#fff",
		});
		this.score = 0;

		this.enemies = this.physics.add.group();

		this.createWorld();

		this.jumpSound = this.sound.add("jump");
		this.coinSound = this.sound.add("coin");
		this.deadSound = this.sound.add("dead");

		// this.music = this.sound.add("music");
		// this.music.loop = true;
		// this.music.play();

		this.anims.create({
			key: "right",
			frames: this.anims.generateFrameNumbers("player", {
				frames: [1, 2],
			}),
			frameRate: 8,
			repeat: -1,
		});
		this.anims.create({
			key: "left",
			frames: this.anims.generateFrameNumbers("player", {
				frames: [3, 4],
			}),
			frameRate: 8,
			repeat: -1,
		});

		this.emitter = this.add.particles(0, 0, "pixel", {
			quantity: 15,
			speed: { min: -150, max: 150 },
			scale: { start: 2, end: 0.1 },
			lifespan: 800,
			emitting: false,
		});

		if (!this.sys.game.device.os.desktop) {
			this.addMobileInputs();
			this.input.addPointer(1);

			this.rotateLabel = this.add.text(250, 170, "", {
				font: "30px Arial",
				color: "#fff",
				backgroundColor: "#000",
			});
			this.rotateLabel.setOrigin(0.5, 0.5);

			this.scale.on("orientationchange", this.orientationChange, this);

			this.orientationChange();
		}
	}

	update() {
		const now = Date.now();

		if (this.nextEnemy < now) {
			const startDifficulty = 4000;
			const endDifficulty = 1000;
			const scoreToReachEndDifficulty = 100;

			const progress = Math.min(this.score / scoreToReachEndDifficulty, 1);
			const delay =
				startDifficulty - (startDifficulty - endDifficulty) * progress;

			this.addEnemy();
			this.nextEnemy = now + delay;
		}

		if (this.physics.overlap(this.player, this.coin)) {
			this.takeCoin();
		}

		this.movePlayer();

		if (this.player.y > 340 || this.player.y < 0) {
			this.playerDie();
		}

		if (this.physics.overlap(this.player, this.enemies)) {
			this.playerDie();
		}

		if (this.walls) {
			this.physics.collide(this.enemies, this.walls);
			this.physics.collide(this.player, this.walls);
		}
	}

	takeCoin() {
		this.updateCoinPosition();
		this.score += 5;
		this.scoreLabel?.setText(`score: ${this.score}`);
		this.coinSound?.play();

		this.coin?.setScale(0);

		this.tweens.add({
			targets: this.coin,
			scale: 1,
			duration: 300,
		});

		this.tweens.add({
			targets: this.player,
			scale: 1.3,
			duration: 100,
			yoyo: true,
		});
	}

	updateCoinPosition() {
		let positions = [
			{ x: 140, y: 60 },
			{ x: 360, y: 60 },
			{ x: 60, y: 140 },
			{ x: 440, y: 140 },
			{ x: 130, y: 300 },
			{ x: 370, y: 300 },
		];
		positions = positions.filter((coin) => coin.x !== this.coin?.x);
		const newPosition = Phaser.Math.RND.pick(positions);
		this.coin?.setPosition(newPosition.x, newPosition.y);
	}

	movePlayer() {
		if (!this.player.active) return;

		if (this.arrow?.left.isDown || this.moveLeft) {
			this.player.body.velocity.x = -200;
			this.player.anims.play("left", true);
		} else if (this.arrow?.right.isDown || this.moveRight) {
			this.player.body.velocity.x = 200;
			this.player.anims.play("right", true);
		} else {
			this.player.body.velocity.x = 0;
			this.player.setFrame(0);
		}

		if (this.arrow?.up.isDown) {
			this.jumpPlayer();
		}
	}

	createWorld() {
		const map = this.add.tilemap("map");
		if (!map) {
			console.error("Can't create map");
			return;
		}
		const tileset = map.addTilesetImage("tileset", "tileset");
		if (!tileset) {
			console.error("Can't create a tileset");
			return;
		}
		this.walls = map.createLayer("Tile Layer 1", tileset);
		this.walls?.setCollision(1);
	}

	playerDie() {
		if (!this.player.active) return;

		this.player.destroy();

		this.deadSound?.play();
		// this.music?.stop()
		this.emitter?.setPosition(this.player.x, this.player.y);
		this.emitter?.explode();

		this.cameras.main.flash(300, 255, 50, 35);
		this.cameras.main.shake(300, 0.02);

		this.time.addEvent({
			delay: 2000,
			callback: () => this.scene.start("menu", { score: this.score }),
		});
	}

	addEnemy() {
		const enemy: SpriteWithDynamicBody = this.enemies?.create(
			250,
			-10,
			"enemy",
		);
		enemy.body.gravity.y = 500;
		enemy.body.velocity.x = Phaser.Math.RND.pick([-100, 100]);
		enemy.body.bounce.x = 1;

		this.time.addEvent({
			delay: 10000,
			callback: () => enemy.destroy(),
		});
	}

	jumpPlayer() {
		if (this.player.body.onFloor()) {
			this.player.body.velocity.y = -320;
			this.jumpSound?.play();
		}
	}

	addMobileInputs() {
		this.moveLeft = false;
		this.moveRight = false;

		const jumpButton = this.add.sprite(400, 290, "jumpButton");
		jumpButton.setInteractive();
		jumpButton.alpha = 0.5;
		jumpButton.on("pointerdown", this.jumpPlayer, this);

		const leftButton = this.add.sprite(100, 290, "leftButton");
		leftButton.setInteractive();
		leftButton.alpha = 0.5;
		leftButton.on(
			"pointerover",
			() => {
				this.moveLeft = true;
			},
			this,
		);
		leftButton.on(
			"pointerout",
			() => {
				this.moveLeft = false;
			},
			this,
		);

		const rightButton = this.add.sprite(180, 290, "rightButton");
		rightButton.setInteractive();
		rightButton.alpha = 0.5;
		rightButton.on(
			"pointerover",
			() => {
				this.moveRight = true;
			},
			this,
		);
		rightButton.on(
			"pointerout",
			() => {
				this.moveRight = false;
			},
			this,
		);
	}

	orientationChange() {
		if (this.scale.orientation === Orientation.PORTRAIT) {
			this.rotateLabel?.setText(" rotate your device in landscape ");
			this.scene.pause();
		} else if (this.scale.orientation === Orientation.LANDSCAPE) {
			this.rotateLabel?.setText("");
			this.scene.resume();
		}
	}
}

export default Play;
