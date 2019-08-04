class Menu extends Phaser.Scene {
    constructor() {
        super({
            key: "menu"
        })
    }

    preload() {
        this.load.setPath('/assets/img/');
        this.load.image([
            {key: 'bullet', url: 'bullet.png'}, 
            {key:'enemy', url: 'enemy.png'}, 
            {key: 'player', url: 'player.png'},
            {key: 'reticle', url: 'reticle.png'},
            {key: 'wall', url: 'wall.png'}
        ])
    }

    create() {
        this.input.keyboard.once('keydown-SPACE', () => {
            this.startGame();
        });

        let width = this.cameras.main.width;
        let height = this.cameras.main.height;
        let title = this.add.text(
            width/2, 
            0, 
            'Bounce Shot', 
            {fontSize: '72px', fontStyle: 'bold'}
        ).setOrigin(0.5, 0).setColor('#000000');
        

        let infoText = this.add.text(
            width/2,
            height/2,
            'Aim and adjust power using SPACEBAR.\n' +
            'Shoot a bouncy bullet and hit the red enemy for one point.\n' +
            'More power means more bounces.\n' +
            'Don\'t hit yourself.\n',
            {fontSize: '36px', fontStyle: 'bold'}
        ).setOrigin(0.5).setColor('#000000').setAlign('center').setWordWrapWidth(0.9*width);

        let startText = this.add.text(
            width/2, 
            height, 
            'PRESS SPACE TO START', 
            {fontSize: '72px'}
        ).setOrigin(0.5, 1).setColor('#000000');
    }

    startGame() {
        this.scene.start('play')
    }
}

export default Menu;