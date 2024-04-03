import Load from "./load.ts";
import Menu from "./menu.ts";
import Play from "./play.ts";
import ScaleModes = Phaser.Scale.ScaleModes;
import Center = Phaser.Scale.Center;

const game = new Phaser.Game({
	width: 500,
	height: 340,
	backgroundColor: "#3498db",
	physics: { default: "arcade" },
	parent: "game",
	scale: {
		mode: ScaleModes.FIT,
		autoCenter: Center.CENTER_BOTH,
		min: {
			width: 250,
			height: 170,
		},
		max: {
			width: 1000,
			height: 680,
		},
	},
});

game.scene.add("load", Load);
game.scene.add("menu", Menu);
game.scene.add("play", Play);

game.scene.start("load");
