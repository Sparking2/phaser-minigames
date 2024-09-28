import Phaser from "phaser";
import {Game} from "./scenes/game.js";
import {GameOver} from "./scenes/gameover.js";


/**
 * @type {Phaser.Types.Core.GameConfig}
 */
const config = {
   width: 600,
   height: 300,
    scale:{
       mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    autoRound: false,
    parent: "game-container",
    physics: {
       default: "arcade",
        arcade: {
           gravity: {x: 0, y:350},
            debug: true,
        }
    },
    scene: [Game, GameOver],
}

new Phaser.Game(config);