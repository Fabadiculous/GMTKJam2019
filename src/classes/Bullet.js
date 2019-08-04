import { Math } from "phaser";

class Bullet extends Phaser.Physics.Arcade.Image {
    constructor(scene) {
        super(scene, 0, 0, 'bullet');
        this.scene = scene;
        scene.add.existing(this);
        scene.physics.world.enableBody(this);
        this.speed = 500;
        this.setCollideWorldBounds(true);
        this.body.onWorldBounds = true;
        this.setBounce(1);
        this.MAXBOUNCES = 6;
        this.bounces = this.MAXBOUNCES;
        scene.physics.world.on('worldbounds', this.reduceBounce, this);
    }

    fire(source, target, power) {
        this.enableBody(true, source.x, source.y, true, true);
        this.scene.physics.moveTo(this, target.x, target.y, this.speed);
        this.bounces = Math.RoundTo(power*this.bounces);
    }

    reduceBounce() {
        this.bounces -= 1;
        if (this.bounces  < 0) {
            this.reset();
        }
    }

    reset() {
        this.setVelocity(0);
        //reset the body
        this.enableBody(true, 0, 0, false, false);
        this.setVisible(false);
        this.emit('bulletDead', this);
        this.bounces = this.MAXBOUNCES;
    }
}

export default Bullet;