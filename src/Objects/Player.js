class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame, cursors, attackKey, scale, playerSpeed) {
        super(scene, x, y, texture, frame);

        this.cursors = cursors;
        this.attackKey = attackKey;
        this.playerSpeed = playerSpeed;

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.body.setDrag(1400);
        this.body.setMaxVelocity(300);
        this.dir = 0;
        this.attackCdMax = 20;
        this.attackCd = 0;
        this.setScale(scale);

        this.sword = new Sword(scene, 0, 0, "sword", null).setScale(scale);

        return this;
    }

    update() {
        // Moving left
        if (this.cursors.left.isDown) {
            this.body.setVelocityX(-this.playerSpeed);
            this.flipX = true;
            this.dir = 0;
        } // Moving right
        else if (this.cursors.right.isDown) {
            this.body.setVelocityX(this.playerSpeed);
            this.flipX = false;
            this.dir = 2;
        }
        else {
            this.body.setVelocityX(0);
        }

        // Moving up
        if (this.cursors.up.isDown) {
            this.body.setVelocityY(-this.playerSpeed);
            this.dir = 1;
        } // Moving down
        else if (this.cursors.down.isDown) {
            this.body.setVelocityY(this.playerSpeed);
            this.dir = 3;
        }
        else {
            this.body.setVelocityY(0);
        }

        if(this.attackKey.isDown && this.attackCd < 0) {
            this.attackCd = this.attackCdMax;
            this.sword.attack(this.x, this.y, this.dir);
        }

        this.sword.update();

        this.attackCd--;
    }

}

class Sword extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setVisible(false);
        this.setActive(false);
        this.attacking = 0;
        this.dir = 0;

        return this;
    }

    update() {
        if(this.attacking > 0) {
            switch(this.dir) {
                case 0:
                    this.x -= 4;
                    break;
                case 1:
                    this.y -= 4;
                    break;
                case 2:
                    this.x += 4;
                    break;
                case 3:
                    this.y += 4;
                    break;
            }

            this.alpha -= 0.05;
            this.attacking--;

            if(this.attacking <= 0) {
                this.setVisible(false);
                this.setActive(false);
            }
        }
    }

    attack(x, y, dir) {
        switch(dir) {
            case 0:
                this.x = x - (14 * 4);
                this.y = y;
                this.angle = -90;
                break;
            case 1:
                this.x = x;
                this.y = y - (14 * 4);
                this.angle = 0;
                break;
            case 2:
                this.x = x + (14 * 4);
                this.y = y;
                this.angle = 90;
                break;
            case 3:
                this.x = x;
                this.y = y + (14 * 4);
                this.angle = 180;
                break;
        }
        this.setVisible(true);
        this.setActive(true);
        this.alpha = 1;
        this.attacking = 15;
        this.dir = dir;
    }
}