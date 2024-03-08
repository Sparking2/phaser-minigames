import {Scene} from "phaser"

class Main extends Scene {
    private player!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    private arrow: Phaser.Types.Input.Keyboard.CursorKeys | undefined;
    private walls: Phaser.Physics.Arcade.StaticGroup | undefined;

    preload() {
        this.load.image('player', 'assets/player.png');
        this.load.image('wallV', 'assets/wallVertical.png');
        this.load.image('wallH', 'assets/wallHorizontal.png');
    }

    create() {
        this.player = this.physics.add.sprite(250, 170, 'player');
        this.player.body.gravity.y = 500;

        this.arrow = this.input.keyboard?.createCursorKeys();

        this.createWorld()
    }

    update() {
        this.physics.collide(this.player, this.walls)
        this.movePlayer();

        if (this.player.y > 340 || this.player.y < 0) {
            this.playerDie();
        }
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
            this.player.body.velocity.y = -320
        }
    }

    createWorld() {
        this.walls = this.physics.add.staticGroup();
        this.walls.create(10, 170, 'wallV');
        this.walls.create(490, 170, 'wallV');
        this.walls.create(50, 10, 'wallH');
        this.walls.create(450, 10, 'wallH');
        this.walls.create(50, 330, 'wallH');
        this.walls.create(450, 330, 'wallH');
        this.walls.create(0, 170, 'wallH');
        this.walls.create(500, 170, 'wallH');
        this.walls.create(250, 90, 'wallH');
        this.walls.create(250, 250, 'wallH');
    }

    playerDie() {
        this.scene.start('main');
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