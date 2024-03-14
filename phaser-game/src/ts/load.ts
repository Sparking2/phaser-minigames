import { Scene } from "phaser";

class Load extends Scene {
	preload() {
		this.load.image("background", "assets/background.png");
		this.load.image("player", "assets/player.png");
		this.load.image("wallV", "assets/wallVertical.png");
		this.load.image("wallH", "assets/wallHorizontal.png");
		this.load.image("coin", "assets/coin.png");
		this.load.image("enemy", "assets/enemy.png");

		const loadLabel = this.add.text(250, 170, "loading", {
			font: "30px Arial",
			color: "#fff",
		});
		loadLabel.setOrigin(0.5, 0.5);
	}

	create() {
		this.scene.start("menu");
	}
}

export default Load;
