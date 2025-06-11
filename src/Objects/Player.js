class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame, cursors, playerSpeed) {
        super(scene, x, y, texture, frame);

        this.cursors = cursors;
        this.playerSpeed = playerSpeed;

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.body.setDrag(1400);
        this.body.setMaxVelocity(300);

        return this;
    }

    update() {
        // Moving left
        if (this.cursors.left.isDown) {
            this.body.setVelocityX(-this.playerSpeed);
            this.flipX = true;
        } // Moving right
        else if (this.cursors.right.isDown) {
            this.body.setVelocityX(this.playerSpeed);
            this.flipX = false;
        }
        else {
            this.body.setVelocityX(0);
        }

        // Moving up
        if (this.cursors.up.isDown) {
            this.body.setVelocityY(-this.playerSpeed);
        } // Moving down
        else if (this.cursors.down.isDown) {
            this.body.setVelocityY(this.playerSpeed);
        }
        else {
            this.body.setVelocityY(0);
        }
    }

}

class Sword extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setVisible(false);
        this.setActive(false);

        return this;
    }
}