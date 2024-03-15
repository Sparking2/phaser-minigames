import { Scene } from "phaser";

class Menu extends Scene {
	private upKey: Phaser.Input.Keyboard.Key | undefined;
	create(data: { score?: number }) {
		console.log(data);
		const score = data.score ? data.score : 0;
		this.add.image(250, 170, "background");

		const nameLabel = this.add.text(250, 80, "Super Coin Box", {
			font: "50px Arial",
			color: "#fff",
		});
		nameLabel.setOrigin(0.5, 0.5);

		const scoreText = `score: ${score}`;
		const scoreLabel = this.add.text(250, 200, scoreText);
		scoreLabel.setOrigin(0.5, 0.5);

		const startText = "press the up arrow key to start";
		const startLabel = this.add.text(250, 260, startText, {
			font: "25px Arial",
			color: "#fff",
		});
		startLabel.setOrigin(0.5, 0.5);

		this.upKey = this.input.keyboard?.addKey("up");
	}

	update() {
		if (this.upKey?.isDown) {
			this.scene.start("play");
		}
	}
}

export default Menu;