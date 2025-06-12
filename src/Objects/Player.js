class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame, cursors, attackKey, scale, playerSpeed) {
        super(scene, x, y, texture, frame);

        this.cursors = cursors;
        this.attackKey = attackKey;
        this.playerSpeed = playerSpeed;
        this.hp = 3;
        this.hpText = scene.add.bitmapText(this.x, this.y - 86, "rocketSquare", this.hp, 64, 1);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.scene = scene;

        this.body.setDrag(1400);
        this.body.setMaxVelocity(300);
        this.dir = 0;
        this.attackCdMax = 20;
        this.attackCd = 0;
        this.setScale(scale);
        this.moving = false;

        this.sword = new Sword(scene, 0, 0, "sword", null).setScale(scale);

        this.walkingvfx = scene.add.particles(0, 0, "kenny-particles", {
            frame: ['smoke_03.png', 'smoke_09.png'],
            scale: {start: 0.1, end: 0.05},
            lifespan: 350,
            alpha: {start: 1, end: 0.1}, 
            frequency: 100
        });

        this.walkingvfx.stop();
        this.walkingvfx.startFollow(this, 0, this.displayHeight/2);

        return this;
    }

    update() {
        this.moving = false;

        // Moving left
        if (this.cursors.left.isDown) {
            this.body.setVelocityX(-this.playerSpeed);
            this.flipX = true;
            this.dir = 0;
            this.moving = true;
        } // Moving right
        else if (this.cursors.right.isDown) {
            this.body.setVelocityX(this.playerSpeed);
            this.flipX = false;
            this.dir = 2;
            this.moving = true;
        }
        else {
            this.body.setVelocityX(0);
        }

        // Moving up
        if (this.cursors.up.isDown) {
            this.body.setVelocityY(-this.playerSpeed);
            this.dir = 1;
            this.moving = true;
        } // Moving down
        else if (this.cursors.down.isDown) {
            this.body.setVelocityY(this.playerSpeed);
            this.dir = 3;
            this.moving = true;
        }
        else {
            this.body.setVelocityY(0);
        }

        if(this.moving) { 
            this.walkingvfx.start();
        }
        else {
            this.walkingvfx.stop();
        }

        if(this.attackKey.isDown && this.attackCd < 0) {
            this.attackCd = this.attackCdMax;
            this.sword.attack(this.x, this.y, this.dir);
        }

        this.hpText.y -= 1;
        this.hpText.alpha -= 0.04;

        this.sword.update();

        this.attackCd--;
    }

    onHit() {
        this.scene.sound.play("hit", {
            volume: 0.5 
         });
        this.hp--;
        this.hpText.y = this.y - 86;
        this.hpText.x = this.x;
        this.hpText.alpha = 1;
        this.hpText.setText(this.hp);
        if(this.hp <= 0) {
            this.scene.scene.start("gameover");
        }
    }

    onHeal() {
        this.scene.sound.play("pickup", {
            volume: 0.5 
         });
        this.hp++;
        this.hpText.y = this.y - 86;
        this.hpText.x = this.x;
        this.hpText.alpha = 1;
        this.hpText.setText(this.hp);
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
        switch(dir) { // determine where the sword attack parameters based on the cardinal direction of the attack
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