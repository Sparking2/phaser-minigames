class mainScene {
    preload(){}

    create(){}

    update(){}
}

new Phaser.Game({
    width: 700,
    height: 400,
    backgroundColor: '#3498db',
    scene: mainScene,
    physics: {default: 'arcade'},
    parent: 'game',
});