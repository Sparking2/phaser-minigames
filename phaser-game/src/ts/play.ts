import { Scene } from "phaser";
import SpriteWithDynamicBody = Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;

class Play extends Scene {
	private player!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
	private arrow?: Phaser.Types.Input.Keyboard.CursorKeys;
	private walls?: Phaser.Physics.Arcade.StaticGroup;
	private coin?: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
	private scoreLabel?: Phaser.GameObjects.Text;
	private score = 0;
	private enemies!: Phaser.Physics.Arcade.Group;

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
		this.time.addEvent({
			delay: 2200,
			callback: () => this.addEnemy(),
			loop: true,
		});

		this.createWorld();
	}

	update() {
		if (this.physics.overlap(this.player, this.coin)) {
			this.takeCoin();
		}

		this.physics.collide(this.player, this.walls);
		this.movePlayer();

		if (this.player.y > 340 || this.player.y < 0) {
			this.playerDie();
		}

		this.physics.collide(this.enemies, this.walls);
		if (this.physics.overlap(this.player, this.enemies)) {
			this.playerDie();
		}
	}

	takeCoin() {
		this.updateCoinPosition();
		this.score += 5;
		this.scoreLabel?.setText(`score: ${this.score}`);
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
		if (this.arrow?.left.isDown) {
			this.player.body.velocity.x = -200;
		} else if (this.arrow?.right.isDown) {
			this.player.body.velocity.x = 200;
		} else {
			this.player.body.velocity.x = 0;
		}

		if (this.arrow?.up.isDown && this.player.body.onFloor()) {
			this.player.body.velocity.y = -320;
		}
	}

	createWorld() {
		this.walls = this.physics.add.staticGroup();
		this.walls.create(10, 170, "wallV");
		this.walls.create(490, 170, "wallV");
		this.walls.create(50, 10, "wallH");
		this.walls.create(450, 10, "wallH");
		this.walls.create(50, 330, "wallH");
		this.walls.create(450, 330, "wallH");
		this.walls.create(0, 170, "wallH");
		this.walls.create(500, 170, "wallH");
		this.walls.create(250, 90, "wallH");
		this.walls.create(250, 250, "wallH");
	}

	playerDie() {
		this.scene.start("menu", { score: this.score });
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
}

export default Play;
