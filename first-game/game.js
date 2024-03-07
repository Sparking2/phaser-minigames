class mainScene {
    preload() {
        // load player
        this.load.image('player', './assets/Slime.png');
        this.player = this.physics.add.sprite(100, 100, 'player');

        // load coin
        this.load.image('coin', './assets/Coin.png');
        this.coin = this.physics.add.sprite(300, 300, 'coin');
    }

    create() {
        this.score = 0;
        let style = {font: '20px Arial', fill: '#fff'};
        this.scoreText = this.add.text(20, 20, 'score: ' + this.score, style)

        this.arrow = this.input.keyboard.createCursorKeys();
    }

    update() {
        if(this.physics.overlap(this.player,this.coin)){
            this.hit();
        }

        if (this.arrow.right.isDown) {
            this.player.x += 3;
        } else if (this.arrow.left.isDown) {
            this.player.x -= 3;
        }

        if (this.arrow.down.isDown) {
            this.player.y += 3;
        } else if (this.arrow.up.isDown) {
            this.player.y -= 3;
        }
    }

    hit() {
        this.coin.x = Phaser.Math.Between(100, 600);
        this.coin.y = Phaser.Math.Between(100, 300);

        this.score += 10;

        this.scoreText.setText('score: ' + this.score);

        this.tweens.add({
            targets: this.player,
            duration: 200,
            scaleX: 1.2,
            scaleY: 1.2,
            yoyo: true,
        });
    }
}

new Phaser.Game({
    width: 700,
    height: 400,
    backgroundColor: '#3498db',
    scene: mainScene,
    physics: {default: 'arcade'},
    parent: 'game',
});