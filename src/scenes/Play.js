import Bullet from '../classes/Bullet'

class Play extends Phaser.Scene {
    constructor() {
        super({
            key: 'play'
        })
    }

    create() {
        
        this.dimensions = {
            height: this.cameras.main.height,
            width: this.cameras.main.width
        }

        this.justStarted = true; //Of the scene just started. 
        //Used for hacky check of if the spacebar has been held down since last scene
        console.log(this.cameras.main.height)
        //Phases of the game
        this.data.set('aiming', true);
        this.data.set('powerSelect', false);        
        this.data.set('score', 0);

        this.player = this.add.image(0.1*this.dimensions.width, 0.7*this.dimensions.height, 'player');

        

        this.reticle = this.add.image(this.player.x, this.player.y-100, 'reticle');
        this.reticle.setData('clockwise', true);
        

        this.enemy = this.physics.add.image(0.9*this.dimensions.width, 0.1*this.dimensions.height, 'enemy');
        this.enemy.setData('alive', true);
        this.enemyTween = this.add.tween({
            targets: this.enemy,
            scale: 0,
            paused: true,
            yoyo: false,
            onComplete: this.nextLevel,
            onCompleteScope: this,
            completeDelay: 1000
        });
        
        this.bullet = new Bullet(this);
        this.bullet.disableBody(true, true); //Deactivate and hide the bullet
        this.bullet.on('bulletDead', function() {
            if (this.enemy.getData('alive')) {
                this.resetLevel();
            }
        }, this);

        this.physics.add.overlap(this.enemy, this.bullet, this.hitEnemy, null, this);

        this.makePowerBar();
        this.powerBar = this.add.image(this.player.x - 64, this.player.y + 32, 'powerBar');
        this.powerBar.setOrigin(0.5, 1)
        this.powerBar.setVisible(false);

        this.powerText = this.add.text(this.powerBar.x, this.powerBar.y - this.powerBar.height, '0');
        this.powerText.setOrigin(0.5, 1).setFontSize(24).setFontStyle('bold').setColor('#000000');
        this.powerText.setVisible(false);

        this.powerTween = this.add.tween({
            targets: this.powerBar,
            paused: true,
            displayHeight: 0,
            ease: 'Linear',
            duration: 1000,
            repeat: -1,
            yoyo: true,
            onUpdate: this.updatePowerText,
            onUpdateScope: this
        })

        this.oneButton = this.input.keyboard.on('keyup_SPACE', this.handleButtonPush, this);

        this.scoreText = this.add.text(0, 0, 'Score: 0', {fontSize: 32, fontStyle: 'bold'}).setOrigin(0).setColor('#000000');
        this.events.on('changedata-score', this.updateScoreText, this);
    }

    update() {
        let aiming = this.data.get('aiming');
        let powerSelect = this.data.get('powerSelect');

        if (aiming) {
            this.moveReticle();
        }
        if (powerSelect) {
            this.showPowerBar();
        }
    }

    handleButtonPush(event) {
        if (this.justStarted) { //Hack to stop unexpected input if spacebar is held down between scenes
            this.justStarted = false;
            return;
        }
        if (this.data.get('aiming')) {
            this.data.set('aiming', false);
            this.data.set('powerSelect', true);
            return
        } else if (this.data.get('powerSelect')) {
            this.data.set('powerSelect', false);
            this.powerTween.stop();
            let speed = this.powerBar.displayHeight/this.powerBar.height;
            this.bullet.fire(this.player, this.reticle, speed)
        }
    }

    moveReticle() {
        let clockwise = this.reticle.getData('clockwise');
        let angle;
        if (clockwise) {
            angle = 0.02;
        } else {
            angle = -0.02;
        }
        Phaser.Actions.RotateAround([this.reticle], this.player, angle);

        if (this.reticle.x < this.player.x) {
            this.reticle.setData('clockwise', !clockwise);
        }
    }

    showPowerBar() {
        this.powerText.setVisible(true);
        this.powerBar.setVisible(true);
        this.powerTween.play();
    }

    makePowerBar() {
        let graphics = this.add.graphics();

        graphics.fillStyle(0x009D00, 1);
        graphics.fillRect(0, 0, 32, 128);

        graphics.generateTexture('powerBar', 32, 128);
        graphics.destroy();
    }

    hitEnemy(enemy, bullet) {
        enemy.setData('alive', false);
        enemy.enableBody(false, false);
        bullet.reset();
        let score = this.data.get('score');
        this.data.values.score += 1;
        this.enemyTween.play();//Goes to next level when complete
    }

    resetLevel() {
        this.data.set('aiming', true);
        this.data.set('powerSelect', false);
        this.data.set('fired', false);
        this.powerBar.setVisible(false);
        this.powerTween.restart().pause();
        this.powerText.setVisible(false);
    }

    nextLevel() {
        this.level++;
        this.resetLevel();
        this.enemy.setScale(1)
        this.enemy.setData('alive', true);
    }

    updateScoreText(scene, newValue, oldValue) {
        this.scoreText.text = 'Score: ' + newValue;
    }

    updatePowerText(tween, target) {
        let power = target.displayHeight/target.height;
        let bounces = Phaser.Math.RoundTo(power*this.bullet.bounces);
        if (bounces != this.bullet.bounces) {
            this.powerText.setText(bounces.toString())
        }
    }
}

export default Play;