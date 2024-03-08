import {Scene} from "phaser"

class Main extends Scene {
    private player!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    // private up: Phaser.Input.Keyboard.Key | undefined;
    // private left: Phaser.Input.Keyboard.Key | undefined;
    // private right: Phaser.Input.Keyboard.Key | undefined;
    private arrow: Phaser.Types.Input.Keyboard.CursorKeys | undefined;

    preload() {
        this.load.image('player', 'assets/player.png');
    }

    create() {
        this.player = this.physics.add.sprite(250, 170, 'player');
        this.player.body.gravity.y = 500;

        this.arrow = this.input.keyboard?.createCursorKeys();

        // this.up = this.input.keyboard?.addKey("up");
        // this.left = this.input.keyboard?.addKey("left");
        // this.right = this.input.keyboard?.addKey("right");
    }

    update() {
        this.movePlayer();
    }

    movePlayer() {
        if (this.arrow?.left.isDown) {
            this.player.body.velocity.y = -200;
        } else if (this.arrow?.right.isDown) {
            this.player.body.velocity.x = 200;
        } else {
            this.player.body.velocity.x = 0;
        }

        if (this.arrow?.up.isDown && this.player.body.onFloor()) {
            this.player.body.velocity.y = -320
        }
    }
}

let game = new Phaser.Game({
    width: 500,
    height: 340,
    backgroundColor: '#3498db',
    physics: {default: 'arcade'},
    parent: 'game'
});

game.scene.add('main', Main);

game.scene.start('main');