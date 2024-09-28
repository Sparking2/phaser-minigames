import Phaser from "phaser";

export class Player extends Phaser.GameObjects.Rectangle {
	/**
	 * @param {Phaser.Scene} scene
	 * @param {number} x
	 * @param {number} y
	 */
	constructor(scene, x, y) {
		super(scene, x, y, 32, 32, 0x00ff00);
		this.setOrigin(0.5);
		this.scene.add.existing(this);
		this.scene.physics.add.existing(this);
		this.setScale(1);
		/** @property {boolean} */
		this.jumping = false;
		/** @property {boolean} */
		this.invincible = false;
		/** @property {number} */
		this.health = 10;

		this.body.collideWorldBounds = true;
		this.body.mass = 10;
		this.body.setDragY(10);
	}
}
