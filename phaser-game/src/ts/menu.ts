import { Scene } from "phaser";

class Menu extends Scene {
	private upKey: Phaser.Input.Keyboard.Key | undefined;
	create(data: { score?: number }) {
		const score = data.score ? data.score : 0;

		if (localStorage.getItem("bestScore") === null) {
			localStorage.setItem("bestScore", "0");
		}

		if (score > Number(localStorage.getItem("bestScore"))) {
			localStorage.setItem("bestScore", score.toString());
		}

		this.add.image(250, 170, "background");

		const nameLabel = this.add.text(250, -50, "Super Coin Box", {
			font: "70px Geo",
			color: "#fff",
		});
		nameLabel.setOrigin(0.5, 0.5);

		const scoreText = `score: ${score} \n best score: ${localStorage.getItem(
			"bestScore",
		)}`;
		const scoreLabel = this.add.text(250, 200, scoreText, {
			font: "25px Arial",
			color: "#fff",
			align: "center",
		});
		scoreLabel.setOrigin(0.5, 0.5);

		const startText = "press the up arrow key to start";
		const startLabel = this.add.text(250, 260, startText, {
			font: "25px Arial",
			color: "#fff",
		});
		startLabel.setOrigin(0.5, 0.5);

		this.upKey = this.input.keyboard?.addKey("up");

		this.tweens.add({
			targets: nameLabel,
			y: 80,
			duration: 1000,
			ease: "bounce.out",
		});

		this.tweens.add({
			targets: startLabel,
			angle: { from: -2, to: 2 },
			duration: 1000,
			yoyo: true,
			repeat: -1,
		});
	}

	update() {
		if (this.upKey?.isDown) {
			this.scene.start("play");
		}
	}
}

export default Menu;
