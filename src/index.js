import 'phaser'

//Scenes
import Menu from './scenes/Menu'
import Play from './scenes/Play'

const config = {
    type: Phaser.AUTO,
    backgroundColor: '#00BFFF',
    physics: {
        default: 'arcade',
        arcade: {
            debug: true
        }
        
    },
    scale: {
        parent: 'game-div',
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    title: "GMTKJam 2019 Only Once",
    scene: [Menu, Play]
}

let game = new Phaser.Game(config)
